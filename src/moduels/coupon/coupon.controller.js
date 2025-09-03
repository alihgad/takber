import { Router } from "express";
import * as cs from "./coupon.service.js";
// import { multerHost } from "../../middleware/multer.js";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import { asyncHandler } from "../../utils/ErrorHandling.js";
import validation from "../../middleware/validation.js";
import * as csSchema from "./coupon.schema.js"

let couponRouter = Router()

/**
 * @api {post} /coupon Create new coupon (Admin)
 * @apiName CreateCoupon
 * @apiGroup Coupons
 * @apiDescription Create a new discount coupon (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiBody {String} code Coupon code (unique)
 * @apiBody {Number} discount Discount percentage
 * @apiBody {Date} expireDate Coupon expiration date
 * @apiSuccess {Object} coupon Created coupon object
 * @apiSuccess {String} coupon.code Coupon code
 * @apiSuccess {Number} coupon.discount Discount percentage
 * @apiSuccess {Date} coupon.expireDate Expiration date
 * @apiSuccess {Boolean} coupon.active Active status
 * @apiError {String} message Error message if validation fails or duplicate code
 */
couponRouter.post("/", validation(csSchema.createCoupon),authentication,authorization(["admin"]),asyncHandler(cs.createCoupon))

/**
 * @api {get} /coupon Get all coupons (Admin)
 * @apiName GetCoupons
 * @apiGroup Coupons
 * @apiDescription Retrieve all coupons (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiSuccess {Array} coupons Array of coupon objects
 * @apiSuccess {String} coupons[].code Coupon code
 * @apiSuccess {Number} coupons[].discount Discount percentage
 * @apiSuccess {Date} coupons[].expireDate Expiration date
 * @apiSuccess {Boolean} coupons[].active Active status
 */
couponRouter.get("/",validation(csSchema.getCoupons),authentication,authorization(["admin"]),asyncHandler(cs.getCoupons))

/**
 * @api {get} /coupon/:couponId Get single coupon
 * @apiName GetCoupon
 * @apiGroup Coupons
 * @apiDescription Retrieve a specific coupon by ID
 * @apiParam {String} couponId Coupon unique identifier
 * @apiSuccess {Object} coupon Coupon details
 * @apiSuccess {String} coupon.code Coupon code
 * @apiSuccess {Number} coupon.discount Discount percentage
 * @apiSuccess {Date} coupon.expireDate Expiration date
 * @apiSuccess {Boolean} coupon.active Active status
 * @apiError {String} message Error message if coupon not found
 */
couponRouter.get("/:couponId",validation(csSchema.getCoupon),asyncHandler(cs.getcoupon))

/**
 * @api {put} /coupon/:id Update coupon (Admin)
 * @apiName UpdateCoupon
 * @apiGroup Coupons
 * @apiDescription Update coupon information (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiParam {String} id Coupon unique identifier
 * @apiBody {String} [code] New coupon code
 * @apiBody {Number} [discount] New discount percentage
 * @apiBody {Date} [expireDate] New expiration date
 * @apiBody {Boolean} [active] Active status
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} coupon Updated coupon object
 * @apiError {String} message Error message if coupon not found
 */
couponRouter.put("/:id",validation(csSchema.updateCoupon) ,authentication,authorization(["admin"]),asyncHandler(cs.updateCoupon))

/**
 * @api {delete} /coupon/:id Delete coupon (Admin)
 * @apiName DeleteCoupon
 * @apiGroup Coupons
 * @apiDescription Delete a coupon (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiParam {String} id Coupon unique identifier
 * @apiSuccess {String} message Success message
 * @apiError {String} message Error message if coupon not found
 */
couponRouter.delete("/:id",validation(csSchema.deleteCoupon) ,authentication,authorization(["admin"]),asyncHandler(cs.deleteCoupon))

export default couponRouter