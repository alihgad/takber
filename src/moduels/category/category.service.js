import { v2 as cloudinary } from "cloudinary"
import { nanoid } from "nanoid"
import slugify from "slugify"
import categoryModel from "../../db/models/category.model.js"

export const createCategory = async (req, res, next) => {
    let customId = nanoid(5)

    let image = {}
    if (req.files && req.files.image && req.files.image[0]) {
        let { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
            folder: `Takbeer/category/${customId}`
        })
        image = { secure_url, public_id }
        req.folder = `Takbeer/category/${customId}`
    }

    let category = await categoryModel.create({
        title: {
            arabic: req.body.title.arabic.toLowerCase(),
            english: req.body.title.english.toLowerCase()
        },
        slug: {
            arabic: slugify(req.body.title.arabic, { replacement: '-', lower: true }),
            english: slugify(req.body.title.english, { replacement: '-', lower: true })
        },
        description: {
            arabic: req.body.description.arabic,
            english: req.body.description.english
        },
        image,
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


    if (req.files && req.files.image && req.files.image[0]) {
        await cloudinary.uploader.destroy(category.image.public_id)

        let { secure_url, public_id} = await cloudinary.uploader.upload(req.files.image[0].path, {
            folder: `Takbeer/category/${category.customId}`
        })

        category.image.secure_url = secure_url
        category.image.public_id = public_id
        req.folder = `Takbeer/category/${category.customId}`
    }

    if(title){
        let exist = await categoryModel.findOne({ 
            $or: [
                { 'title.arabic': title.arabic.toLowerCase() },
                { 'title.english': title.english.toLowerCase() }
            ],
            _id: { $ne: category._id }
        })
        if (exist) {
            return next(new Error('Category title already exists', { cause: 400 }))
        }
        category.title = {
            arabic: title.arabic.toLowerCase(),
            english: title.english.toLowerCase()
        }
        category.slug = {
            arabic: slugify(title.arabic, { replacement: '-', lower: true }),
            english: slugify(title.english, { replacement: '-', lower: true })
        }
    }
    
    category.save()
    
    return res.status(201).json({ message: "done", category })
}


export const getCategories = async (req, res, next) => {
    try {
        // Fetch categories with populated subcategories
        let categories = await categoryModel.find().populate('subcategories');
        
        if (!categories.length) {
            return next(new Error('Categories not found', { cause: 404 }));
        }
        
        return res.status(200).json({ message: "done", categories });
    } catch (error) {
        return next(new Error(`Error fetching categories: ${error.message}`, { cause: 500 }));
    }
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

