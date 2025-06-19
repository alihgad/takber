import { Router } from "express";
// import { changePhotoSchema, createProudctSchema, getOneProudctSchema, updateProudctSchema } from "./product.schema.js";
import {  changePhoto, createProduct, deleteProudct, getOneProudct, getAllProudcts, updateProduct, getNewArrival } from "./product.service.js";
import { multerHost } from "../../middleware/multer.js";
import authorization, { roleOptions } from "../../middleware/authorization.js";
import authentication from "../../middleware/authentication.js";
import validation from "../../middleware/validation.js";
import * as productSchema from "./product.schema.js"

const productRouter = Router()



productRouter.post('/', authentication,authorization([roleOptions.admin]) ,multerHost("image").fields([{name:'image' , maxCount:1  },{ name:"images",maxCount: 6}]),validation(productSchema.createProudctSchema) ,createProduct)
productRouter.delete('/:ProductID', validation(productSchema.deleteProudctSchema) ,authentication,authorization([roleOptions.admin]),deleteProudct)
productRouter.put('/changePhoto/:ProductID', authentication,authorization([roleOptions.admin]),multerHost("image").single("image"),validation(productSchema.changePhotoSchema),changePhoto)
productRouter.put('/:ProductID',authentication,authorization([roleOptions.admin]),validation(productSchema.updateProudctSchema),updateProduct)
productRouter.get('/',getAllProudcts)
productRouter.get('/:ProductID',validation(productSchema.getOneProudctSchema),getOneProudct)
productRouter.get("/newArrival",getNewArrival)


export default productRouter