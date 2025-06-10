import stockModel from "../../db/models/stock.model.js"
import { asyncHandler } from "../../utils/ErrorHandling.js"

export let addStock = asyncHandler(async (req, res, next) => {
    let productId = req.params.productId
    let {quantity , color , size} = req.body


    let stock = await stockModel.create({
        productId,
        quantity,
        color,
        size: size.toUpperCase()
    })


    return res.json({ msg: 'Stock added', stock })
})

export let getProductStock = asyncHandler(async (req, res, next) => {
    let stocks = await stockModel.find({ productId: req.params.productId })
    if (stocks.length == 0) {
        return res.status(404).json({ msg: 'product Stock not found' })
    }
    return res.json({ msg: 'Stock fetched', stocks })
})

export let updateProductStock = asyncHandler(async (req, res, next) => {
    let stock = await stockModel.findOneAndUpdate({ productId: req.params.productId  , _id: req.params.stockId } , {quantity : {$inc : req.body.quantity}}, { new: true })
    if (!stock) {
        return res.status(404).json({ msg: 'product Stock not found' })
    }
    return res.json({ msg: 'Stock is updated', stock })
})