import mongoose from "mongoose";



let whishListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            prodectId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            stockId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Stock",
                required: true
            }
        }
    ]

})


export default mongoose.model("WhisList", whishListSchema)