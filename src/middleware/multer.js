import multer from "multer";





export const multerHost = (path) => {

    const storage = multer.diskStorage({
        filename: (req, file, cb) => {
            let [name, ext] = file.originalname.split(".")
            cb(null, name + "-" + Date.now() + "." + ext)
        },
        destination: "uploads/" + path
    })

    
    return multer({ storage })
}

