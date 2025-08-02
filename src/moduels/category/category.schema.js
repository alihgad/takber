import Joi from "joi";
import glopalSchema from "../../services/glopalSchema.js";

export let createCategory = {
    body: Joi.object({
        title: Joi.object({
            arabic: Joi.string().required().min(3).max(20),
            english: Joi.string().required().min(3).max(20)
        }).required(),
        description: Joi.object({
            arabic: Joi.string().required(),
            english: Joi.string().required()
        }).required(),

    }),
}

export let updateCategory = {
    body: Joi.object({
        title: Joi.object({
            arabic: Joi.string().min(3).max(10),
            english: Joi.string().min(3).max(10)
        }),


    }),
    params: Joi.object({
        id: glopalSchema.id.required(),
    }),
}

export let getCategory={
    params: Joi.object({
        id: glopalSchema.id.required(),
    }),
}

export let deleteCategory={
    params: Joi.object({
        id: glopalSchema.id.required(),
    }),

}