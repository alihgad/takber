import stockModel from "../db/models/stock.model.js";

export const getProductStocks = async (products, filter = {}) => {
  if (!Array.isArray(products)) {
    products = [products];
  }
  let { size } = filter;

  let result = [];

  for (const product of products) {
    let stockQuery = { productId: product._id };
    
    // Only add size filter if size is provided
    if (size) {
      stockQuery.size = size;
    }
    
    let stock = await stockModel.find(stockQuery);

    if (stock.length != 0) {
      product.stock = stock;
      result.push(product);
    } else if (!size) {
      // Only add products without stock if no size filter is applied
      result.push(product);
    }
    // If size filter is applied and no stock found, don't add the product
  }

  return result;
};
