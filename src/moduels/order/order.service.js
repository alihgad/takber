import orderModel from "../../db/models/order.model.js"
import cartModel from "../../db/models/cart.model.js"
import couponModel from "../../db/models/coupon.model.js"
import stockModel from "../../db/models/stock.model.js"
import productModel from "../../db/models/product.model.js"
import shippingAmountModel from "../../db/models/shippingAmount.js"
// import mongoose from "mongoose"
import categoryModel from "../../db/models/category.model.js"

// Create new order from cart
export let createOrder = async (req, res) => {
    const { address, phoneNumbers, city, couponId, products } = req.body
    const userId = req.user._id
    let cart = null

    if (userId) {
        // Get user's cart
        cart = await cartModel.findOne({ userId }).populate([
            { path: 'products.productId', select: 'name price images' },
            { path: 'products.stockId', select: 'color size quantity' }
        ])
    }

    // Handle fallback to products from request body
    if ((!cart || cart.products.length === 0) && products && products.length > 0) {
        // Create a temporary cart structure from products
        const populatedProducts = await Promise.all(
            products.map(async (item) => {
                const product = await productModel.findById(item.productId).select('name price images');
                const stock = await stockModel.findById(item.stockId).select('color size quantity');
                
                return {
                    productId: product,
                    stockId: stock,
                    quantity: item.quantity
                };
            })
        );
        
        cart = { products: populatedProducts };
    }

    if (!cart || cart.products.length === 0) {
        return res.status(400).json({ message: "Cart and products is empty" })
    }

    // Calculate total amount with validation
    let totalAmount = 0
    let discount = 0

    for (let item of cart.products) {
        // Validate product and price
        if (!item.productId || !item.productId.price) {
            return res.status(400).json({
                message: `Invalid product data for item: ${item.productId?.name || 'Unknown'}`
            });
        }

        const price = parseFloat(item.productId.price);
        const quantity = parseInt(item.quantity);

        if (isNaN(price) || isNaN(quantity)) {
            return res.status(400).json({
                message: `Invalid price or quantity for product: ${item.productId.name}`
            });
        }

        totalAmount += price * quantity;
    }

    // Get shipping amount for the city
    let shippingAmount = 0
    const shippingInfo = await shippingAmountModel.findOne({
        city: city,
        active: true
    })

    if (shippingInfo) {
        shippingAmount = parseFloat(shippingInfo.amount) || 0;
    } else {
        return res.status(400).json({
            message: `Shipping not available for city: ${city}. Please contact support.`
        })
    }

    // Apply coupon discount if provided
    if (couponId) {
        const coupon = await couponModel.findById(couponId)
        if (coupon && coupon.active && new Date() < coupon.expireDate) {
            discount = (totalAmount * parseFloat(coupon.discount)) / 100
            totalAmount -= discount
        }
    }

    // Add shipping amount to total
    totalAmount += shippingAmount

    // Validate final amount
    if (isNaN(totalAmount) || totalAmount < 0) {
        return res.status(400).json({
            message: "Invalid total amount calculated"
        });
    }

    // Check stock availability and update stock
    for (let item of cart.products) {
        const stock = await stockModel.findById(item.stockId._id || item.stockId)
        if (!stock || stock.quantity < item.quantity) {
            return res.status(400).json({
                message: `Insufficient stock for product: ${item.productId.name}`
            })
        }

        // Update stock quantity
        stock.quantity -= item.quantity
        await stock.save()
    }

    // Create order with proper structure
    const order = await orderModel.create({
        userId,
        cart: cart.products.map(item => ({
            productId: item.productId._id,
            stockId: item.stockId._id || item.stockId, // Ensure stockId is included
            quantity: item.quantity
        })),
        cartId: cart._id || null,
        amount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
        address,
        phoneNumbers,
        city,
        couponId,
        discount: Math.round(discount * 100) / 100,
        shippingAmount: Math.round(shippingAmount * 100) / 100
    })

    // Clear the cart only if it's a real cart (not from products array)
    if (cart._id) {
        cart.products = []
        await cart.save()
    }

    // Populate order details
    await order.populate([
        { path: 'cart.productId', select: 'name price images' },
        { path: 'cart.stockId', select: 'color size' },
        { path: 'couponId', select: 'code discount' }
    ])

    return res.status(201).json({
        message: "Order created successfully",
        order: {
            ...order.toObject(),
            subtotal: totalAmount - shippingAmount
        }
    })
}

// Get user's orders
export let getUserOrders = async (req, res) => {
    const userId = req.user._id

    const orders = await orderModel.find({ userId }).populate([
        { path: 'products.productId', select: 'name price images' },
        { path: 'cart.productId', select: 'name price images' },
        { path: 'cart.stockId', select: 'color size' },
        { path: 'couponId', select: 'code discount' }
    ]).sort({ createdAt: -1 })

    return res.status(200).json({ orders })
}

