export let addToWhishList = async (req, res, next) => {
    let { productId, stockId } = req.body
    let whishList = await whisListModel.findOne({
        userId: req.user._id,
    })

    if (!whishList) {
        whishList = await whisListModel.create({
            userId: req.user._id,
            products: [{ productId, stockId }]
        })
    }

    whishList.products.push({ productId, stockId })
    await whishList.save()
    return res.status(201).json({ message: "done" })

}

export let moveToCart = async (req, res, next) => {
    let { productId, stockId } = req.body
    let whishList = await whisListModel.findOneAndUpdate({ userId: req.user._id }, { $pull: { products: { productId, stockId } } }, { new: true })
    let cart = await cartModel.findOne({ userId: req.user._id })
    if (!cart) {
        cart = await cartModel.create({
            userId: req.user._id,
            products: [{ productId, stockId }]
        })
    }
    cart.products.push({ productId, stockId, quantity: 1 })
    await cart.save()
    if (whishList.products.length == 0) {
        await whishList.deleteOne()
    }

    return res.status(201).json({ message: "done" })
}

export let removeFromWhishList = async (req, res, next) => {
    let { productId, stockId } = req.body
    let whishList = await whisListModel.findOne({ userId: req.user._id })
    
    if(!whishList){
        return res.status(404).json({message:"WhishList Not Found"})
    }
    let index = whishList.products.findIndex(product => product.productId == productId && product.stockId == stockId)
    if(index == -1){
        return res.status(404).json({message:"Product Not Found"})
    }
    whishList.products.splice(index, 1)
    await whishList.save()
    
    if(whishList.products.length == 0){
        await whishList.deleteOne()
    }

    return res.status(201).json({ message: "done" })
}

export let getWhishList = async (req, res, next) => {
    let whishList = await whisListModel.findOne({ userId: req.user._id })
    if (!whishList) {
        return res.status(404).json({ message: "WhishList Not Found" })
    }
    return res.status(200).json({ message: "done", whishList })
}

