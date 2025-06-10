import glopalSchema from "../../services/glopalSchema.js";
import Joi from "joi";
export let createCoupon = {
    body: Joi.object({
        code: Joi.string().required(),
        discount: Joi.number().required(),
        expireDate: Joi.date().required(),

    }),
    headers: glopalSchema.headers.required(),
}

export let updateCoupon = {
    body: Joi.object({
        title: Joi.string(),
        image: glopalSchema.file.required(),

    }),
    headers: glopalSchema.headers.required(),
    params: Joi.object({
        id: glopalSchema.id.required(),
    }),
    headers: glopalSchema.headers.required(),
}

export let getCoupon={
    params: Joi.object({
        id: glopalSchema.id.required(),
    }),
}
export let getCoupons={
    header: glopalSchema.headers.required,
}

export let deleteCoupon={
    params: Joi.object({
        id: glopalSchema.id.required(),
    }),
    headers : glopalSchema.headers.required()
}