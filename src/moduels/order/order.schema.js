import Joi from "joi"
import glopalSchema from "../../services/glopalSchema.js"

export const createOrderSchema = {
    body: Joi.object({
        address: Joi.array().items(Joi.string()).required(),
        phoneNumbers: Joi.array().items(Joi.string().regex(/^01[0125][0-9]{8}$/)).required(),
        city: Joi.string().required(),
        couponId: glopalSchema.id.optional(),
        products: Joi.array().items(Joi.object({
            productId: glopalSchema.id.required(),
            stockId: glopalSchema.id.required(),
            quantity: Joi.number().integer().min(1).required(),
        })).required()
    }),
}

export const updateOrderStatusSchema = {
    body: Joi.object({
        status: Joi.string().valid("pending", "shipped", "delivered").required()
    }),

}

export const getOrderSchema = {
    params: Joi.object({
        orderId: glopalSchema.id.required()
    }),

}

export const getUserOrdersSchema = {

}

export const getAllOrdersSchema = {
}

export const cancelOrderSchema = {
    params: Joi.object({
        orderId: glopalSchema.id.required()
    }),
  
}

export const getTotalRevenueSchema = {
   
}

export const getCategorySalesSchema = {
   
} 