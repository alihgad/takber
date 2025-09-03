import mongoose from "mongoose";



let couponSchema = new mongoose.Schema({
    code:{
        type: String,
        required: true,
        unique: true
    },
    discount:{
        type: Number,
        required: true
    },
    expireDate: {
        type: Date,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }

})


let couponModel = mongoose.model("Coupon", couponSchema)

couponModel.on("save", async function (next) {
    
    await couponModel.updateMany({ expireDate: { $lt: new Date() } }, { $set: { active: false } })
})


export default mongoose.model("Coupon", couponSchema)