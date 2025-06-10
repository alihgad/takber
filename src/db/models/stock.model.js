import mongoose from "mongoose";



let stockSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    
    quantity: {
        type: Number,
        required: true
    },
    color:{
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true,
        enum: ["XS","S", "M", "L", "XL", "XXL" , "XXL"]
    }

})


export default mongoose.model("Stock", stockSchema)