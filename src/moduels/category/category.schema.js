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
        image: glopalSchema.file,

    }),
    file: glopalSchema.file.required(),
    headers: glopalSchema.headers.required(),
}

export let updateCategory = {
    body: Joi.object({
        title: Joi.object({
            arabic: Joi.string().min(3).max(10),
            english: Joi.string().min(3).max(10)
        }),


    }),
    headers: glopalSchema.headers.required(),
    params: Joi.object({
        id: glopalSchema.id.required(),
    }),
    file: glopalSchema.file,
    
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
    headers : glopalSchema.headers.required()
}