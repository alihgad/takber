import { Router } from "express";
import * as cs from "./category.service.js";
import { multerHost } from "../../middleware/multer.js";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import { asyncHandler } from "../../utils/ErrorHandling.js";
import validation from "../../middleware/validation.js";
import * as csSchema from "./category.schema.js"

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

categoryRouter.post("/", authentication,authorization(["admin", "dataEntry"]), multerHost("category/").single("image") ,validation(csSchema.createCategory),asyncHandler(cs.createCategory))


categoryRouter.put("/:id" ,authentication,authorization(["admin", "dataEntry"]), multerHost("category/").single("image") ,validation(csSchema.updateCategory),asyncHandler(cs.updateCategory))


categoryRouter.delete("/:id" ,authentication,authorization(["admin"]),validation(csSchema.deleteCategory),asyncHandler(cs.deleteCategory))

export default categoryRouter