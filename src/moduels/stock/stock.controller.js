import { Router } from "express";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import { asyncHandler } from "../../utils/ErrorHandling.js";
import * as sc from "./stock.service.js"
import * as ss from "./stock.schema.js"
import validation from "../../middleware/validation.js";

let stockRouter = Router()


stockRouter.get("/:productId",validation(ss.getStockSchema),asyncHandler(sc.getProductStock))
stockRouter.post("/many/:productId",authentication,authorization(["admin"]),validation(ss.createManyStockSchema),asyncHandler(sc.addManyStocks))
stockRouter.post("/:productId",authentication,authorization(["admin"]),validation(ss.createStockSchema),asyncHandler(sc.addStock))
stockRouter.put("/:productId/:stockId",validation(ss.updateStockSchema),asyncHandler(sc.updateProductStock))




export default stockRouter