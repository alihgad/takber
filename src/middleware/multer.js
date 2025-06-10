import multer from "multer";
import dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary"


dotenv.config()

export default cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});

 



export const multerHost = (type) => {
    
    const storage = multer.diskStorage({})

    const fileFilter = (req, file, cb) => {

        if (file.mimetype.startsWith(type)) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }

    return multer({ storage ,fileFilter})
}