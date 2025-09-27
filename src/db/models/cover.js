import mongoose from "mongoose";

let coverSchema = new mongoose.Schema({
    location:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    }

}, {
    timestamps: true
})



export default mongoose.model("cover", coverSchema)




