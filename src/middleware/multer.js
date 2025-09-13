import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";




export const multerHost = (path) => {

    const storage = multer.diskStorage({
        filename: (req, file, cb) => {
            cb(null, file.originalname + "-" + Date.now())
        },
        destination: path
    })
    return multer({ storage })
}

