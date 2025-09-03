import mongoose from "mongoose"
import orderModel from "../../db/models/order.model.js"
import productModel from "../../db/models/product.model.js"
import categoryModel from "../../db/models/category.model.js"
import userModel from "../../db/models/user.model.js"

// إحصائيات المبيعات العامة
export const getSalesSummary = async (req, res) => {
    try {
        const { startDate, endDate, status } = req.query

        // بناء استعلام التصفية
        const query = {}
        
        // تصفية حسب الحالة (افتراضياً الطلبات المكتملة)
        if (status) {
            query.status = status
        } else {
            query.status = { $in: ["delivered", "shipped"] }
        }

        // تصفية حسب التاريخ
        if (startDate || endDate) {
            query.createdAt = {}
            if (startDate) query.createdAt.$gte = new Date(startDate)
            if (endDate) query.createdAt.$lte = new Date(endDate)
        }

        // حساب إجمالي المبيعات وعدد الطلبات
        const salesStats = await orderModel.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$amount" },
                    totalOrders: { $sum: 1 },
                    totalDiscount: { $sum: "$discount" },
                    totalShipping: { $sum: "$shippingAmount" }
                }
            }
        ])

        // حساب إجمالي عدد القطع المباعة
        const itemsStats = await orderModel.aggregate([
            { $match: query },
            { $unwind: "$cart" },
            {
                $group: {
                    _id: null,
                    totalItems: { $sum: "$cart.quantity" }
                }
            }
        ])

        const result = salesStats[0] || { totalSales: 0, totalOrders: 0, totalDiscount: 0, totalShipping: 0 }
        const totalItems = itemsStats[0]?.totalItems || 0

        // حساب متوسط قيمة الطلب
        const averageOrderValue = result.totalOrders > 0 ? (result.totalSales / result.totalOrders) : 0

        // حساب صافي المبيعات (بدون الشحن)
        const netSales = result.totalSales - result.totalShipping

        return res.status(200).json({
            success: true,
            message: "Sales summary retrieved successfully",
            data: {
                totalSales: Math.round(result.totalSales * 100) / 100,
                netSales: Math.round(netSales * 100) / 100,
                totalOrders: result.totalOrders,
                totalItems: totalItems,
                totalDiscount: Math.round(result.totalDiscount * 100) / 100,
                totalShipping: Math.round(result.totalShipping * 100) / 100,
                averageOrderValue: Math.round(averageOrderValue * 100) / 100,
                period: {
                    startDate: startDate || null,
                    endDate: endDate || null,
                    status: status || "delivered,shipped"
                }
            }
        })

    } catch (error) {
        console.error("Error in getSalesSummary:", error)
        return res.status(500).json({
            success: false,
            message: "Error retrieving sales summary",
            error: error.message
        })
    }
}

