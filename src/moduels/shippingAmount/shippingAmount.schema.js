import Joi from "joi";
import glopalSchema from "../../services/glopalSchema.js";

// Get shipping amount by ID
export const getShippingAmount = Joi.object({
    id: glopalSchema.id
});

// Create shipping amount
export const createShippingAmount = Joi.object({
    body: Joi.object({
        amount: Joi.number().min(0).required().messages({
            "number.base": "Amount must be a number",
            "number.min": "Amount must be at least 0",
            "any.required": "Amount is required"
        }),
        city: Joi.string().min(2).max(50).required().messages({
            "string.base": "City must be a string",
            "string.min": "City must be at least 2 characters",
            "string.max": "City must be at most 50 characters",
            "any.required": "City is required"
        }),
        active: Joi.boolean().default(true).messages({
            "boolean.base": "Active must be a boolean"
        })
    }),
    headers: glopalSchema.headers.required()
});

// Update shipping amount
export const updateShippingAmount = Joi.object({
    params: Joi.object({
        id: glopalSchema.id
    }),
    body: Joi.object({
        amount: Joi.number().min(0).messages({
            "number.base": "Amount must be a number",
            "number.min": "Amount must be at least 0"
        }),
        city: Joi.string().min(2).max(50).messages({
            "string.base": "City must be a string",
            "string.min": "City must be at least 2 characters",
            "string.max": "City must be at most 50 characters"
        }),
        active: Joi.boolean().messages({
            "boolean.base": "Active must be a boolean"
        })
    }),
    headers: glopalSchema.headers.required()
});

// Delete shipping amount
export const deleteShippingAmount = Joi.object({
    params: Joi.object({
        id: glopalSchema.id
    }),
    headers: glopalSchema.headers.required()
});

// Get shipping amount by city
export const getShippingAmountByCity = Joi.object({
    params: Joi.object({
        city: Joi.string().min(2).max(50).required().messages({
            "string.base": "City must be a string",
            "string.min": "City must be at least 2 characters",
            "string.max": "City must be at most 50 characters",
            "any.required": "City is required"
        })
    })
}); 