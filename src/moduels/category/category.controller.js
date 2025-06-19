import { Router } from "express";
import * as cs from "./category.service.js";
import { multerHost } from "../../middleware/multer.js";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import { asyncHandler } from "../../utils/ErrorHandling.js";
import validation from "../../middleware/validation.js";
import * as csSchema from "./category.schema.js"

let categoryRouter = Router()

categoryRouter.get("/",asyncHandler(cs.getCategories))
categoryRouter.get("/:id",validation(csSchema.getCategory),asyncHandler(cs.getCategory))
categoryRouter.post("/", authentication,authorization(["admin"]), multerHost("image").single("image") ,validation(csSchema.createCategory),asyncHandler(cs.createCategory))
categoryRouter.put("/:id" ,authentication,authorization(["admin"]), multerHost("image").single("image") ,validation(csSchema.updateCategory),asyncHandler(cs.updateCategory))
categoryRouter.delete("/:id" ,authentication,authorization(["admin"]),validation(csSchema.deleteCategory),asyncHandler(cs.deleteCategory))

export default categoryRouter