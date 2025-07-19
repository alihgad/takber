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
        code: Joi.string(),
        discount: Joi.number(),
        expireDate: Joi.date(),
    }),
    headers: glopalSchema.headers.required(),
    params: Joi.object({
        id: glopalSchema.id.required(),
    }),
}

export let getCoupon={
    params: Joi.object({
        id: glopalSchema.id.required(),
    }),
}


export let deleteCoupon={
    params: Joi.object({
        id: glopalSchema.id.required(),
    })
}