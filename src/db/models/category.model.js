import mongoose from "mongoose";
import productModel from "./product.model.js";
import { v2 as cloudinary } from "cloudinary";



let categorySchema = new mongoose.Schema({
    title: {
        arabic: {
            type: String,
            required: true,
            unique: true,
            min: 3,
            max: 10
        },
        english: {
            type: String,
            required: true,
            unique: true,
            min: 3,
            max: 10
        }
    },
    slug: {
        arabic: {
            type: String,
            required: true,
            unique: true,
            min: 3,
            max: 10
        },
        english: {
            type: String,
            required: true,
            unique: true,
            min: 3,
            max: 10
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
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

},{timestamps: true})



const deleting = async (doc) => {
    if (doc) {
        // حذف الصورة من cloudinary
        if (doc.image && doc.image.public_id) {
            try {
                await cloudinary.api.delete_resources_by_prefix(`Takbeer/category/${doc.customId}`);
                await cloudinary.api.delete_folder(`Takbeer/category/${doc.customId}`);
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
            }
            await productModel.deleteMany({ category: doc._id }).populate("category"); // حذف المنتجات المرتبطة
        }

        
    }
};

// post hook بعد findOneAndDelete
categorySchema.post("findOneAndDelete", async function (doc) {
    await deleting(doc);
});

// post hook بعد findByIdAndDelete
categorySchema.post("findByIdAndDelete", async function (doc) {
    await deleting(doc);
});

// pre hook لـ deleteOne
categorySchema.pre("deleteOne", { document: false, query: true }, async function () {
    const doc = await this.model.findOne(this.getFilter());
    await deleting(doc);
});

// pre hook لـ deleteMany
categorySchema.pre("deleteMany", { document: false, query: true }, async function () {
    const docs = await this.model.find(this.getFilter());
    for (const doc of docs) {
        await deleting(doc);
    }
});

// post hook لـ remove (لو حذفت document مباشر)
categorySchema.post("remove", async function () {
    await deleting(this); // هنا this = document
});


let categoryModel = mongoose.model("Category", categorySchema)



export default categoryModel