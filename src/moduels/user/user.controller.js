import { Router } from "express";
import { asyncHandler } from "../../utils/ErrorHandling.js";
import * as us from "./user.service.js";
import validation from "../../middleware/validation.js";
import { deleteUserSchema, forgetPasswordSchema, getAllSchema, loginSchema, signUpSchema, updatePasswordSchema, updateUserSchema, verfiySchema, createUserSchema } from "./user.schema.js";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";

export let userRouter = Router()

/**
 * @api {post} /user User registration
 * @apiName SignUp
 * @apiGroup Users
 * @apiDescription Register a new user account
 * @apiBody {String} name User's full name
 * @apiBody {String} email User's email address
 * @apiBody {String} password User's password (min 8 chars, uppercase, lowercase, number)
 * @apiBody {Array} [phoneNumbers] Array of phone numbers (Egyptian format)
 * @apiBody {Array} [address] Array of addresses
 * @apiSuccess {Object} user Created user object (without password)
 * @apiError {String} message Error message if email/phone already exists
 */
userRouter.post("/" , validation(signUpSchema), asyncHandler(us.signUp))

/**
 * @api {post} /user/login User login
 * @apiName Login
 * @apiGroup Users
 * @apiDescription Authenticate user and return access token
 * @apiBody {String} email User's email address
 * @apiBody {String} password User's password
 * @apiSuccess {String} msg Success message
 * @apiSuccess {String} token JWT access token
 * @apiError {String} message Error message if credentials invalid or email not verified
 */
userRouter.post("/login" , validation(loginSchema), asyncHandler(us.login))

/**
 * @api {post} /user/googleLogin Google OAuth login
 * @apiName GoogleLogin
 * @apiGroup Users
 * @apiDescription Authenticate user using Google OAuth
 * @apiBody {String} idToken Google ID token
 * @apiSuccess {String} msg Success message
 * @apiSuccess {String} token JWT access token
 * @apiError {String} message Error message if Google authentication fails
 */
userRouter.post("/googleLogin" , asyncHandler(us.googleLogin))

/**
 * @api {get} /user/verify/:token Verify email
 * @apiName VerifyEmail
 * @apiGroup Users
 * @apiDescription Verify user's email address using token
 * @apiParam {String} token Email verification token
 * @apiSuccess {String} message Success message
 * @apiError {String} message Error message if token invalid or already verified
 */
userRouter.get("/verify/:token" , validation(verfiySchema) , asyncHandler(us.verify))   

/**
 * @api {put} /user/userUpdate Update user profile
 * @apiName UpdateUser
 * @apiGroup Users
 * @apiDescription Update authenticated user's profile information
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiBody {String} [name] New user name
 * @apiBody {String} [email] New email address
 * @apiBody {Array} [phoneNumbers] New phone numbers array
 * @apiBody {Array} [address] New addresses array
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} user Updated user object
 * @apiError {String} message Error message if update fails
 */
userRouter.put("/userUpdate/" ,validation(updateUserSchema) , authentication, asyncHandler(us.update))

/**
 * @api {put} /user/userUpdatePassword Update user password
 * @apiName UpdatePassword
 * @apiGroup Users
 * @apiDescription Change authenticated user's password
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiBody {String} oldPassword Current password
 * @apiBody {String} newPassword New password (min 8 chars, uppercase, lowercase, number)
 * @apiSuccess {String} message Success message
 * @apiError {String} message Error message if old password incorrect or passwords same
 */
userRouter.put("/userUpdatePassword/" , validation(updatePasswordSchema) , authentication, asyncHandler(us.updatePassword))

/**
 * @api {delete} /user/userDelete Delete user account
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiDescription Delete authenticated user's account
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} user Deleted user object
 */
userRouter.delete("/userDelete" , validation(deleteUserSchema), authentication, asyncHandler(us.deleteUser))

/**
 * @api {post} /user/forgetPassword Forgot password
 * @apiName ForgetPassword
 * @apiGroup Users
 * @apiDescription Send password reset email to user
 * @apiBody {String} email User's email address
 * @apiSuccess {String} message Success message
 * @apiError {String} message Error message if email not found or email sending fails
 */
userRouter.post("/forgetPassword/" , validation(forgetPasswordSchema) , asyncHandler(us.forgetPassword))

/**
 * @api {put} /user/reset-password/:token Reset password
 * @apiName ResetPassword
 * @apiGroup Users
 * @apiDescription Reset user password using token from email
 * @apiParam {String} token Password reset token
 * @apiBody {String} newPassword New password
 * @apiSuccess {String} message Success message
 * @apiError {String} message Error message if token invalid or user not found
 */
userRouter.put("/reset-password/:token" , asyncHandler(us.resetPassword))

/**
 * @api {get} /user Get all users (Admin)
 * @apiName GetAllUsers
 * @apiGroup Users
 * @apiDescription Retrieve all users (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiSuccess {Array} users Array of user objects
 * @apiError {String} message Error message if unauthorized
 */
userRouter.get("/" , validation(getAllSchema) , authentication, authorization(['admin']), asyncHandler(us.getAll))

/**
 * @api {get} /user/profile Get user profile
 * @apiName GetProfile
 * @apiGroup Users
 * @apiDescription Get authenticated user's profile information
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiSuccess {Object} user User profile object (without password)
 * @apiError {String} message Error message if user not found
 */
userRouter.get("/profile" ,validation(getAllSchema) ,authentication, asyncHandler(us.profile))

/**
 * @api {post} /user/create Create new user (Admin)
 * @apiName CreateUser
 * @apiGroup Users
 * @apiDescription Create a new user account (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiBody {String} name User's full name
 * @apiBody {String} email User's email address
 * @apiBody {String} password User's password (min 8 chars, uppercase, lowercase, number)
 * @apiBody {Array} [phoneNumbers] Array of phone numbers (Egyptian format)
 * @apiBody {Array} [address] Array of addresses
 * @apiBody {String} [role] User role (user, admin, dataEntry) - defaults to 'user'
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} user Created user object (without password)
 * @apiError {String} message Error message if email/phone already exists or validation fails
 */
userRouter.post("/create", validation(createUserSchema), authentication, authorization(['admin']), asyncHandler(us.createUser))

