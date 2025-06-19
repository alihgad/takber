import { v2 as cloudinary } from "cloudinary"
import { nanoid } from "nanoid"
import slugify from "slugify"
import categoryModel from "../../db/models/category.model.js"

export const createCategory = async (req, res, next) => {
    let customId = nanoid(5)
    if (!req.file) {
        return next(new Error('Image is required', { cause: 400 }))
    }
    let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `Takbeer/category/${customId}`
    })

    req.folder = `Takbeer/category/${customId}`

    let category = await categoryModel.create({
        title: req.body.title,
        slug: slugify(req.body.title),
        image: {
            secure_url,
            public_id
        },
        customId,
        createdBy: req.user._id,


    })

    return res.status(201).json({ message: "done", category })
}

export const updateCategory = async (req, res, next) => {

    let { title } = req.body

    let category = await categoryModel.findOne({ _id: req.params.id })

    if (!category) {
        return next(new Error('Category not found', { cause: 404 }))
    }


    if (req.file) {
        await cloudinary.uploader.destroy(category.image.public_id)

        let { secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {
            folder: `Takbeer/category/${customId}`
        })

        category.secure_url = data.secure_url
        category.public_id = data.public_id
        req.folder = `Takbeer/category/${customId}`
    }

    if(title){
        category.title = title
        category.slug = slugify(title)
    }
    
    category.save()
    
    return res.status(201).json({ message: "done", category })
}


export const getCategories = async (req, res, next) => {
    let categories = await categoryModel.find()
    if (!categories) {
        return next(new Error('Categories not found', { cause: 404 }))
    }
    return res.status(201).json({ message: "done", categories })
}

export const getCategory = async (req, res, next) => {
    let category = await categoryModel.findById(req.params.id).populate("createdBy")
    if (!category) {
        return next(new Error('Category not found', { cause: 404 }))
    }
    return res.status(200).json({ message: "done", category })
}

export const deleteCategory = async (req, res, next) => {
    let category = await categoryModel.findByIdAndDelete(req.params.id)
    if (!category) {
        return next(new Error('Category not found', { cause: 404 }))
    }
    return res.status(200).json({ message: "done", category })
}