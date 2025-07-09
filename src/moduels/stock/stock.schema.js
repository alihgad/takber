import joi from "joi"
import { generalRules } from "../../utils/generalRules.js"


export const createStockSchema = {
    params: joi.object({
        productId: generalRules.objectId.required()
        
    }),
    body: joi.object({
        quantity: joi.number().required(),
        color: joi.string().required(),
        size: joi.string().valid("XS","S", "M", "L", "XL", "XXL" , "XXXL").required()
    }),
    headers: generalRules.headers
}

export const createManyStockSchema = {
    params: joi.object({
        productId: generalRules.objectId.required()
        
    }),
    body: joi.array().items(joi.object({
        quantity: joi.number().required(),
        color: joi.string().required(),
        size: joi.string().valid("XS","S", "M", "L", "XL", "XXL" , "XXXL").required()
    })),
    headers: generalRules.headers
    
}

export const deleteStockSchema = {
    params: joi.object({
        stockId: generalRules.objectId.required()
    }),
    headers: generalRules.headers
}

export const updateStockSchema = {
    params: joi.object({
        stockId: generalRules.objectId.required(),
        productId: generalRules.objectId.required()
    }),
    body: joi.object({
        quantity: joi.number(),
    }),
    headers: generalRules.headers
}

export const getStockSchema = {
    params: joi.object({
        productId: generalRules.objectId.required()
    }),
}