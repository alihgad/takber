import mongoose from "mongoose";
import productModel from "./product.model.js";
import { v2 as cloudinary } from "cloudinary";

// Import categoryModel to update parent category when subcategory is deleted

let subcategorySchema = new mongoose.Schema({
    title: {
        arabic: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            min: 3,
            max: 10
        },
        english: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            min: 3,
            max: 10
        }
    },
    slug: {
        arabic: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        english: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        }
    },
    image:{
        secure_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    customId:{
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{timestamps: true , toJSON: { virtuals: true }, toObject: { virtuals: true }});

const deleting = async (doc) => {
    if (doc) {
        // Initialize categoryModel if not already done (to avoid circular dependency)
       
        // Delete image from cloudinary
        if (doc.image && doc.image.public_id) {
            try {
                await cloudinary.api.delete_resources_by_prefix(`Takbeer/subcategory/${doc.customId}`);
                await cloudinary.api.delete_folder(`Takbeer/subcategory/${doc.customId}`);
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
            }
            // Delete associated products
            await productModel.deleteMany({ subcategory: doc._id }).populate("subcategory");
        }
    }
};

// post hook after findOneAndDelete
subcategorySchema.post("findOneAndDelete", async function (doc) {
    await deleting(doc);
});

// post hook after findByIdAndDelete
subcategorySchema.post("findByIdAndDelete", async function (doc) {
    await deleting(doc);
});

// pre hook for deleteOne
subcategorySchema.pre("deleteOne", { document: false, query: true }, async function () {
    const doc = await this.model.findOne(this.getFilter());
    await deleting(doc);
});

// pre hook for deleteMany
subcategorySchema.pre("deleteMany", { document: false, query: true }, async function () {
    const docs = await this.model.find(this.getFilter());
    for (const doc of docs) {
        await deleting(doc);
    }
});

// post hook for remove (when document is deleted directly)
subcategorySchema.post("remove", async function () {
    await deleting(this); // here this = document
});

let subcategoryModel = mongoose.model("Subcategory", subcategorySchema)

export default subcategoryModel