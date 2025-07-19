import { Router } from "express";
import * as ss from "./shippingAmount.service.js";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import { asyncHandler } from "../../utils/ErrorHandling.js";
import validation from "../../middleware/validation.js";
import * as ssSchema from "./shippingAmount.schema.js";

let shippingAmountRouter = Router();

/**
 * @api {get} /shippingAmount Get all shipping amounts
 * @apiName GetShippingAmounts
 * @apiGroup ShippingAmount
 * @apiDescription Retrieve all shipping amounts
 * @apiSuccess {Array} shippingAmounts Array of shipping amount objects
 * @apiSuccess {Number} shippingAmounts[].amount Shipping amount
 * @apiSuccess {String} shippingAmounts[].city City name
 * @apiSuccess {Boolean} shippingAmounts[].active Active status
 */
shippingAmountRouter.get("/", asyncHandler(ss.getShippingAmounts));

/**
 * @api {get} /shippingAmount/:id Get shipping amount by ID
 * @apiName GetShippingAmount
 * @apiGroup ShippingAmount
 * @apiDescription Retrieve a specific shipping amount by ID
 * @apiParam {String} id Shipping amount unique identifier
 * @apiSuccess {Object} shippingAmount Shipping amount details
 * @apiSuccess {Number} shippingAmount.amount Shipping amount
 * @apiSuccess {String} shippingAmount.city City name
 * @apiSuccess {Boolean} shippingAmount.active Active status
 * @apiError {String} message Error message if shipping amount not found
 */
shippingAmountRouter.get("/:id", validation(ssSchema.getShippingAmount), asyncHandler(ss.getShippingAmount));

/**
 * @api {post} /shippingAmount Create new shipping amount (Admin)
 * @apiName CreateShippingAmount
 * @apiGroup ShippingAmount
 * @apiDescription Create a new shipping amount (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiBody {Number} amount Shipping amount (minimum: 0)
 * @apiBody {String} city City name
 * @apiBody {Boolean} [active] Active status (default: true)
 * @apiSuccess {Object} shippingAmount Created shipping amount object
 * @apiError {String} message Error message if validation fails or duplicate data
 */
shippingAmountRouter.post("/", authentication, authorization(["admin"]), validation(ssSchema.createShippingAmount), asyncHandler(ss.createShippingAmount));

/**
 * @api {put} /shippingAmount/:id Update shipping amount (Admin)
 * @apiName UpdateShippingAmount
 * @apiGroup ShippingAmount
 * @apiDescription Update shipping amount information (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiParam {String} id Shipping amount unique identifier
 * @apiBody {Number} [amount] New shipping amount
 * @apiBody {String} [city] New city name
 * @apiBody {Boolean} [active] New active status
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} shippingAmount Updated shipping amount object
 * @apiError {String} message Error message if shipping amount not found
 */
shippingAmountRouter.put("/:id", authentication, authorization(["admin"]), validation(ssSchema.updateShippingAmount), asyncHandler(ss.updateShippingAmount));

/**
 * @api {delete} /shippingAmount/:id Delete shipping amount (Admin)
 * @apiName DeleteShippingAmount
 * @apiGroup ShippingAmount
 * @apiDescription Delete a shipping amount (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiParam {String} id Shipping amount unique identifier
 * @apiSuccess {String} message Success message
 * @apiError {String} message Error message if shipping amount not found
 */
shippingAmountRouter.delete("/:id", authentication, authorization(["admin"]), validation(ssSchema.deleteShippingAmount), asyncHandler(ss.deleteShippingAmount));

/**
 * @api {get} /shippingAmount/city/:city Get shipping amount by city
 * @apiName GetShippingAmountByCity
 * @apiGroup ShippingAmount
 * @apiDescription Retrieve shipping amount for a specific city
 * @apiParam {String} city City name
 * @apiSuccess {Object} shippingAmount Shipping amount for the city
 * @apiSuccess {Number} shippingAmount.amount Shipping amount
 * @apiSuccess {String} shippingAmount.city City name
 * @apiSuccess {Boolean} shippingAmount.active Active status
 * @apiError {String} message Error message if city not found
 */
shippingAmountRouter.get("/city/:city", validation(ssSchema.getShippingAmountByCity), asyncHandler(ss.getShippingAmountByCity));

export default shippingAmountRouter; 