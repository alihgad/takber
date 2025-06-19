import joi from 'joi'
import glopalSchema from "../../services/glopalSchema.js"

export const createProudctSchema = {
    body: joi.object({
        title: joi.string().required(),
        description : joi.string().required(),
        price : joi.number().required(),
        discount : joi.number().max(100),
        category: glopalSchema.id,
        brand : joi.string().required()
    }).required(),

    headers: glopalSchema.headers.required(),

    files: joi.object({
        image:joi.array().items(glopalSchema.file).required(),
        images: joi.array().items(glopalSchema.file).required()
    }).required() 
} 

export const changePhotoSchema = {
    body: joi.object({
        public_id : joi.string().required(),
    }),

    headers: glopalSchema.headers.required(),

    params : joi.object({
        ProductID : glopalSchema.id.required()
    }),

    files: joi.object({
        images: joi.array().items(glopalSchema.file),
        image:joi.array().items(glopalSchema.file)
    }) 
} 

export const updateProudctSchema = {
    body: joi.object({
        title: joi.string(),
        description : joi.string(),
        price : joi.number(),
        discount : joi.number().max(100)
    }),

    headers: glopalSchema.headers.required(),
    
} 


export const getOneProudctSchema = {
    params: joi.object({
        ProductID: glopalSchema.id.required()
    })
}

export const deleteProudctSchema = {
    params: joi.object({
        ProductID: glopalSchema.id.required()
    }),
    headers : glopalSchema.headers.required(),
}