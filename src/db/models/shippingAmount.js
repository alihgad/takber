import mongoose from "mongoose";

let shippingAmountSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    city: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },

}, {
    timestamps: true
})



export default mongoose.model("ShippingAmount", shippingAmountSchema)




