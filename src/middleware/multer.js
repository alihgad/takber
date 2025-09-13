import multer from "multer";
import dotenv from "dotenv";




export const multerHost = (path) => {

    const storage = multer.diskStorage({
        filename: (req, file, cb) => {
            cb(null, file.originalname + "-" + Date.now())
        },
        destination: (req, file, cb) => {
            cb(null, path)
        }
    })
    return multer({ storage })
}

