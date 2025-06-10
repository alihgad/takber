import mongoose from "mongoose";


export default mongoose.connect("mongodb://127.0.0.1:27017/takbeer")
.then(() => {
    console.log("db connected")
})
.catch((err) => {
    console.log(err.message)
    console.log(err)
})