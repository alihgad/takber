import Joi from "joi"
import glopalSchema from "../../services/glopalSchema.js"

export const createOrderSchema = {
    body: Joi.object({
        address: Joi.array().items(Joi.string()).required(),
        phoneNumbers: Joi.array().items(Joi.string().regex(/^01[0125][0-9]{8}$/)).required(),
        city: Joi.string().required(),
        couponId: glopalSchema.id.optional()
    }),
    headers: glopalSchema.headers.required()
}

export const updateOrderStatusSchema = {
    body: Joi.object({
        status: Joi.string().valid("pending", "shipped", "delivered").required()
    }),
    headers: glopalSchema.headers.required()
}

export const getOrderSchema = {
    params: Joi.object({
        orderId: glopalSchema.id.required()
    }),
    headers: glopalSchema.headers.required()
}

export const getUserOrdersSchema = {
    headers: glopalSchema.headers.required()
}

export const getAllOrdersSchema = {
    headers: glopalSchema.headers.required()
}

export const cancelOrderSchema = {
    params: Joi.object({
        orderId: glopalSchema.id.required()
    }),
    headers: glopalSchema.headers.required()
}

export const getTotalRevenueSchema = {
    headers: glopalSchema.headers.required()
}

export const getCategorySalesSchema = {
    headers: glopalSchema.headers.required()
} 