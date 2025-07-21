import slugify from "slugify";
import { nanoid } from "nanoid";
import { asyncHandler } from "../../utils/ErrorHandling.js";
import productModel from "./../../db/models/product.model.js";
import { v2 as cloudinary } from "cloudinary";
import categoryModel from "../../db/models/category.model.js";
import subcategoryModel from "../../db/models/subcategory.model.js";
import { getProductStocks } from "../../utils/productStocks.js";


export const createProduct = asyncHandler(async (req, res, next) => {

    const { title, description, price, discount, category, subcategory, brand } = req.body

    // Check if title exists (check both arabic and english)
    let titleExist = await productModel.findOne({
        $or: [
            { 'title.arabic': title.arabic.toLowerCase() },
            { 'title.english': title.english.toLowerCase() }
        ]
    })
    if (titleExist) {
        next(new Error('product title already exists', { cause: 400 }))
    }

    let cat = await categoryModel.findById(category)
    if (!cat) {
        next(new Error('Category not found', { cause: 404 }))
    }

    if (subcategory) {
        let subcat = await subcategoryModel.findById(subcategory)
        if (!subcat) {
            return next(new Error('Subcategory not found', { cause: 404 }))
        }

        if (subcat.category.toString() !== category) {
            return next(new Error('Subcategory does not belong to the specified category', { cause: 400 }))
        }
    }

    let customId = nanoid(5)

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: `Takbeer/category/${cat.customId}/products/${customId}`
    })

    req.image = { secure_url, public_id }


    let data = []
    if (req.files?.images?.length > 0) {


        for (const one of req.files.images) {
            let { secure_url, public_id } = await cloudinary.uploader.upload(one.path, {
                folder: `Takbeer/category/${cat.customId}/products/${customId}`
            })

            data.push({ secure_url, public_id })
        }
    }

    req.images = data
    req.folder = `Takbeer/category/${cat.customId}/products/${customId}`




    let product = await productModel.create({
        title: {
            arabic: title.arabic.toLowerCase(),
            english: title.english.toLowerCase()
        },
        slug: {
            arabic: slugify(title.arabic, { replacement: '-', lower: true }),
            english: slugify(title.english, { replacement: '-', lower: true })
        },
        description: {
            arabic: description.arabic,
            english: description.english
        },
        price,
        discount: discount || 0,
        customId,
        image: { secure_url, public_id },
        images: data,
        category,
        subcategory: subcategory || null,
        brand: brand.toLowerCase(),
        createdBy: req.user._id
    })

    req.data = { model: productModel, id: product._id }

    return res.status(201).json({ msg: 'product created', product })
})


export const updateProduct = asyncHandler(async (req, res, next) => {
    const { title, stock, description, price, discount, category, subcategory } = req.body
    const { ProductID } = req.params


    let product = await productModel.findOne({ _id: ProductID })

    if (!product) {
        return next(new Error('Product not found', { cause: 404 }))
    }


    if (title) {
        // Check if title exists (check both arabic and english)
        let titleExist = await productModel.findOne({
            $or: [
                { 'title.arabic': title.arabic.toLowerCase() },
                { 'title.english': title.english.toLowerCase() }
            ],
            _id: { $ne: ProductID } // Exclude current product
        })

        if (titleExist) {
            next(new Error('product title already exists', { cause: 400 }))
        }

        product.title = {
            arabic: title.arabic.toLowerCase(),
            english: title.english.toLowerCase()
        }
        product.slug = {
            arabic: slugify(title.arabic, { replacement: '-', lower: true }),
            english: slugify(title.english, { replacement: '-', lower: true })
        }
    }



    if (stock) {
        product.stock = stock
    }

    if (description) {
        product.description = {
            arabic: description.arabic,
            english: description.english
        }
    }

    if (discount !== undefined) {
        product.discount = discount
    }

    if (price) {
        product.price = price
    }

    // Update category if provided
    if (category) {
        let cat = await categoryModel.findById(category)
        if (!cat) {
            return next(new Error('Category not found', { cause: 404 }))
        }
        product.category = category

        // If category changes, remove subcategory unless a new one is provided
        if (product.category.toString() !== category && !subcategory) {
            product.subcategory = null
        }
    }

    // Update subcategory if provided
    if (subcategory) {
        let subcat = await subcategoryModel.findById(subcategory)
        if (!subcat) {
            return next(new Error('Subcategory not found', { cause: 404 }))
        }

        // Check if subcategory belongs to the product's category
        const categoryToCheck = category || product.category.toString()
        if (subcat.category.toString() !== categoryToCheck) {
            return next(new Error('Subcategory does not belong to the specified category', { cause: 400 }))
        }

        product.subcategory = subcategory
    } else if (subcategory === null) {
        // Allow explicitly setting subcategory to null
        product.subcategory = null
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


export const getfullProudcts = asyncHandler(async (req, res, next) => {
    let { brand, category } = req.query

    let query = {}

    if (brand) {
        query.brand = brand
    }

    if (category) {
        query.category = category
    }


    let products = await productModel.find(query).lean()


    if (!products || products.length === 0) {
        return res.status(404).json({ msg: 'No products found' })
    }

    let result = await getProductStocks(products, req.query)

    return res.json({ msg: 'Products fetched', result })
})

export const getProudcts = asyncHandler(async (req, res, next) => {
    let filter = {}

    if (req.query.category) {
        filter.category = req.query.category

    }

    if (req.query.search) {
        let search = req.query.search
        filter.$or = [
            { "title.arabic": { $regex: search, $options: 'i' } },
            { "title.english": { $regex: search, $options: 'i' } }
        ];

    }



    let products = await productModel.find(filter).populate('category', 'title.arabic title.english slug.arabic slug.english').lean().select("title image _id price finalPrice isDiscounted discount  ")

    if (req.query.subcategory) {
        filter.subcategory = req.query.subcategory
    }



    if (!products || products.length === 0) {
        return res.status(404).json({ msg: 'No products found' })
    }


    return res.json({ msg: 'Products fetched', products })

})



export const getOneProudct = asyncHandler(async (req, res, next) => {
    let { ProductID } = req.params

    let product = await productModel.findById(ProductID).populate(['category', 'subcategory']).lean()

    if (!product) {
        return next(new Error('Product not found', { cause: 404 }))
    }

    let last = await getProductStocks([product])
    console.log("last", last)


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


    return res.json({ msg: 'Product deleted', Product })
})


export const getNewArrival = asyncHandler(async (req, res, next) => {
    let products = await productModel.find().sort({ updatedAt: -1 }).limit(10).populate(['category', 'subcategory']).lean()

    let result = await getProductStocks(products)


    return res.json({ msg: 'New arrivals fetched', result })
})


export const gethotDeals = asyncHandler(async (req, res, next) => {
    let products = await productModel.find({ isDiscounted: true }).sort({ discount: -1 }).limit(10).populate(['category', 'subcategory']).lean()

    let result = await getProductStocks(products)

    return res.json({ msg: 'Hot deals fetched', result })
})

