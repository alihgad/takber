import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

export default mongoose.connect(process.env.URI)
.then(() => {
    console.log("db connected")
})
.catch((err) => {
    console.log(err.message)
    console.log(err)
})