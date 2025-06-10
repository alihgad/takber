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
categoryRouter.post("/", validation(csSchema.createCategory),authentication,authorization(["admin"]), multerHost("image").single("image") ,asyncHandler(cs.createCategory))
categoryRouter.put("/:id",validation(csSchema.updateCategory) ,authentication,authorization(["admin"]), multerHost("image").single("image") ,asyncHandler(cs.updateCategory))
categoryRouter.delete("/:id",validation(csSchema.deleteCategory) ,authentication,authorization(["admin"]),asyncHandler(cs.deleteCategory))

export default categoryRouter