// Get specific order
export let getOrder = async (req, res) => {
    const { orderId } = req.params
    const userId = req.user._id

    const order = await orderModel.findOne({ _id: orderId, userId }).populate([
        { path: 'products.productId', select: 'name price images' },
        { path: 'cart.productId', select: 'name price images' },
        { path: 'cart.stockId', select: 'color size' },
        { path: 'couponId', select: 'code discount' },
        { path: 'processed_by', select: 'name email' }
    ])

    if (!order) {
        return res.status(404).json({ message: "Order not found" })
    }

    return res.status(200).json({ order })
}

// Update order status (Admin only)
export let updateOrderStatus = async (req, res) => {
    const { orderId } = req.params
    const { status } = req.body
    const adminId = req.user._id

    const order = await orderModel.findById(orderId)
    if (!order) {
        return res.status(404).json({ message: "Order not found" })
    }

    order.status = status
    order.processed_by = adminId
    await order.save()

    await order.populate([
        { path: 'products.productId', select: 'name price images' },
        { path: 'cart.productId', select: 'name price images' },
        { path: 'cart.stockId', select: 'color size' },
        { path: 'couponId', select: 'code discount' },
        { path: 'processed_by', select: 'name email' }
    ])

    return res.status(200).json({
        message: "Order status updated successfully",
        order
    })
}

// Get all orders (Admin only)
export let getAllOrders = async (req, res) => {

    let { page, limit, filter, from, to } = req.query
    if (!limit) {
        limit = 10
    }
    if (!page) {
        page = 1
    }
    let skip = (page - 1) * limit
    const query = {}

    if (filter) {
        query.status = filter
    }
    if (from && to) {
        query.createdAt = { $gte: new Date(from), $lte: new Date(to) }
    }

    const orders = await orderModel.find(query).skip(skip).limit(limit).populate([
        { path: 'userId', select: 'name email' },
        { path: 'products.productId', select: 'name price images' },
        { path: 'cart.productId', select: 'name price images' },
        { path: 'cart.stockId', select: 'color size' },
        { path: 'couponId', select: 'code discount' },
        { path: 'processed_by', select: 'name email' }
    ]).sort({ createdAt: -1 })

    let total = 0
    let itemCount = 0
    orders.forEach(order => {
        total += order.amount
        itemCount += order.products.length
    })

    return res.status(200).json({ orders, total, itemCount })
}

// Cancel order
export let cancelOrder = async (req, res) => {
    const { orderId } = req.params
    const userId = req.user._id

    const order = await orderModel.findOne({ _id: orderId, userId })
    if (!order) {
        return res.status(404).json({ message: "Order not found" })
    }

    // Only allow cancellation of pending orders
    if (order.status !== "pending") {
        return res.status(400).json({
            message: "Cannot cancel order that is already shipped or delivered"
        })
    }

    // Restore stock quantities
    for (let item of order.cart) {
        const stock = await stockModel.findById(item.stockId)
        if (stock) {
            stock.quantity += item.quantity
            await stock.save()
        }
    }

    // Update order status to cancelled
    order.status = "cancelled"
    await order.save()

    await order.populate([
        { path: 'products.productId', select: 'name price images' },
        { path: 'cart.productId', select: 'name price images' },
        { path: 'cart.stockId', select: 'color size' },
        { path: 'couponId', select: 'code discount' }
    ])

    return res.status(200).json({
        message: "Order cancelled successfully",
        order
    })
}

