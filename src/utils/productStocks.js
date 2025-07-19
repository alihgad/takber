import stockModel from "../db/models/stock.model.js";



export const getProductStocks = async (products , filter = {}) => {
    if (!Array.isArray(products)) {
        products = [products];
    }
    let {color , size } = filter

    let result = []

    for (const product of products) {

        let stock = await stockModel.find({ productId: product._id })
      
        if (stock.length != 0) {
            product.stock = stock
            result.push(product)
        } else {
            result.push(product)
        }


    }



    return result
}
