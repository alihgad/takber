import mongoose from "mongoose";
import stockModel from "./stock.model.js";
import { v2 as cloudinary } from "cloudinary";
import categoryModel from "./category.model.js";
import subcategoryModel from "./subcategory.model.js";



let productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        min: 3,
        max: 10
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    image: {
        secure_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    images: {
        type: [{
            secure_url: {
                type: String,
                required: true
            },
            public_id: {
                type: String,
                required: true
            }
        }],
        required: true
    },
    customId: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
        required: false
    },
    isDiscounted: {
        type: Boolean,
        default: false
    },
    discount: {
        type: Number,
        default: 0
    },
    brand: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
    {
        timestamps: true,
        versionKey: false
    })



const deleting = async (doc) => {
    if (doc) {
        console.log("Deleting product", doc._id);

        await stockModel.deleteMany({ productId: doc._id });
        console.log("Deleted product stocks:", doc._id);

        let catCustoumId = await categoryModel.findOne({ _id: doc.category }).select("customId");
        if (catCustoumId?.customId && doc?.customId) {
            const path = `Takbeer/category/${catCustoumId?.customId}/products/${doc?.customId}`;
            await cloudinary.api.delete_resources_by_prefix(path);
            console.log("Deleted Cloudinary resources:", path);

            await cloudinary.api.delete_folder(path);
            console.log("Deleted folder:", path);
        }else{
            console.log("No customId found for category or product, skipping Cloudinary deletion.");
        }




    }
};

// post hook بعد findOneAndDelete
productSchema.post("findOneAndDelete", async function (doc) {
    await deleting(doc);
});

// post hook بعد findByIdAndDelete
productSchema.post("findByIdAndDelete", async function (doc) {
    await deleting(doc);
});

// pre hook لـ deleteOne
productSchema.pre("deleteOne", { document: false, query: true }, async function () {
    const doc = await this.model.findOne(this.getFilter());
    await deleting(doc);
});

// pre hook لـ deleteMany
productSchema.pre("deleteMany", { document: false, query: true }, async function () {
    const docs = await this.model.find(this.getFilter());
    for (const doc of docs) {
        await deleting(doc);
    }
});

// post hook لـ remove (لو حذفت document مباشر)
productSchema.post("remove", async function () {
    await deleting(this); // هنا this = document
});





let productModel = mongoose.model("Product", productSchema);



export default productModel