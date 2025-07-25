import { v2 as cloudinary } from "cloudinary";
import { nanoid } from "nanoid";
import slugify from "slugify";
import subcategoryModel from "../../db/models/subcategory.model.js";
import categoryModel from "../../db/models/category.model.js";

export const createSubcategory = async (req, res, next) => {
    const { title, categoryId } = req.body;
    
    // Check if category exists
    const category = await categoryModel.findById(categoryId);
    if (!category) {
        return next(new Error('Category not found', { cause: 404 }));
    }
    
    // Generate custom ID
    const customId = nanoid(5);
    
    // Check if image is provided
    if (!req.file) {
        return next(new Error('Image is required', { cause: 400 }));
    }
    
    // Upload image to cloudinary
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `Takbeer/subcategory/${customId}`
    });

    req.folder = `Takbeer/subcategory/${customId}`;

    // Create subcategory
    const subcategory = await subcategoryModel.create({
        title: {
            arabic: title.arabic.toLowerCase(),
            english: title.english.toLowerCase()
        },
        slug: {
            arabic: slugify(title.arabic, { replacement: '-', lower: true }),
            english: slugify(title.english, { replacement: '-', lower: true })
        },
        image: {
            secure_url,
            public_id
        },
        customId,
        category: categoryId,
        createdBy: req.user._id,
    });

    // Add subcategory to parent category's subCategories array
    await categoryModel.findByIdAndUpdate(categoryId, {
        $push: { subCategories: subcategory._id }
    });

    return res.status(201).json({ message: "done", subcategory });
};

export const updateSubcategory = async (req, res, next) => {
    const { title, categoryId } = req.body;

    // Find subcategory
    const subcategory = await subcategoryModel.findOne({ _id: req.params.id });
    if (!subcategory) {
        return next(new Error('Subcategory not found', { cause: 404 }));
    }

    // Update image if provided
    if (req.file) {
        await cloudinary.uploader.destroy(subcategory.image.public_id);

        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `Takbeer/subcategory/${subcategory.customId}`
        });

        subcategory.image.secure_url = secure_url;
        subcategory.image.public_id = public_id;
        req.folder = `Takbeer/subcategory/${subcategory.customId}`;
    }

    // Update category if provided
    if (categoryId) {
        const category = await categoryModel.findById(categoryId);
        if (!category) {
            return next(new Error('Category not found', { cause: 404 }));
        }
        
        // If category is changing, update both old and new parent categories
        if (subcategory.category.toString() !== categoryId) {
            // Remove from old category
            await categoryModel.findByIdAndUpdate(subcategory.category, {
                $pull: { subCategories: subcategory._id }
            });
            
            // Add to new category
            await categoryModel.findByIdAndUpdate(categoryId, {
                $push: { subCategories: subcategory._id }
            });
        }
        
        subcategory.category = categoryId;
    }

    // Update title if provided
    if (title) {
        const exist = await subcategoryModel.findOne({ 
            $or: [
                { 'title.arabic': title.arabic.toLowerCase() },
                { 'title.english': title.english.toLowerCase() }
            ],
            _id: { $ne: subcategory._id }
        });
        if (exist) {
            return next(new Error('Subcategory title already exists', { cause: 400 }));
        }
        subcategory.title = {
            arabic: title.arabic.toLowerCase(),
            english: title.english.toLowerCase()
        };
        subcategory.slug = {
            arabic: slugify(title.arabic, { replacement: '-', lower: true }),
            english: slugify(title.english, { replacement: '-', lower: true })
        };
    }
    
    await subcategory.save();
    
    return res.status(200).json({ message: "done", subcategory });
};

export const getSubcategories = async (req, res, next) => {
    const subcategories = await subcategoryModel.find().populate("category");
    if (!subcategories) {
        return next(new Error('Subcategories not found', { cause: 404 }));
    }
    return res.status(200).json({ message: "done", subcategories });
};

export const getSubcategoriesByCategory = async (req, res, next) => {
    const { categoryId } = req.params;
    
    // Check if category exists
    const category = await categoryModel.findById(categoryId);
    if (!category) {
        return next(new Error('Category not found', { cause: 404 }));
    }
    
    const subcategories = await subcategoryModel.find({ category: categoryId }).populate("category");
    return res.status(200).json({ message: "done", subcategories });
};

export const getSubcategory = async (req, res, next) => {
    const subcategory = await subcategoryModel.findById(req.params.id).populate(["category", "createdBy"]);
    if (!subcategory) {
        return next(new Error('Subcategory not found', { cause: 404 }));
    }
    return res.status(200).json({ message: "done", subcategory });
};

export const deleteSubcategory = async (req, res, next) => {
    const subcategory = await subcategoryModel.findByIdAndDelete(req.params.id);
    if (!subcategory) {
        return next(new Error('Subcategory not found', { cause: 404 }));
    }
    return res.status(200).json({ message: "done", subcategory });
};