// أفضل الفئات مبيعاً
export const getTopCategories = async (req, res) => {
    try {
        const { limit = 10, sortBy = "sales", startDate, endDate } = req.query

        // بناء استعلام التصفية
        const query = { status: { $in: ["delivered", "shipped"] } }
        
        if (startDate || endDate) {
            query.createdAt = {}
            if (startDate) query.createdAt.$gte = new Date(startDate)
            if (endDate) query.createdAt.$lte = new Date(endDate)
        }

        // تجميع البيانات حسب الفئة
        const categoryStats = await orderModel.aggregate([
            { $match: query },
            { $unwind: "$cart" },
            {
                $lookup: {
                    from: "products",
                    localField: "cart.productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $lookup: {
                    from: "categories",
                    localField: "product.category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" },
            {
                $group: {
                    _id: "$category._id",
                    categoryName: { $first: "$category.title" },
                    totalSales: { $sum: { $multiply: ["$product.finalPrice", "$cart.quantity"] } },
                    totalQuantity: { $sum: "$cart.quantity" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: sortBy === "quantity" ? { totalQuantity: -1 } : { totalSales: -1 } },
            { $limit: parseInt(limit) }
        ])

        // حساب النسب المئوية
        const totalSales = categoryStats.reduce((sum, cat) => sum + cat.totalSales, 0)
        const totalQuantity = categoryStats.reduce((sum, cat) => sum + cat.totalQuantity, 0)

        const categoriesWithPercentage = categoryStats.map(category => ({
            categoryId: category._id,
            categoryName: category.categoryName,
            totalSales: Math.round(category.totalSales * 100) / 100,
            totalQuantity: category.totalQuantity,
            orderCount: category.orderCount,
            salesPercentage: totalSales > 0 ? Math.round((category.totalSales / totalSales) * 10000) / 100 : 0,
            quantityPercentage: totalQuantity > 0 ? Math.round((category.totalQuantity / totalQuantity) * 10000) / 100 : 0
        }))

        return res.status(200).json({
            success: true,
            message: "Top categories retrieved successfully",
            data: {
                categories: categoriesWithPercentage,
                summary: {
                    totalCategories: categoriesWithPercentage.length,
                    totalSales: Math.round(totalSales * 100) / 100,
                    totalQuantity: totalQuantity,
                    sortedBy: sortBy
                }
            }
        })

    } catch (error) {
        console.error("Error in getTopCategories:", error)
        return res.status(500).json({
            success: false,
            message: "Error retrieving top categories",
            error: error.message
        })
    }
}

// أفضل المنتجات مبيعاً
export const getTopProducts = async (req, res) => {
    try {
        const { limit = 10, categoryId, sortBy = "sales", startDate, endDate } = req.query

        // بناء استعلام التصفية
        const query = { status: { $in: ["delivered", "shipped"] } }
        
        if (startDate || endDate) {
            query.createdAt = {}
            if (startDate) query.createdAt.$gte = new Date(startDate)
            if (endDate) query.createdAt.$lte = new Date(endDate)
        }

        // تجميع البيانات حسب المنتج
        let pipeline = [
            { $match: query },
            { $unwind: "$cart" },
            {
                $lookup: {
                    from: "products",
                    localField: "cart.productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $lookup: {
                    from: "categories",
                    localField: "product.category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" }
        ]

        // تصفية حسب الفئة إذا تم تحديدها
        if (categoryId) {
            pipeline.push({ $match: { "product.category": new mongoose.Types.ObjectId(categoryId) } })
        }

        pipeline.push(
            {
                $group: {
                    _id: "$product._id",
                    productTitle: { $first: "$product.title" },
                    productPrice: { $first: "$product.finalPrice" },
                    categoryName: { $first: "$category.title" },
                    categoryId: { $first: "$category._id" },
                    brand: { $first: "$product.brand" },
                    totalSales: { $sum: { $multiply: ["$product.finalPrice", "$cart.quantity"] } },
                    totalQuantity: { $sum: "$cart.quantity" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: sortBy === "quantity" ? { totalQuantity: -1 } : { totalSales: -1 } },
            { $limit: parseInt(limit) }
        )

        const productStats = await orderModel.aggregate(pipeline)

        const productsWithStats = productStats.map(product => ({
            productId: product._id,
            productTitle: product.productTitle,
            productPrice: Math.round(product.productPrice * 100) / 100,
            categoryId: product.categoryId,
            categoryName: product.categoryName,
            brand: product.brand,
            totalSales: Math.round(product.totalSales * 100) / 100,
            totalQuantity: product.totalQuantity,
            orderCount: product.orderCount,
            averageOrderQuantity: Math.round((product.totalQuantity / product.orderCount) * 100) / 100
        }))

        return res.status(200).json({
            success: true,
            message: "Top products retrieved successfully",
            data: {
                products: productsWithStats,
                summary: {
                    totalProducts: productsWithStats.length,
                    totalSales: productsWithStats.reduce((sum, p) => sum + p.totalSales, 0),
                    totalQuantity: productsWithStats.reduce((sum, p) => sum + p.totalQuantity, 0),
                    sortedBy: sortBy,
                    filteredByCategory: categoryId || null
                }
            }
        })

    } catch (error) {
        console.error("Error in getTopProducts:", error)
        return res.status(500).json({
            success: false,
            message: "Error retrieving top products",
            error: error.message
        })
    }
}

// إحصائيات زمنية للمبيعات
export const getSalesTimeline = async (req, res) => {
    try {
        const { period = "daily", startDate, endDate, status } = req.query

        
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Start date and end date are required"
            })
        }

        // بناء استعلام التصفية
        const query = {
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
        
        if (status) {
            query.status = status
        } else {
            query.status = { $in: ["delivered", "shipped"] }
        }

        // تحديد تنسيق التجميع حسب الفترة
        let dateFormat
        switch (period) {
            case "daily":
                dateFormat = "%Y-%m-%d"
                break
            case "weekly":
                dateFormat = "%Y-W%U"
                break
            case "monthly":
                dateFormat = "%Y-%m"
                break
            default:
                dateFormat = "%Y-%m-%d"
        }

        const timelineStats = await orderModel.aggregate([
            { $match: query },
            {
                $group: {
                    _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
                    totalSales: { $sum: "$amount" },
                    totalOrders: { $sum: 1 },
                    averageOrderValue: { $avg: "$amount" }
                }
            },
            { $sort: { "_id": 1 } }
        ])

        
        // حساب المقاييس الإضافية
        const totalSales = timelineStats.reduce((sum, day) => sum + day.totalSales, 0)
        const totalOrders = timelineStats.reduce((sum, day) => sum + day.totalOrders, 0)

        const timelineWithGrowth = timelineStats.map((current, index) => {
            const previous = timelineStats[index - 1]
            let growthRate = 0
            
            if (previous && previous.totalSales > 0) {
                growthRate = ((current.totalSales - previous.totalSales) / previous.totalSales) * 100
            }

            return {
                period: current._id,
                totalSales: Math.round(current.totalSales * 100) / 100,
                totalOrders: current.totalOrders,
                averageOrderValue: Math.round(current.averageOrderValue * 100) / 100,
                growthRate: Math.round(growthRate * 100) / 100
            }
        })

        return res.status(200).json({
            success: true,
            message: "Sales timeline retrieved successfully",
            data: {
                timeline: timelineWithGrowth,
                summary: {
                    period: period,
                    totalPeriods: timelineWithGrowth.length,
                    totalSales: Math.round(totalSales * 100) / 100,
                    totalOrders: totalOrders,
                    averageOrderValue: totalOrders > 0 ? Math.round((totalSales / totalOrders) * 100) / 100 : 0,
                    dateRange: {
                        startDate: startDate,
                        endDate: endDate
                    }
                }
            }
        })

    } catch (error) {
        console.error("Error in getSalesTimeline:", error)
        return res.status(500).json({
            success: false,
            message: "Error retrieving sales timeline",
            error: error.message,
            stack: error.stack
        })
    }
}

// إحصائيات العملاء
export const getCustomerInsights = async (req, res) => {
    try {
        const { limit = 20, startDate, endDate, minOrders = 1 } = req.query

        // بناء استعلام التصفية
        const query = { status: { $in: ["delivered", "shipped"] } }
        
        if (startDate || endDate) {
            query.createdAt = {}
            if (startDate) query.createdAt.$gte = new Date(startDate)
            if (endDate) query.createdAt.$lte = new Date(endDate)
        }

        // إحصائيات العملاء
        const customerStats = await orderModel.aggregate([
            { $match: query },
            {
                $group: {
                    _id: "$userId",
                    totalSpent: { $sum: "$amount" },
                    totalOrders: { $sum: 1 },
                    averageOrderValue: { $avg: "$amount" },
                    firstOrderDate: { $min: "$createdAt" },
                    lastOrderDate: { $max: "$createdAt" }
                }
            },
            { $match: { totalOrders: { $gte: parseInt(minOrders) } } },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "customer"
                }
            },
            { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
            { $sort: { totalSpent: -1 } },
            { $limit: parseInt(limit) }
        ])

        // حساب إحصائيات عامة للعملاء
        const totalCustomers = await orderModel.distinct("userId", query)
        const newCustomersQuery = { ...query }
        
        if (startDate) {
            // العملاء الجدد هم الذين أول طلب لهم في الفترة المحددة
            const newCustomerIds = await orderModel.aggregate([
                {
                    $group: {
                        _id: "$userId",
                        firstOrder: { $min: "$createdAt" }
                    }
                },
                {
                    $match: {
                        firstOrder: { $gte: new Date(startDate), $lte: new Date(endDate || new Date()) }
                    }
                }
            ])
            
            var newCustomersCount = newCustomerIds.length
        } else {
            var newCustomersCount = 0
        }

        const customersWithDetails = customerStats.map(customer => ({
            customerId: customer._id,
            customerName: customer.customer?.userName || "Guest",
            customerEmail: customer.customer?.email || null,
            totalSpent: Math.round(customer.totalSpent * 100) / 100,
            totalOrders: customer.totalOrders,
            averageOrderValue: Math.round(customer.averageOrderValue * 100) / 100,
            firstOrderDate: customer.firstOrderDate,
            lastOrderDate: customer.lastOrderDate,
            daysSinceLastOrder: Math.floor((new Date() - customer.lastOrderDate) / (1000 * 60 * 60 * 24))
        }))

        return res.status(200).json({
            success: true,
            message: "Customer insights retrieved successfully",
            data: {
                customers: customersWithDetails,
                summary: {
                    totalCustomers: totalCustomers.length,
                    newCustomers: newCustomersCount,
                    returningCustomers: totalCustomers.length - newCustomersCount,
                    topCustomersShown: customersWithDetails.length,
                    averageCustomerValue: customersWithDetails.length > 0 ? 
                        Math.round((customersWithDetails.reduce((sum, c) => sum + c.totalSpent, 0) / customersWithDetails.length) * 100) / 100 : 0
                }
            }
        })

    } catch (error) {
        console.error("Error in getCustomerInsights:", error)
        return res.status(500).json({
            success: false,
            message: "Error retrieving customer insights",
            error: error.message
        })
    }
}

// إحصائيات شاملة للوحة التحكم
export const getDashboardStats = async (req, res) => {
    try {
        const { period = "month" } = req.query

        // تحديد الفترة الزمنية
        let startDate = new Date()
        switch (period) {
            case "today":
                startDate.setHours(0, 0, 0, 0)
                break
            case "week":
                startDate.setDate(startDate.getDate() - 7)
                break
            case "month":
                startDate.setMonth(startDate.getMonth() - 1)
                break
            case "year":
                startDate.setFullYear(startDate.getFullYear() - 1)
                break
            case "all":
                startDate = null
                break
        }

        const query = startDate ? { createdAt: { $gte: startDate } } : {}

        // إحصائيات عامة متوازية
        const [
            salesStats,
            orderStats,
            productCount,
            categoryCount,
            customerCount
        ] = await Promise.all([
            // إحصائيات المبيعات
            orderModel.aggregate([
                { $match: { ...query, status: { $in: ["delivered", "shipped"] } } },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$amount" },
                        totalOrders: { $sum: 1 }
                    }
                }
            ]),
            // إحصائيات الطلبات حسب الحالة
            orderModel.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]),
            // عدد المنتجات
            productModel.countDocuments(),
            // عدد الفئات
            categoryModel.countDocuments(),
            // عدد العملاء
            orderModel.distinct("userId", query).then(ids => ids.length)
        ])

        // تنظيم إحصائيات الطلبات
        const orderStatusStats = {
            pending: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        }

        orderStats.forEach(stat => {
            orderStatusStats[stat._id] = stat.count
        })

        const sales = salesStats[0] || { totalRevenue: 0, totalOrders: 0 }

        return res.status(200).json({
            success: true,
            message: "Dashboard statistics retrieved successfully",
            data: {
                period: period,
                sales: {
                    totalRevenue: Math.round(sales.totalRevenue * 100) / 100,
                    totalOrders: sales.totalOrders,
                    averageOrderValue: sales.totalOrders > 0 ? 
                        Math.round((sales.totalRevenue / sales.totalOrders) * 100) / 100 : 0
                },
                orders: {
                    total: Object.values(orderStatusStats).reduce((sum, count) => sum + count, 0),
                    pending: orderStatusStats.pending,
                    shipped: orderStatusStats.shipped,
                    delivered: orderStatusStats.delivered,
                    cancelled: orderStatusStats.cancelled
                },
                inventory: {
                    totalProducts: productCount,
                    totalCategories: categoryCount
                },
                customers: {
                    totalCustomers: customerCount
                }
            }
        })

    } catch (error) {
        console.error("Error in getDashboardStats:", error)
        return res.status(500).json({
            success: false,
            message: "Error retrieving dashboard statistics",
            error: error.message
        })
    }
}
