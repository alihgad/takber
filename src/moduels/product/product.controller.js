import { Router } from "express";
import { changePhotoSchema, createProudctSchema, getOneProudctSchema, updateProudctSchema } from "./product.schema.js";
import {  changePhoto, createProduct, deleteProudct, getOneProudct, getAllProudcts, updateProduct } from "./product.service.js";
import { multerHost } from "../../middleware/multer.js";
import authorization from "../../middleware/authorization.js";
import authentication from "../../middleware/authentication.js";
import validation from "../../middleware/validation.js";
import * as productSchema from "./product.schema.js"

const productRouter = Router()



productRouter.post('/', validation(productSchema.createProudctSchema) ,authentication,authorization(["admin"]) ,multerHost("image").fields([{name:'image' , maxCount:1  },{ name:"images",maxCount: 6}]),validation(createProudctSchema),createProduct)
productRouter.delete('/:ProductID', validation(productSchema.deleteProudctSchema) ,authentication,authorization(["admin"]),deleteProudct)
productRouter.put('/changePhoto/:ProductID', validation(productSchema.changePhotoSchema) , authentication,authorization(["admin"]),multerHost("image").single("image"),validation(changePhotoSchema),changePhoto)
productRouter.put('/:ProductID',authentication,authorization(["admin"]),validation(updateProudctSchema),updateProduct)
productRouter.get('/',getAllProudcts)
productRouter.get('/:ProductID',validation(getOneProudctSchema),getOneProudct)


export default productRouter