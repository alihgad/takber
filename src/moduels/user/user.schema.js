import Joi from "joi"
import glopalSchema from "../../services/glopalSchema.js"

export const signUpSchema = {
    body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/ , "Password must be at least 8 characters, at least one uppercase letter, at least one lowercase letter, and at least one number").required(),
        phoneNumbers: Joi.array().items(Joi.string().regex(/01[0125][0-9]{8}/)),
        address: Joi.array().items(Joi.string())
    })
}

export const updateUserSchema = {
    body: Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        phoneNumbers: Joi.array().items(Joi.string().regex(/01[0125][0-9]{8}/)),
        address: Joi.array().items(Joi.string())
    }),

}

export const updatePasswordSchema = {
    body: Joi.object({
        newPassword: Joi.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/ , "Password must be at least 8 characters, at least one uppercase letter, at least one lowercase letter, and at least one number").required(),
        oldPassword : Joi.string().required()
    }),

}



export const loginSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),

    })
}

export const verfiySchema={

    params:Joi.object({
        token:Joi.string().required(),
    })

}


export const forgetPasswordSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
    }),
}

export const deleteUserSchema = {
}

export const resetPasswordSchema = {
    params:Joi.object({
        token:Joi.string().required(),
    })
} 


export const getAllSchema = {
}

export const createUserSchema = {
    body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/ , "Password must be at least 8 characters, at least one uppercase letter, at least one lowercase letter, and at least one number").required(),
        phoneNumbers: Joi.array().items(Joi.string().regex(/01[0125][0-9]{8}/)),
        address: Joi.array().items(Joi.string()),
        role: Joi.string().valid( 'admin', 'dataEntry')
    }),
}

