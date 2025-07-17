import cartModel from "../../db/models/cart.model.js"
import stockModel from "../../db/models/stock.model.js"
import productModel from "../../db/models/product.model.js"

// Add item to cart
export let addToCart = async (req, res) => {
    const { productId, stockId, quantity } = req.body
    const userId = req.user._id

    // Check if product exists
    const product = await productModel.findById(productId)
    if (!product) {
        return res.status(404).json({ message: "Product not found" })
    }


    // Check if stock exists and has enough quantity
    const stock = await stockModel.findById(stockId)
    if (!stock || stock.productId.toString() !== productId.toString()) {
        return res.status(404).json({ message: "Stock not found or not belong to this product" })
    }

    if (stock.quantity < quantity) {
        return res.status(400).json({ message: "Insufficient stock quantity" })
    }

    
    // Find existing cart for user
    let cart = await cartModel.findOne({ userId })

    if (!cart) {
        // Create new cart if doesn't exist
        cart = await cartModel.create({
            userId,
            products: [{ productId, stockId, quantity }]
        })
    } else {
        // Check if item already exists in cart
        const existingItemIndex = cart.products.findIndex(
            item => item.productId.toString() === productId && item.stockId.toString() === stockId
        )

        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart.products[existingItemIndex].quantity += quantity
        } else {
            // Add new item to cart
            cart.products.push({ productId, stockId, quantity })
        }

        await cart.save()
    }

    // Populate product and stock details
    await cart.populate([
        { path: 'products.productId', select: 'name price images' },
        { path: 'products.stockId', select: 'color size quantity' }
    ])

    return res.status(201).json({ message: "Item added to cart successfully", cart })
}

// Get user's cart
export let getCart = async (req, res) => {
    const userId = req.user._id

    const cart = await cartModel.findOne({ userId }).populate([
        { path: 'products.productId', select: 'name price images' },
        { path: 'products.stockId', select: 'color size quantity' }
    ])

    if (!cart) {
        return res.status(200).json({ message: "Cart is empty", cart: { products: [] } })
    }

    let total = 0
    let itemCount = 0

    cart.products.forEach(item => {
        total += item.productId.price * item.quantity
        itemCount += item.quantity
    })

    return res.status(200).json({ cart, total, itemCount })
}

// Update cart item quantity
export let updateCartItem = async (req, res) => {
    const { productId, stockId, quantity } = req.body
    const userId = req.user._id

    // Check if stock has enough quantity
    const stock = await stockModel.findById(stockId)
    if (!stock) {
        return res.status(404).json({ message: "Stock not found" })
    }

    if (stock.quantity < quantity) {
        return res.status(400).json({ message: "Insufficient stock quantity" })
    }

    const cart = await cartModel.findOne({ userId })
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" })
    }

    // Find and update the item
    const itemIndex = cart.products.findIndex(
        item => item.productId.toString() === productId && item.stockId.toString() === stockId
    )

    if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found in cart" })
    }

    cart.products[itemIndex].quantity = quantity
    await cart.save()

    // Populate product and stock details
    await cart.populate([
        { path: 'products.productId', select: 'name price images' },
        { path: 'products.stockId', select: 'color size quantity' }
    ])

    return res.status(200).json({ message: "Cart item updated successfully", cart })
}

// Remove item from cart
export let removeFromCart = async (req, res) => {
    const { productId, stockId } = req.body
    const userId = req.user._id

    const cart = await cartModel.findOne({ userId })
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" })
    }

    // Remove the item
    cart.products = cart.products.filter(
        item => !(item.productId.toString() === productId && item.stockId.toString() === stockId)
    )

    await cart.save()

    // Populate remaining items
    await cart.populate([
        { path: 'products.productId', select: 'name price images' },
        { path: 'products.stockId', select: 'color size quantity' }
    ])

    return res.status(200).json({ message: "Item removed from cart successfully", cart })
}

// Clear entire cart
export let clearCart = async (req, res) => {
    const userId = req.user._id

    const cart = await cartModel.findOne({ userId })
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" })
    }

    cart.products = []
    await cart.save()

    return res.status(200).json({ message: "Cart cleared successfully", cart })
}

