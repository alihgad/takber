import Cover from "../../db/models/cover.js"

export const createCover = async (req, res, next) => {
    let { location } = req.body
    if (!req.file) {
        return next(new Error("Image is required", { cause: 400 }))
    }
    let imagePath = req.file.path
    req.folder = imagePath
    req.filename = req.file.filename
    let cover = await Cover.create({ location, image: imagePath })

    return res.status(201).json({ message: "Cover created", cover })
}

export const getCovers = async (req, res, next) => {
    let covers = await Cover.find()
    return res.status(200).json({ message: "Covers retrieved", covers })
}

export const getCover = async (req, res, next) => {
    let cover = await Cover.findById(req.params.id)
    if (!cover) {
        return next(new Error("Cover not found", { cause: 404 }))
    }
    return res.status(200).json({ message: "Cover retrieved", cover })
}

export const updateCover = async (req, res, next) => {
    let {id} = req.params
    let updateData = {}

    if (req.file) {
        let imagePath = req.file.path
        req.folder = imagePath
        req.filename = req.file.filename
        updateData.image = imagePath
    }

    let cover = await Cover.findByIdAndUpdate(id, updateData, { new: true })
    return res.status(200).json({ message: "Cover updated", cover })
}

export const deleteCover = async (req, res, next) => {
    let {id} = req.params
    let cover = await Cover.findByIdAndDelete(id)
    if (!cover) {
        return next(new Error("Cover not found", { cause: 404 }))
    }
    return res.status(200).json({ message: "Cover deleted", cover })
}
