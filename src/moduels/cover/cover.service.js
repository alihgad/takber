export const createCover = async (req, res, next) => {
    let { location } = req.body
    let imagePath = req.file.path
    req.folder = imagePath
    req.filename = req.file.filename
    let cover = await coverModel.create({ location, imagePath })

    return res.status(201).json({ message: "Cover created", cover })
}

export const getCovers = async (req, res, next) => {
    let covers = await coverModel.find()
    return res.status(200).json({ message: "Covers retrieved", covers })
}

export const getCover = async (req, res, next) => {
    let cover = await coverModel.findById(req.params.id)
    if (!cover) {
        return next(new Error("Cover not found", { cause: 404 }))
    }
    return res.status(200).json({ message: "Cover retrieved", cover })
}

export const updateCover = async (req, res, next) => {
    let {id} = req.params

    let imagePath = req.file.path
    req.folder = imagePath
    req.filename = req.file.filename
    let cover = await coverModel.findByIdAndUpdate(id, { imagePath }, { new: true })
    return res.status(200).json({ message: "Cover updated", cover })
}

export const deleteCover = async (req, res, next) => {
    let {id} = req.params
    let cover = await coverModel.findByIdAndDelete(id)
    if (!cover) {
        return next(new Error("Cover not found", { cause: 404 }))
    }
    return res.status(200).json({ message: "Cover deleted", cover })
}
