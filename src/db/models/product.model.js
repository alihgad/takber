import mongoose from "mongoose";



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
    images:{
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
    customId:{
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
    isDiscounted: {
        type: Boolean,
        default: false
    },
    discount: {
        type: Number,
        default: 0
    }
})


let productModel = mongoose.model("Product", productSchema)

productModel.on("delete", async (doc) => {
    await cloudinary.api.delete_resources_by_prefix(`Takbeer/category/${doc.category.customId}/products/${doc.customId}`)
    await stockModel.deleteMany({ productId: doc._id })
})


export default productModel