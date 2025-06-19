import { Router } from "express";
import { asyncHandler } from "../../utils/ErrorHandling.js";
import * as us from "./user.service.js";
import validation from "../../middleware/validation.js";
import { deleteUserSchema, forgetPasswordSchema, getAllSchema, loginSchema, signUpSchema, updatePasswordSchema, updateUserSchema, verfiySchema } from "./user.schema.js";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";

export let userRouter = Router()

userRouter.post("/" , validation(signUpSchema), asyncHandler(us.signUp))
userRouter.post("/login" , validation(loginSchema), asyncHandler(us.login))
userRouter.post("/googleLogin" , validation(loginSchema), asyncHandler(us.googleLogin))


userRouter.get("/verify/:token" , validation(verfiySchema) , asyncHandler(us.verify))   

userRouter.put("/userUpdate/" ,validation(updateUserSchema) , authentication, asyncHandler(us.update))
userRouter.put("/userUpdatePassword/" , validation(updatePasswordSchema) , authentication, asyncHandler(us.updatePassword))
userRouter.delete("/userDelete" , validation(deleteUserSchema), authentication, asyncHandler(us.deleteUser))

userRouter.post("/forgetPassword/" , validation(forgetPasswordSchema) , asyncHandler(us.forgetPassword))
userRouter.put("/reset-password/:token" , asyncHandler(us.resetPassword))

userRouter.get("/" , validation(getAllSchema) , authentication, authorization(['admin']), asyncHandler(us.getAll))
userRouter.get("/profile" ,validation(getAllSchema) ,authentication, asyncHandler(us.profile))

