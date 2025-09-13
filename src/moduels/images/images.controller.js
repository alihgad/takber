import { Router } from "express"
import { asyncHandler } from "../../utils/ErrorHandling.js"
import * as imagesService from "./images.service.js"
import validation from "../../middleware/validation.js"
import { getImagesSchema, uploadImageSchema } from "./images.schema.js"
import authentication from "../../middleware/authentication.js"
import authorization from "../../middleware/authorization.js"
import { multerHost } from "../../middleware/multer.js"
import path from "path"

export const imagesRouter = Router()

/**
 * @api {get} /images Get all images from a folder
 * @apiName GetImages
 * @apiGroup Images
 * @apiDescription Get all images from a specific folder with pagination and filtering
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiQuery {String} [folder=images] Folder name to get images from
 * @apiQuery {Number} [limit=50] Maximum number of images to return (1-100)
 * @apiQuery {Number} [offset=0] Number of images to skip
 * @apiQuery {String} [extensions=jpg,jpeg,png,gif,webp] Comma-separated list of allowed file extensions
 * @apiSuccess {Array} images Array of image objects
 * @apiSuccess {String} images[].filename Image filename
 * @apiSuccess {String} images[].url Public URL to access the image
 * @apiSuccess {Number} images[].size File size in bytes
 * @apiSuccess {Date} images[].created Creation date
 * @apiSuccess {Date} images[].modified Last modified date
 * @apiSuccess {String} images[].extension File extension
 * @apiSuccess {Object} pagination Pagination information
 * @apiSuccess {Number} pagination.totalCount Total number of images
 * @apiSuccess {Number} pagination.limit Current limit
 * @apiSuccess {Number} pagination.offset Current offset
 * @apiSuccess {Boolean} pagination.hasMore Whether there are more images
 */
imagesRouter.get("/", 
    validation(getImagesSchema), 
    authentication, 
    authorization(["admin", "user"]), 
    asyncHandler(imagesService.getImages)
)

/**
 * @api {get} /images/folders Get all available folders
 * @apiName GetFolders
 * @apiGroup Images
 * @apiDescription Get all available folders in the uploads directory
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiSuccess {Array} folders Array of folder objects
 * @apiSuccess {String} folders[].name Folder name
 * @apiSuccess {String} folders[].path Public path to folder
 * @apiSuccess {Number} folders[].imageCount Number of images in folder
 */
imagesRouter.get("/folders", 
    authentication, 
    authorization(["admin", "user"]), 
    asyncHandler(imagesService.getFolders)
)



/**
 * @api {delete} /images/:folder/:filename Delete an image
 * @apiName DeleteImage
 * @apiGroup Images
 * @apiDescription Delete a specific image from a folder
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiParam {String} folder Folder name containing the image
 * @apiParam {String} filename Image filename to delete
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} data Deleted image information
 */
imagesRouter.delete("/:folder/:filename", 
    authentication, 
    authorization(["admin"]), 
    asyncHandler(imagesService.deleteImage)
)

/**
 * @api {get} /images/:folder/:filename Get specific image info
 * @apiName GetImageInfo
 * @apiGroup Images
 * @apiDescription Get information about a specific image
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiParam {String} folder Folder name containing the image
 * @apiParam {String} filename Image filename
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} data Image information
 */
imagesRouter.get("/:folder/:filename", 
    authentication, 
    authorization(["admin", "user"]), 
    asyncHandler(async (req, res) => {
        try {
            const { folder, filename } = req.params
            const fs = await import("fs")
            const path = await import("path")
            const { fileURLToPath } = await import("url")

            const __filename = fileURLToPath(import.meta.url)
            const __dirname = path.dirname(__filename)
            const projectRoot = path.join(__dirname, "../../../")
            const uploadsPath = path.join(projectRoot, "uploads")
            const filePath = path.join(uploadsPath, folder, filename)

            // Validate folder and filename to prevent directory traversal
            if (folder.includes("..") || folder.includes("/") || folder.includes("\\") ||
                filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid folder or filename"
                })
            }

            // Check if file exists
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    message: "Image not found"
                })
            }

            const stats = fs.statSync(filePath)
            const imageUrl = `/uploads/${folder}/${filename}`

            return res.status(200).json({
                success: true,
                message: "Image information retrieved successfully",
                data: {
                    filename: filename,
                    url: imageUrl,
                    size: stats.size,
                    created: stats.birthtime,
                    modified: stats.mtime,
                    extension: path.extname(filename).toLowerCase().substring(1),
                    folder: folder
                }
            })

        } catch (error) {
            console.error("Error in getImageInfo:", error)
            return res.status(500).json({
                success: false,
                message: "Error retrieving image information",
                error: error.message
            })
        }
    })
)
