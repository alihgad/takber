import mongoose from "mongoose";



let cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        stockId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Stock",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]

})


export default mongoose.model("Cart", cartSchema)