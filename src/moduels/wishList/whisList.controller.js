import { Route } from "express";
import * as ws from "./whisList.service.js"
import { asyncHandler } from "../../utils/ErrorHandling";
import validation from "../../middleware/validation.js";
import authentication from "../../middleware/authentication.js";
import { addToWhishList , moveToCart , removeFromWhishList , getWhishList } from "./whisList.service.js";
let whisListRoute = Route()

whisListRoute.get("/", validation(ws.getWhisListSchema) , authentication , asyncHandler(getWhishList))
whisListRoute.post("/", validation(ws.addToWhisListSchema) , authentication , asyncHandler(addToWhishList))
whisListRoute.post("/moveToCart",validation(ws.moveToCartSchema) , authentication, asyncHandler(moveToCart))
whisListRoute.post("/removeFromWhisList",validation(ws.removeFromWhisListSchema) , authentication, asyncHandler(removeFromWhishList))

export default whisListRoute    