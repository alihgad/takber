import joi from "joi"
import { generalRules } from "../../utils/generalRules.js"


export const createStockSchema = {
    params: joi.object({
        productId: generalRules.objectId.required()
        
    }),
    body: joi.object({
        quantity: joi.number().required(),
        size: joi.string().valid("XS","S", "M", "L", "XL", "XXL" , "XXXL").required()
    }),

}

export const createManyStockSchema = {
    params: joi.object({
        productId: generalRules.objectId.required()
        
    }),
    body: joi.array().items(joi.object({
        quantity: joi.number().required(),
        size: joi.string().valid("XS","S", "M", "L", "XL", "XXL" , "XXXL").required()
    })),

    
}

export const deleteStockSchema = {
    params: joi.object({
        stockId: generalRules.objectId.required()
    }),
}

export const updateStockSchema = {
    params: joi.object({
        stockId: generalRules.objectId.required(),
        productId: generalRules.objectId.required()
    }),
    body: joi.object({
        quantity: joi.number(),
    }),
}

export const getStockSchema = {
    params: joi.object({
        productId: generalRules.objectId.required()
    }),
}