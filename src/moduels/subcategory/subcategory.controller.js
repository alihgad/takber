import { Router } from "express";
import * as ss from "./subcategory.service.js";
import { multerHost } from "../../middleware/multer.js";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import { asyncHandler } from "../../utils/ErrorHandling.js";
import validation from "../../middleware/validation.js";
import * as ssSchema from "./subcategory.schema.js";

let subcategoryRouter = Router();

/**
 * @api {get} /subcategory Get all subcategories
 * @apiName GetSubcategories
 * @apiGroup Subcategories
 * @apiDescription Retrieve all product subcategories
 * @apiSuccess {Array} subcategories Array of subcategory objects
 * @apiSuccess {String} subcategories[].title Subcategory title
 * @apiSuccess {String} subcategories[].customId Subcategory custom ID
 * @apiSuccess {Object} subcategories[].image Subcategory image
 * @apiSuccess {String} subcategories[].slug Subcategory slug
 * @apiSuccess {Object} subcategories[].category Parent category
 */
subcategoryRouter.get("/", asyncHandler(ss.getSubcategories));

/**
 * @api {get} /subcategory/category/:categoryId Get subcategories by category
 * @apiName GetSubcategoriesByCategory
 * @apiGroup Subcategories
 * @apiDescription Retrieve all subcategories for a specific category
 * @apiParam {String} categoryId Category unique identifier
 * @apiSuccess {Array} subcategories Array of subcategory objects
 * @apiSuccess {String} subcategories[].title Subcategory title
 * @apiSuccess {String} subcategories[].customId Subcategory custom ID
 * @apiSuccess {Object} subcategories[].image Subcategory image
 * @apiSuccess {String} subcategories[].slug Subcategory slug
 * @apiSuccess {Object} subcategories[].category Parent category
 * @apiError {String} message Error message if category not found
 */
subcategoryRouter.get("/category/:categoryId", validation(ssSchema.getSubcategoriesByCategory), asyncHandler(ss.getSubcategoriesByCategory));

/**
 * @api {get} /subcategory/:id Get single subcategory
 * @apiName GetSubcategory
 * @apiGroup Subcategories
 * @apiDescription Retrieve a specific subcategory by ID
 * @apiParam {String} id Subcategory unique identifier
 * @apiSuccess {Object} subcategory Subcategory details
 * @apiSuccess {String} subcategory.title Subcategory title
 * @apiSuccess {String} subcategory.customId Subcategory custom ID
 * @apiSuccess {Object} subcategory.image Subcategory image
 * @apiSuccess {Object} subcategory.category Parent category
 * @apiError {String} message Error message if subcategory not found
 */
subcategoryRouter.get("/:id", validation(ssSchema.getSubcategory), asyncHandler(ss.getSubcategory));

/**
 * @api {post} /subcategory Create new subcategory (Admin)
 * @apiName CreateSubcategory
 * @apiGroup Subcategories
 * @apiDescription Create a new product subcategory (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiBody {String} title Subcategory title
 * @apiBody {String} categoryId Parent category ID
 * @apiBody {File} image Subcategory image
 * @apiSuccess {Object} subcategory Created subcategory object
 * @apiError {String} message Error message if validation fails or duplicate data
 */
subcategoryRouter.post("/", authentication, authorization(["admin"]), multerHost("image").single("image"), validation(ssSchema.createSubcategory), asyncHandler(ss.createSubcategory));

/**
 * @api {put} /subcategory/:id Update subcategory (Admin)
 * @apiName UpdateSubcategory
 * @apiGroup Subcategories
 * @apiDescription Update subcategory information (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiParam {String} id Subcategory unique identifier
 * @apiBody {String} [title] New subcategory title
 * @apiBody {String} [categoryId] New parent category ID
 * @apiBody {File} [image] New subcategory image
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} subcategory Updated subcategory object
 * @apiError {String} message Error message if subcategory not found
 */
subcategoryRouter.put("/:id", authentication, authorization(["admin"]), multerHost("image").single("image"), validation(ssSchema.updateSubcategory), asyncHandler(ss.updateSubcategory));

/**
 * @api {delete} /subcategory/:id Delete subcategory (Admin)
 * @apiName DeleteSubcategory
 * @apiGroup Subcategories
 * @apiDescription Delete a subcategory and its associated products (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiParam {String} id Subcategory unique identifier
 * @apiSuccess {String} message Success message
 * @apiError {String} message Error message if subcategory not found
 */
subcategoryRouter.delete("/:id", authentication, authorization(["admin"]), validation(ssSchema.deleteSubcategory), asyncHandler(ss.deleteSubcategory));

export default subcategoryRouter;