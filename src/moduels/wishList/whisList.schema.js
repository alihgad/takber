import glopalSchema from "../../services/glopalSchema";

export let addToWhisListSchema = {
    body: Joi.object({
        productId: Joi.string().required(),
        stockId: Joi.string().required(),
    }),
    headers : glopalSchema.headers.required()
}

export let moveToCartSchema = {
    body: Joi.object({
        productId: Joi.string().required(),
        stockId: Joi.string().required(),
    }),
    headers : glopalSchema.headers.required()
}

export let removeFromWhisListSchema = {
    body: Joi.object({
        productId: Joi.string().required(),
        stockId: Joi.string().required(),
    }),
    headers : glopalSchema.headers.required()
}

export let getWhisListSchema = {
    body: Joi.object({
        productId: Joi.string().required(),
        stockId: Joi.string().required(),
    }),
    headers : glopalSchema.headers.required()
}

