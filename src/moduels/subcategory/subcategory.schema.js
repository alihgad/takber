import Joi from "joi";
import glopalSchema from "../../services/glopalSchema.js";

export let createSubcategory = {
    body: Joi.object({
        title: Joi.object({
            arabic: Joi.string().required().min(3).max(20),
            english: Joi.string().required().min(3).max(20)
        }).required(),
        categoryId: Joi.string().required()
    }),

}

export let updateSubcategory = {
    body: Joi.object({
        title: Joi.object({
            arabic: Joi.string().min(3).max(20),
            english: Joi.string().min(3).max(20)
        }),
        categoryId: Joi.string(),
    }),
    params: Joi.object({
        id: glopalSchema.id.required(),
    }),

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