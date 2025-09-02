import { Router } from "express";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import { asyncHandler } from "../../utils/ErrorHandling.js";
import * as sc from "./stock.service.js"
import * as ss from "./stock.schema.js"
import validation from "../../middleware/validation.js";

let stockRouter = Router()

/**
 * @api {get} /stock/:productId Get product stock
 * @apiName GetProductStock
 * @apiGroup Stock
 * @apiDescription Retrieve stock information for a specific product
 * @apiParam {String} productId Product unique identifier
 * @apiSuccess {Array} stock Array of stock objects for different variants
 * @apiSuccess {String} stock[].color Stock color
 * @apiSuccess {String} stock[].size Stock size (XS/S/M/L/XL/XXL)
 * @apiSuccess {Number} stock[].quantity Available quantity
 * @apiSuccess {String} stock[].productId Associated product ID
 * @apiError {String} message Error message if product not found
 */
stockRouter.get("/:productId",validation(ss.getStockSchema),asyncHandler(sc.getProductStock))

/**
 * @api {post} /stock/many/:productId Add multiple stock variants (Admin)
 * @apiName AddManyStocks
 * @apiGroup Stock
 * @apiDescription Add multiple stock variants for a product (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiParam {String} productId Product unique identifier
 * @apiBody {Array} stocks Array of stock objects
 * @apiBody {String} stocks[].color Stock color
 * @apiBody {String} stocks[].size Stock size (XS/S/M/L/XL/XXL)
 * @apiBody {Number} stocks[].quantity Stock quantity (minimum: 0)
 * @apiSuccess {String} message Success message
 * @apiSuccess {Array} stocks Created stock objects
 * @apiError {String} message Error message if validation fails or product not found
 */
stockRouter.post("/many/:productId",authentication,authorization(["admin"]),validation(ss.createManyStockSchema),asyncHandler(sc.addManyStocks))

/**
 * @api {post} /stock/:productId Add single stock variant (Admin)
 * @apiName AddStock
 * @apiGroup Stock
 * @apiDescription Add a single stock variant for a product (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiParam {String} productId Product unique identifier
 * @apiBody {String} color Stock color
 * @apiBody {String} size Stock size (XS/S/M/L/XL/XXL)
 * @apiBody {Number} quantity Stock quantity (minimum: 0)
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} stock Created stock object
 * @apiError {String} message Error message if validation fails or product not found
 */
stockRouter.post("/:productId",authentication,authorization(["admin"]),validation(ss.createStockSchema),asyncHandler(sc.addStock))

/**
 * @api {put} /stock/:productId/:stockId Update stock (Admin)
 * @apiName UpdateStock
 * @apiGroup Stock
 * @apiDescription Update stock quantity for a specific variant (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiParam {String} productId Product unique identifier
 * @apiParam {String} stockId Stock unique identifier
 * @apiBody {Number} quantity New stock quantity (minimum: 0)
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} stock Updated stock object
 * @apiError {String} message Error message if stock not found
 */
stockRouter.put("/:productId/:stockId",validation(ss.updateStockSchema),asyncHandler(sc.updateProductStock))

export default stockRouter