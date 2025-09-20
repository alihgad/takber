import { Router } from "express";
// import { changePhotoSchema, createProudctSchema, getOneProudctSchema, updateProudctSchema } from "./product.schema.js";
import { multerHost } from "../../middleware/multer.js";
import authorization, { roleOptions } from "../../middleware/authorization.js";
import authentication from "../../middleware/authentication.js";
import validation from "../../middleware/validation.js";
import * as productSchema from "./product.schema.js"

const productRouter = Router()

import * as ps from "./product.service.js";


productRouter.post('/', authentication, authorization([roleOptions.admin, roleOptions.dataEntry]), multerHost("products/").fields([{ name: 'image', maxCount: 1 }, { name: "images", maxCount: 6 }]), validation(productSchema.createProudctSchema), ps.createProduct)

/**
 * @api {delete} /product/:ProductID Delete product (Admin)
 * @apiName DeleteProduct
 * @apiGroup Products
 * @apiDescription Delete a product and its associated stock (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiParam {String} ProductID Product unique identifier
 * @apiSuccess {String} message Success message
 * @apiError {String} message Error message if product not found
 */
productRouter.delete('/:ProductID', validation(productSchema.deleteProudctSchema), authentication, authorization([roleOptions.admin]), ps.deleteProudct)

/**
 * @api {put} /product/changePhoto/:ProductID Change product photo (Admin)
 * @apiName ChangeProductPhoto
 * @apiGroup Products
 * @apiDescription Update product's main image (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiParam {String} ProductID Product unique identifier
 * @apiBody {File} image New product image
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} product Updated product object
 * @apiError {String} message Error message if product not found or image upload fails
 */
productRouter.put('/changePhoto/:productID', authentication, authorization([roleOptions.admin , roleOptions.dataEntry]), multerHost("products/").single("image"), ps.changePhoto)

/**
 * @api {put} /product/:ProductID Update product (Admin)
 * @apiName UpdateProduct
 * @apiGroup Products
 * @apiDescription Update product information (Admin and Data Entry only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiParam {String} ProductID Product unique identifier
 * @apiBody {String} [title] New product title
 * @apiBody {String} [slug] New product slug
 * @apiBody {String} [description] New product description
 * @apiBody {Number} [price] New product price
 * @apiBody {String} [category] New category ID
 * @apiBody {String} [brand] New product brand
 * @apiBody {Boolean} [isDiscounted] Discount status
 * @apiBody {Number} [discount] Discount percentage
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} product Updated product object
 * @apiError {String} message Error message if product not found
 */
productRouter.put('/:productID', authentication, authorization([roleOptions.admin, roleOptions.dataEntry]), validation(productSchema.updateProudctSchema), ps.updateProduct)

/**
 * @api {get} /product Get all products
 * @apiName GetProducts
 * @apiGroup Products
 * @apiDescription Retrieve all products with basic information
 * @apiSuccess {Array} products Array of product objects
 * @apiSuccess {String} products[].title Product title
 * @apiSuccess {String} products[].slug Product slug
 * @apiSuccess {Object} products[].image Product main image
 * @apiSuccess {Number} products[].price Product price
 * @apiSuccess {String} products[].brand Product brand
 */
productRouter.get('/', ps.getProudcts)

/**
 * @api {get} /product/fullProduct Get full product details
 * @apiName GetFullProducts
 * @apiGroup Products
 * @apiDescription Retrieve all products with complete details including category and stock
 * @apiSuccess {Array} products Array of products with full details
 * @apiSuccess {Object} products[].category Category information
 * @apiSuccess {Array} products[].stock Stock information for different variants
 */
productRouter.get('/fullProduct', ps.getfullProudcts)

/**
 * @api {get} /product/newArrival Get new arrival products
 * @apiName GetNewArrival
 * @apiGroup Products
 * @apiDescription Retrieve recently added products
 * @apiSuccess {Array} products Array of new arrival products
 * @apiSuccess {Date} products[].createdAt Product creation date
 */
productRouter.get("/newArrival", ps.getNewArrival)

/**
 * @api {get} /product/hotDeals Get hot deals products
 * @apiName GetHotDeals
 * @apiGroup Products
 * @apiDescription Retrieve products with active discounts
 * @apiSuccess {Array} products Array of discounted products
 * @apiSuccess {Number} products[].discount Discount percentage
 * @apiSuccess {Boolean} products[].isDiscounted Discount status
 */
productRouter.get("/hotDeals", ps.gethotDeals)

/**
 * @api {get} /product/:ProductID Get single product
 * @apiName GetOneProduct
 * @apiGroup Products
 * @apiDescription Retrieve detailed information about a specific product
 * @apiParam {String} ProductID Product unique identifier
 * @apiSuccess {Object} product Product details with category and stock information
 * @apiSuccess {String} product.title Product title
 * @apiSuccess {String} product.description Product description
 * @apiSuccess {Array} product.images Product images array
 * @apiSuccess {Object} product.category Category details
 * @apiSuccess {Array} product.stock Stock variants (color, size, quantity)
 * @apiError {String} message Error message if product not found
 */
productRouter.get('/:ProductID', validation(productSchema.getOneProudctSchema), ps.getOneProudct)

export default productRouter