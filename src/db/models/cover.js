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


const Cover = mongoose.model("Cover", coverSchema)

export default Cover




