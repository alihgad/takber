import stockModel from "../../db/models/stock.model.js"


export let addStock = async (req, res, next) => {
    let productId = req.params.productId
    let {quantity , color , size} = req.body

   

    let exists = await stockModel.findOne({ productId, color, size: size.toUpperCase() })
    if (exists) {
        exists.quantity += quantity
        await exists.save()
        return res.json({ msg: 'Stock alerdy exists and is updated by adding new quantity', stock: exists })
    }


    let stock = await stockModel.create({
        productId,
        quantity,
        color,
        size: size.toUpperCase()
    })


    return res.json({ msg: 'Stock added', stock })
}

export let getProductStock = async (req, res, next) => {
    let stocks = await stockModel.find({ productId: req.params.productId })
    if (stocks.length == 0) {
        return next(new Error('Product stock not found', { cause: 404 }))
    }
    return res.json({ msg: 'Stock fetched', stocks })
}

export let updateProductStock = async (req, res, next) => {

    let { quantity } = req.body
    let { productId, stockId } = req.params
    let product = await stockModel.findOne({ productId, _id: stockId })
    if (!product) {
       return next(new Error('Product not found', { cause: 404 }))
    }
    
    let stock = await stockModel.findOne({ productId: req.params.productId  , _id: req.params.stockId } )
    
    if (!stock) {
        return next(new Error('Product stock not found', { cause: 404 }))
    }

    
        stock.quantity += Number(quantity)
    
    await stock.save()
    return res.json({ msg: 'Stock is updated', stock })
}