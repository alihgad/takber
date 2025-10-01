import { Router } from "express";
import * as cs from "./category.service.js";
import { multerHost } from "../../middleware/multer.js";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import { asyncHandler } from "../../utils/ErrorHandling.js";
import validation from "../../middleware/validation.js";
import * as csSchema from "./category.schema.js";

let categoryRouter = Router()

/**
 * @api {get} /category Get all categories
 * @apiName GetCategories
 * @apiGroup Categories
 * @apiDescription Retrieve all product categories
 * @apiSuccess {Array} categories Array of category objects
 * @apiSuccess {String} categories[].name Category name
 * @apiSuccess {String} categories[].customId Category custom ID
 * @apiSuccess {Object} categories[].image Category image
 * @apiSuccess {String} categories[].slug Category slug
 */
categoryRouter.get("/",asyncHandler(cs.getCategories))

/**
 * @api {get} /category/:id Get single category
 * @apiName GetCategory
 * @apiGroup Categories
 * @apiDescription Retrieve a specific category by ID
 * @apiParam {String} id Category unique identifier
 * @apiSuccess {Object} category Category details
 * @apiSuccess {String} category.name Category name
 * @apiSuccess {String} category.customId Category custom ID
 * @apiSuccess {Object} category.image Category image
 * @apiSuccess {Array} category.products Products in this category
 * @apiError {String} message Error message if category not found
 */
categoryRouter.get("/:id",validation(csSchema.getCategory),asyncHandler(cs.getCategory))

/**
 * @api {post} /category Create new category (Admin)
 * @apiName CreateCategory
 * @apiGroup Categories
 * @apiDescription Create a new product category (Admin and Data Entry only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiBody {String} name Category name
 * @apiBody {String} customId Category custom ID (unique)
 * @apiBody {String} slug Category slug (unique)
 * @apiBody {File} image Category image
 * @apiSuccess {Object} category Created category object
 * @apiError {String} message Error message if validation fails or duplicate data
 */
categoryRouter.post("/", authentication,authorization(["admin", "dataEntry"]), multerHost("image").fields([{ name: 'image', maxCount: 1 }]) ,validation(csSchema.createCategory),asyncHandler(cs.createCategory))

/**
 * @api {put} /category/:id Update category (Admin)
 * @apiName UpdateCategory
 * @apiGroup Categories
 * @apiDescription Update category information (Admin and Data Entry only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiParam {String} id Category unique identifier
 * @apiBody {String} [name] New category name
 * @apiBody {String} [customId] New category custom ID
 * @apiBody {String} [slug] New category slug
 * @apiBody {File} [image] New category image
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} category Updated category object
 * @apiError {String} message Error message if category not found
 */
categoryRouter.put("/:id" ,authentication,authorization(["admin", "dataEntry"]), multerHost("image").fields([{ name: 'image', maxCount: 1 }]) ,validation(csSchema.updateCategory),asyncHandler(cs.updateCategory))

/**
 * @api {delete} /category/:id Delete category (Admin)
 * @apiName DeleteCategory
 * @apiGroup Categories
 * @apiDescription Delete a category and its associated products (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiParam {String} id Category unique identifier
 * @apiSuccess {String} message Success message
 * @apiError {String} message Error message if category not found
 */
categoryRouter.delete("/:id" ,authentication,authorization(["admin"]),validation(csSchema.deleteCategory),asyncHandler(cs.deleteCategory))

export default categoryRouter