import { Router } from "express";
import * as cs from "./coupon.service.js";
import { multerHost } from "../../middleware/multer.js";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import { asyncHandler } from "../../utils/ErrorHandling.js";
import validation from "../../middleware/validation.js";
import * as csSchema from "./coupon.schema.js"

let couponRouter = Router()

couponRouter.post("/", validation(csSchema.createCoupon),authentication,authorization(["admin"]),asyncHandler(cs.createCoupon))

couponRouter.get("/",validation(csSchema.getCoupons),authentication,authorization(["admin"]),asyncHandler(cs.getCoupons))

couponRouter.get("/:couponId",validation(csSchema.getCoupon),asyncHandler(cs.getcoupon))

couponRouter.put("/:id",validation(csSchema.updateCoupon) ,authentication,authorization(["admin"]),asyncHandler(cs.updateCoupon))

couponRouter.delete("/:id",validation(csSchema.deleteCoupon) ,authentication,authorization(["admin"]),asyncHandler(cs.deleteCoupon))

export default couponRouter