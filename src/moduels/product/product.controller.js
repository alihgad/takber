import { Router } from "express";
// import { changePhotoSchema, createProudctSchema, getOneProudctSchema, updateProudctSchema } from "./product.schema.js";
import { multerHost } from "../../middleware/multer.js";
import authorization, { roleOptions } from "../../middleware/authorization.js";
import authentication from "../../middleware/authentication.js";
import validation from "../../middleware/validation.js";
import * as productSchema from "./product.schema.js"

const productRouter = Router()

import * as ps from "./product.service.js";



productRouter.post('/', authentication, authorization([roleOptions.admin, roleOptions.dataEntry]), multerHost("products/").fields([{ name: 'image', maxCount: 1 }, { name: "images", maxCount: 4 }]), validation(productSchema.createProudctSchema), ps.createProduct)


productRouter.delete('/:ProductID', validation(productSchema.deleteProudctSchema), authentication, authorization([roleOptions.admin]), ps.deleteProudct)


productRouter.put('/changePhoto/:productID', authentication, authorization([roleOptions.admin , roleOptions.dataEntry]), multerHost("products/").single("image"), ps.changePhoto)


productRouter.put('/:productID', authentication, authorization([roleOptions.admin, roleOptions.dataEntry]), validation(productSchema.updateProudctSchema), ps.updateProduct)


productRouter.get('/', ps.getProudcts)


productRouter.get('/fullProduct', ps.getfullProudcts)


productRouter.get("/newArrival", ps.getNewArrival)

productRouter.get("/hotDeals", ps.gethotDeals)


productRouter.get('/:ProductID', validation(productSchema.getOneProudctSchema), ps.getOneProudct)
productRouter.put('/changeImages/:productID', authentication, authorization([roleOptions.admin , roleOptions.dataEntry]), multerHost("products/").single("image"), ps.changeImages)

export default productRouter