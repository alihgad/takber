import { v2 as cloudinary } from "cloudinary"
import { nanoid } from "nanoid"
import slugify from "slugify"
import categoryModel from "../../db/models/category.model.js"
import { deleteImage } from "../../services/deleteImage.js"

export const createCategory = async (req, res, next) => {
    let customId = nanoid(5)
    let imagePath
    if(req.image){
        imagePath = req.image.path + "/" + req.image.filename
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
        customId,
        createdBy: req.user._id,
        imagePath 

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
        deleteImage(category.imagePath)

         category.imagePath = req.file.path 
        
        req.folder = req.file.path
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

