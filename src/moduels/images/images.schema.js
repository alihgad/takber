import Joi from "joi"

export const getImagesSchema = Joi.object({
    folder: Joi.string().optional().default("images").description("Folder name to get images from"),
    limit: Joi.number().integer().min(1).max(100).optional().default(50).description("Maximum number of images to return"),
    offset: Joi.number().integer().min(0).optional().default(0).description("Number of images to skip"),
    extensions: Joi.string().optional().default("jpg,jpeg,png,gif,webp").description("Comma-separated list of allowed file extensions")
})

export const uploadImageSchema = Joi.object({
    folder: Joi.string().optional().default("images").description("Folder to upload image to")
})
