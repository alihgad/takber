import Joi from "joi";
import glopalSchema from "../../services/glopalSchema.js";

export let createSubcategory = {
    body: Joi.object({
        title: Joi.object({
            arabic: Joi.string().required().min(3).max(30),
            english: Joi.string().required().min(3).max(30)
        }).required(),
        categoryId: Joi.string().required()
    }),
    file: glopalSchema.file.required(),
}

export let updateSubcategory = {
    body: Joi.object({
        title: Joi.object({
            arabic: Joi.string().min(3).max(10),
            english: Joi.string().min(3).max(10)
        }),
        categoryId: Joi.string(),
    }),
    params: Joi.object({
        id: glopalSchema.id.required(),
    }),
    file: glopalSchema.file,
}

export let getSubcategory = {
    params: Joi.object({
        id: glopalSchema.id.required(),
    }),
}

export let getSubcategoriesByCategory = {
    params: Joi.object({
        categoryId: glopalSchema.id.required(),
    }),
}

export let deleteSubcategory = {
    params: Joi.object({
        id: glopalSchema.id.required(),
    }),
}