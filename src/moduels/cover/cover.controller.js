import { Router } from "express"
import { asyncHandler } from "../../utils/ErrorHandling.js" 
import * as coverService from "./cover.service.js"
import { multerHost } from "../../middleware/multer.js"
import authentication from "../../middleware/authentication.js"
import authorization from "../../middleware/authorization.js"
let coverRouter = Router()



coverRouter.post("/", authentication,authorization(["admin"]),multerHost("cover/").single("image"),asyncHandler(coverService.createCover))
coverRouter.get("/", asyncHandler(coverService.getCovers))
coverRouter.get("/:id", authentication,authorization(["admin"]),asyncHandler(coverService.getCover))
coverRouter.put("/:id", authentication,authorization(["admin"]),asyncHandler(coverService.updateCover))
coverRouter.delete("/:id", authentication,authorization(["admin"]),asyncHandler(coverService.deleteCover))

export default coverRouter


