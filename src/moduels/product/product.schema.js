import joi from 'joi'
import glopalSchema from "../../services/glopalSchema.js"

export const createProudctSchema = {
    body: joi.object({
        title: joi.object({
            arabic: joi.string().required().min(3).max(10),
            english: joi.string().required().min(3).max(10)
        }).required(),
        description: joi.object({
            arabic: joi.string().required(),
            english: joi.string().required()
        }).required(),
        price: joi.number().required(),
        discount: joi.number().max(100),
        category: glopalSchema.id,
        subcategory: glopalSchema.id,
        brand: joi.string().required()
    }).required(),


    files: joi.object({
        image: joi.array().items(glopalSchema.file).required(),
        images: joi.array().items(glopalSchema.file).required()
    }).required()
}

export const changePhotoSchema = {
    body: joi.object({
        public_id: joi.string().required(),
    }),


    params: joi.object({
        ProductID: glopalSchema.id.required()
    }),

    files: joi.object({
        images: joi.array().items(glopalSchema.file),
        image: joi.array().items(glopalSchema.file)
    })
}

export const updateProudctSchema = {
    body: joi.object({
        title: joi.object({
            arabic: joi.string().min(3).max(30),
            english: joi.string().min(3).max(30)
        }),
        description: joi.object({
            arabic: joi.string(),
            english: joi.string()
        }),
        price: joi.number(),
        discount: joi.number().max(100),
        category: glopalSchema.id,
        brand: joi.string(),
        subcategory: glopalSchema.id
    }),


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

}