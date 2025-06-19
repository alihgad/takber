import Joi from "joi";
import glopalSchema from "../../services/glopalSchema.js";

export let createCategory = {
    body: Joi.object({
        title: Joi.string().required(),
        image: glopalSchema.file,

    }),
    file: glopalSchema.file.required(),
    headers: glopalSchema.headers.required(),
}

export let updateCategory = {
    body: Joi.object({
        title: Joi.string(),


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