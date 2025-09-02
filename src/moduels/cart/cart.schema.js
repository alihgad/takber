import Joi from "joi"
import glopalSchema from "../../services/glopalSchema.js"

export const addToCartSchema = {
    body: Joi.object({
        productId: glopalSchema.id.required(),
        stockId: glopalSchema.id.required(),
        quantity: Joi.number().integer().min(1).required()
    }),
    headers: glopalSchema.headers.required()
}

export const updateCartItemSchema = {
    body: Joi.object({
        productId: glopalSchema.id.required(),
        stockId: glopalSchema.id.required(),
        quantity: Joi.number().integer().min(1).required()
    }),
    headers: glopalSchema.headers.required()
}

export const removeFromCartSchema = {
    body: Joi.object({
        productId: glopalSchema.id.required(),
        stockId: glopalSchema.id.required()
    }),
    headers: glopalSchema.headers.required()
}

export const getCartSchema = {
    headers: glopalSchema.headers.required()
}

export const clearCartSchema = {
    headers: glopalSchema.headers.required()
} 