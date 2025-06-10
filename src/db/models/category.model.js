import mongoose from "mongoose";
import productModel from "./product.model.js";



let categorySchema = new mongoose.Schema({
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


let categoryModel = mongoose.model("Category", categorySchema)

categoryModel.on("delete", async function (doc) {
    await cloudinary.uploader.destroy(doc.image.public_id)
    await productModel.deleteMany({ category: doc._id })

})

export default categoryModel