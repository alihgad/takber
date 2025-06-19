import { Router } from "express";
// import { changePhotoSchema, createProudctSchema, getOneProudctSchema, updateProudctSchema } from "./product.schema.js";
import { multerHost } from "../../middleware/multer.js";
import authorization, { roleOptions } from "../../middleware/authorization.js";
import authentication from "../../middleware/authentication.js";
import validation from "../../middleware/validation.js";
import * as productSchema from "./product.schema.js"

const productRouter = Router()

import * as ps from "./product.service.js";

productRouter.post('/', authentication, authorization([roleOptions.admin]), multerHost("image").fields([{ name: 'image', maxCount: 1 }, { name: "images", maxCount: 6 }]), validation(productSchema.createProudctSchema), ps.createProduct)
productRouter.delete('/:ProductID', validation(productSchema.deleteProudctSchema), authentication, authorization([roleOptions.admin]), ps.deleteProudct)
productRouter.put('/changePhoto/:ProductID', authentication, authorization([roleOptions.admin]), multerHost("image").single("image"), validation(productSchema.changePhotoSchema), ps.changePhoto)
productRouter.put('/:ProductID', authentication, authorization([roleOptions.admin]), validation(productSchema.updateProudctSchema), ps.updateProduct)
productRouter.get('/', ps.getProudcts)
productRouter.get('/fullProduct', ps.getfullProudcts)
productRouter.get("/newArrival", ps.getNewArrival)
productRouter.get("/hotDeals", ps.gethotDeals)
productRouter.get('/:ProductID', validation(productSchema.getOneProudctSchema), ps.getOneProudct)


export default productRouter