// Get order statistics (Admin only)
export let getOrderStats = async (req, res) => {
    const totalOrders = await orderModel.countDocuments()
    const pendingOrders = await orderModel.countDocuments({ status: "pending" })
    const shippedOrders = await orderModel.countDocuments({ status: "shipped" })
    const deliveredOrders = await orderModel.countDocuments({ status: "delivered" })
    const cancelledOrders = await orderModel.countDocuments({ status: "cancelled" })

    const totalRevenue = await orderModel.aggregate([
        { $match: { status: { $in: ["delivered"] } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ])

    const stats = {
        totalOrders,
        pendingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: totalRevenue[0]?.total || 0
    }

    return res.status(200).json({ stats })
}

// Get total revenue from all sold orders (Admin only)
export let getTotalRevenue = async (req, res) => {
    const { from, to, status } = req.query

    // Build query filter
    const query = {}

    // Filter by status (default to delivered orders)
    if (status) {
        query.status = status
    } else {
        query.status = { $in: ["delivered", "shipped"] } // Only count completed orders
    }

    // Filter by date range
    if (from && to) {
        query.createdAt = { $gte: new Date(from), $lte: new Date(to) }
    } else if (from) {
        query.createdAt = { $gte: new Date(from) }
    } else if (to) {
        query.createdAt = { $lte: new Date(to) }
    }

    // Calculate total revenue
    const revenueResult = await orderModel.aggregate([
        { $match: query },
        { $group: { _id: null, totalRevenue: { $sum: "$amount" }, orderCount: { $sum: 1 } } }
    ])

    // Get additional statistics
    const totalOrders = await orderModel.countDocuments(query)
    const totalDiscount = await orderModel.aggregate([
        { $match: query },
        { $group: { _id: null, totalDiscount: { $sum: "$discount" } } }
    ])

    const result = {
        totalRevenue: revenueResult[0]?.totalRevenue || 0,
        totalOrders: revenueResult[0]?.orderCount || 0,
        totalDiscount: totalDiscount[0]?.totalDiscount || 0,
        averageOrderValue: revenueResult[0]?.totalRevenue && revenueResult[0]?.orderCount
            ? (revenueResult[0].totalRevenue / revenueResult[0].orderCount).toFixed(2)
            : 0,
        filters: {
            status: status || "delivered,shipped",
            from: from || null,
            to: to || null
        }
    }

    return res.status(200).json({
        message: "Total revenue calculated successfully",
        revenue: result
    })
}

// Get category sales statistics (Admin only)
export let getCategorySales = async (req, res) => {
    const { from, to, status } = req.query

    // Build query filter
    const query = {}

    // Filter by status (default to delivered orders)
    if (status) {
        query.status = status
    } else {
        query.status = { $in: ["delivered", "shipped"] } // Only count completed orders
    }

    // Filter by date range
    if (from && to) {
        query.createdAt = { $gte: new Date(from), $lte: new Date(to) }
    } else if (from) {
        query.createdAt = { $gte: new Date(from) }
    } else if (to) {
        query.createdAt = { $lte: new Date(to) }
    }

    // Get orders with populated product details
    const orders = await orderModel.find(query).populate([
        { path: 'products.productId', select: 'name price category' },
        { path: 'cart.productId', select: 'name price category' }
    ])

    // Group by category
    const categoryStats = {}

    orders.forEach(order => {
        order.products.forEach(product => {
            const categoryId = product.productId?.category?.toString()
            if (categoryId) {
                if (!categoryStats[categoryId]) {
                    categoryStats[categoryId] = {
                        categoryId: categoryId,
                        totalRevenue: 0,
                        totalItems: 0,
                        orderCount: 0,
                        products: {}
                    }
                }

                const revenue = product.productId.price * product.quantity
                categoryStats[categoryId].totalRevenue += revenue
                categoryStats[categoryId].totalItems += product.quantity
                categoryStats[categoryId].orderCount += 1

                // Track individual products
                const productId = product.productId._id.toString()
                if (!categoryStats[categoryId].products[productId]) {
                    categoryStats[categoryId].products[productId] = {
                        productId: productId,
                        productName: product.productId.name,
                        totalRevenue: 0,
                        totalItems: 0
                    }
                }
                categoryStats[categoryId].products[productId].totalRevenue += revenue
                categoryStats[categoryId].products[productId].totalItems += product.quantity
            }
        })
    })

    // Convert to array and populate category names
    const categoryIds = Object.keys(categoryStats)
    const categories = await productModel.distinct('category', { category: { $in: categoryIds } })

    // Get category details
    const categoryDetails = await categoryModel.find({ _id: { $in: categoryIds } }).select('name')

    const result = Object.values(categoryStats).map(stat => {
        const categoryDetail = categoryDetails.find(cat => cat._id.toString() === stat.categoryId)
        return {
            categoryId: stat.categoryId,
            categoryName: categoryDetail?.name || 'Unknown Category',
            totalRevenue: stat.totalRevenue,
            totalItems: stat.totalItems,
            orderCount: stat.orderCount,
            averageOrderValue: stat.orderCount > 0 ? (stat.totalRevenue / stat.orderCount).toFixed(2) : 0,
            products: Object.values(stat.products)
        }
    }).sort((a, b) => b.totalRevenue - a.totalRevenue) // Sort by revenue descending

    // Calculate overall totals
    const overallStats = {
        totalRevenue: result.reduce((sum, cat) => sum + cat.totalRevenue, 0),
        totalItems: result.reduce((sum, cat) => sum + cat.totalItems, 0),
        totalCategories: result.length,
        averageRevenuePerCategory: result.length > 0 ? (result.reduce((sum, cat) => sum + cat.totalRevenue, 0) / result.length).toFixed(2) : 0
    }

    return res.status(200).json({
        message: "Category sales statistics calculated successfully",
        filters: {
            status: status || "delivered,shipped",
            from: from || null,
            to: to || null
        },
        overallStats,
        categories: result
    })
}
