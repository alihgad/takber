import stockModel from "../db/models/stock.model.js";



export const getProductStocks = async (products , filter = null) => {
    if (!Array.isArray(products)) {
        products = [products];
    }

    let result = []

    for (const product of products) {

        let stock = await stockModel.find({ productId: product._id })



        if (stock.length != 0) {

            for (const s of stock) {
                product.quantity = s.quantity
                product.color = s.color
                product.size = s.size

                result.push(product)

            }


        } else {
            product.quantity = 0
            product.color = "N/A"
            product.size = "N/A"
            result.push(product)

        }


    }
    // console.log("result", result)


    return result
}
