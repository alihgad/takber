import slugify from "slugify";
import { nanoid } from "nanoid";
import { asyncHandler } from "../../utils/ErrorHandling.js";
import productModel from "./../../db/models/product.model.js";
import { v2 as cloudinary } from "cloudinary"
import categoryModel from "../../db/models/category.model.js";
import stockModel from "../../db/models/stock.model.js";

export const createProduct = asyncHandler(async (req, res, next) => {

    const { title, description, price, discount, category } = req.body

    let titleExist = await productModel.findOne({ title: title.toLowerCase() })
    if (titleExist) {
        next(new Error('product title already exists', { cause: 400 }))
    }

    let cat = await categoryModel.findById(category)
    if (!cat) {
        next(new Error('Category not found', { cause: 404 }))
    }

    let customId = nanoid(5)

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: `Takbeer/category/${cat.customId}/products/${customId}`
    })


    let data = []
    if (req.files?.images?.length > 0) {


        for (const one of req.files.images) {
            let { secure_url, public_id } = await cloudinary.uploader.upload(one.path, {
                folder: `Takbeer/category/${cat.customId}/products/${customId}`
            })

            data.push({ secure_url, public_id })
        }
    }

    req.folder = `Takbeer/category/${cat.customId}/products/${customId}`




    let product = await productModel.create({
        title,
        slug: slugify(title, { replacement: '-', lower: true }),
        description,
        price,
        subPrice: discount ? price - (discount / 100 * price) : price,
        isDiscounted: discount ? true : false,
        discount: discount ? discount : 0,
        customId,
        image: { secure_url, public_id },
        images: data,
        customId,
        category

    })

    req.data = { model: productModel, id: product._id }

    return res.status(201).json({ msg: 'product created', product })
})


export const updateProduct = asyncHandler(async (req, res, next) => {
    const { title, stock, description, price, discount } = req.body
    const { ProductID } = req.params


    let product = await productModel.findOne({ _id: ProductID })

    if (!product) {
        return res.status(404).json({ msg: 'Product not found' })
    }


    if (title) {
        let titleExist = await productModel.findOne({ title: title.toLowerCase() })

        if (titleExist) {

            next(new Error('product title already exists', { cause: 400 }))
        }

        product.title = title.toLowerCase()
        product.slug = slugify(title, { replacement: '-', lower: true })
    }



    if (stock) {
        product.stock = stock
    }

    if (description) {
        product.description = description
    }

    if (discount) {
        product.discount = discount
        product.isDiscounted = true
    }

    if (price) {
        product.price = price
        product.subPrice = discount ? price - (discount / 100 * price) : price
    }



    await product.save()

    return res.json({ msg: 'Product updated', product })
})


export const changePhoto = asyncHandler(async (req, res, next) => {

    const { ProductID } = req.params
    let { public_id } = req.body




    if (!req.file) {
        next(new Error('file not found', { cause: 404 }))
    }


    if (!public_id) {
        next(new Error('public id not found', { cause: 404 }))
    }

    let product = await productModel.findOne({ _id: ProductID }).populate('category')

    if (!product) {
        next(new Error('Product not found', { cause: 404 }))
    }




    let folderPath = `Takbeer/category/${product.category.customId}/products/${product.customId}`

    if (product.image.public_id == public_id) {

        let x = await cloudinary.uploader.destroy(public_id).then(async () => {
            let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
                folder: folderPath
            })

            product.image.secure_url = secure_url
            product.image.public_id = public_id
            await product.save()
        }).catch(err => {
            next(err)
        }).finally(() => {
            return res.json({ msg: 'Product updated in image', product })
        })

    }

    let flag = false

    for (const image of product.images) {
        if (image.public_id == public_id) {
            flag = true
            let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
                folder: folderPath
            })
            image.secure_url = secure_url
            image.public_id = public_id
            await product.save()
            break;
        }
    }

    if (flag) {

        let x = await cloudinary.uploader.destroy(public_id)
            .catch(err => {
                next(err)
            }).finally(() => {
                return res.json({ msg: 'Product updated in images', product })
            })
    } else {
        next(new Error('public id not found', { cause: 404 }))
    }






})


export const getAllProudcts = asyncHandler(async (req, res, next) => {


    let products = await productModel.find().lean()

    let result = []

    for (const product of products) {

        let stock = await stockModel.find({ productId: product._id })

        let last = []

        if (stock.length != 0) {

            for (const s of stock) {
                product.quantity = s.quantity
                product.color = s.color
                product.size = s.size

                result.push(product)
            }
        }
    }

    return res.json({ msg: 'Products fetched', result })
})

export const getOneProudct = asyncHandler(async (req, res, next) => {
    let { ProductID } = req.params

    let product = await productModel.findById(ProductID).lean()

    let stock = await stockModel.find({ productId: product._id })

        let last = []

        if (stock.length != 0) {

            for (const s of stock) {
                product.quantity = s.quantity
                product.color = s.color
                product.size = s.size

                last.push(product)
            }
        }

    return res.json({ msg: 'Product fetched', last })
})



export const deleteProudct = asyncHandler(async (req, res, next) => {
    let { ProductID } = req.params


    let Product = await productModel.findOneAndDelete({ _id: ProductID }).populate('category')


    if (!Product) {
        return res.status(404).json({
            message: 'Product not found'
        })
    }

    await cloudinary.api.delete_resources_by_prefix(`Takbeer/category/${Product.category.customId}/products/${Product.customId}`)
    await cloudinary.api.delete_folder(`Takbeer/category/${Product.category.customId}/products/${Product.customId}`)

    return res.json({ msg: 'Product deleted', Product })
})

