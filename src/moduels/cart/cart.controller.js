import { Router } from "express";
import { asyncHandler } from "../../utils/ErrorHandling.js";
import * as cs from "./cart.service.js";
import validation from "../../middleware/validation.js";
import { 
    addToCartSchema, 
    updateCartItemSchema, 
    removeFromCartSchema, 
    getCartSchema, 
    clearCartSchema 
} from "./cart.schema.js";
import authentication from "../../middleware/authentication.js";

export let cartRouter = Router()

/**
 * @api {post} /cart/add Add item to cart
 * @apiName AddToCart
 * @apiGroup Cart
 * @apiDescription Add a product to user's shopping cart with specified quantity
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiBody {String} productId Product unique identifier
 * @apiBody {String} stockId Stock unique identifier (for specific color/size)
 * @apiBody {Number} quantity Number of items to add (minimum: 1)
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} cart Updated cart with populated product and stock details
 * @apiError {String} message Error message if product/stock not found or insufficient quantity
 */
cartRouter.post("/add", validation(addToCartSchema), authentication, asyncHandler(cs.addToCart))

/**
 * @api {get} /cart Get user's cart
 * @apiName GetCart
 * @apiGroup Cart
 * @apiDescription Retrieve the authenticated user's shopping cart
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiSuccess {Object} cart User's cart with populated product and stock details
 * @apiSuccess {Array} cart.products Array of products in cart
 * @apiSuccess {String} cart.products[].productId Product ID
 * @apiSuccess {String} cart.products[].stockId Stock ID
 * @apiSuccess {Number} cart.products[].quantity Quantity of items
 * @apiSuccess {Object} cart.products[].productId Product details (name, price, images)
 * @apiSuccess {Object} cart.products[].stockId Stock details (color, size, quantity)
 */
cartRouter.get("/", validation(getCartSchema), authentication, asyncHandler(cs.getCart))

/**
 * @api {put} /cart/update Update cart item quantity
 * @apiName UpdateCartItem
 * @apiGroup Cart
 * @apiDescription Update the quantity of a specific item in the cart
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiBody {String} productId Product unique identifier
 * @apiBody {String} stockId Stock unique identifier
 * @apiBody {Number} quantity New quantity (minimum: 1)
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} cart Updated cart with new quantities
 * @apiError {String} message Error message if item not found or insufficient stock
 */
cartRouter.put("/update", validation(updateCartItemSchema), authentication, asyncHandler(cs.updateCartItem))

/**
 * @api {delete} /cart/remove Remove item from cart
 * @apiName RemoveFromCart
 * @apiGroup Cart
 * @apiDescription Remove a specific item from the shopping cart
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiBody {String} productId Product unique identifier
 * @apiBody {String} stockId Stock unique identifier
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} cart Updated cart without the removed item
 * @apiError {String} message Error message if cart not found
 */
cartRouter.delete("/remove", validation(removeFromCartSchema), authentication, asyncHandler(cs.removeFromCart))

/**
 * @api {delete} /cart/clear Clear entire cart
 * @apiName ClearCart
 * @apiGroup Cart
 * @apiDescription Remove all items from the shopping cart
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} cart Empty cart object
 * @apiError {String} message Error message if cart not found
 */
cartRouter.delete("/clear", validation(clearCartSchema), authentication, asyncHandler(cs.clearCart))

/**
 * @api {get} /cart/total Get cart total
 * @apiName GetCartTotal
 * @apiGroup Cart
 * @apiDescription Calculate and return the total value and item count of the cart
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiSuccess {Number} total Total cart value
 * @apiSuccess {Number} itemCount Total number of items in cart
 * @apiSuccess {Object} cart Cart details with populated product information
 */
cartRouter.get("/total", validation(getCartSchema), authentication, asyncHandler(cs.getCartTotal))

