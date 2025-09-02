import { Router } from "express";
import * as ws from "./whisList.service.js"
import { asyncHandler } from "../../utils/ErrorHandling.js";
import validation from "../../middleware/validation.js";
import authentication from "../../middleware/authentication.js";
import { addToWhishList , moveToCart , removeFromWhishList , getWhishList } from "./whisList.service.js";
let whisListRoute = Router()

/**
 * @api {get} /wishlist Get user's wishlist
 * @apiName GetWishlist
 * @apiGroup Wishlist
 * @apiDescription Retrieve the authenticated user's wishlist
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiSuccess {Array} wishlist Array of products in user's wishlist
 * @apiSuccess {String} wishlist[].productId Product ID
 * @apiSuccess {Object} wishlist[].productId Product details (name, price, images)
 * @apiSuccess {Date} wishlist[].createdAt Date added to wishlist
 */
whisListRoute.get("/", validation(ws.getWhisListSchema) , authentication , asyncHandler(getWhishList))

/**
 * @api {post} /wishlist Add product to wishlist
 * @apiName AddToWishlist
 * @apiGroup Wishlist
 * @apiDescription Add a product to user's wishlist
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiBody {String} productId Product unique identifier
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} wishlist Updated wishlist object
 * @apiError {String} message Error message if product already in wishlist or not found
 */
whisListRoute.post("/", validation(ws.addToWhisListSchema) , authentication , asyncHandler(addToWhishList))

/**
 * @api {post} /wishlist/moveToCart Move product from wishlist to cart
 * @apiName MoveToCart
 * @apiGroup Wishlist
 * @apiDescription Move a product from wishlist to shopping cart
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiBody {String} productId Product unique identifier
 * @apiBody {String} stockId Stock unique identifier (for specific color/size)
 * @apiBody {Number} quantity Quantity to add to cart (minimum: 1)
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} cart Updated cart object
 * @apiError {String} message Error message if product not in wishlist or insufficient stock
 */
whisListRoute.post("/moveToCart",validation(ws.moveToCartSchema) , authentication, asyncHandler(moveToCart))

/**
 * @api {post} /wishlist/removeFromWhisList Remove product from wishlist
 * @apiName RemoveFromWishlist
 * @apiGroup Wishlist
 * @apiDescription Remove a product from user's wishlist
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiBody {String} productId Product unique identifier
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} wishlist Updated wishlist object
 * @apiError {String} message Error message if product not in wishlist
 */
whisListRoute.post("/removeFromWhisList",validation(ws.removeFromWhisListSchema) , authentication, asyncHandler(removeFromWhishList))

export default whisListRoute    