import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get the project root directory (3 levels up from this file)
const projectRoot = path.join(__dirname, "../../../")
const uploadsPath = path.join(projectRoot, "uploads")

/**
 * Get all images from a specific folder
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getImages = async (req, res) => {
    try {
        const { folder = "images", limit = 50, offset = 0, extensions = "jpg,jpeg,png,gif,webp" } = req.query

        // Validate folder name to prevent directory traversal
        if (folder.includes("..") || folder.includes("/") || folder.includes("\\")) {
            return res.status(400).json({
                success: false,
                message: "Invalid folder name"
            })
        }

        const folderPath = path.join(uploadsPath, folder)
        
        // Check if folder exists
        if (!fs.existsSync(folderPath)) {
            return res.status(404).json({
                success: false,
                message: `Folder '${folder}' not found`,
                data: {
                    images: [],
                    totalCount: 0,
                    folder: folder
                }
            })
        }

        // Get all files in the folder
        const files = fs.readdirSync(folderPath)
        
        // Filter by allowed extensions
        const allowedExtensions = extensions.split(",").map(ext => ext.trim().toLowerCase())
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase().substring(1)
            return allowedExtensions.includes(ext)
        })

        // Apply pagination
        const totalCount = imageFiles.length
        const paginatedFiles = imageFiles.slice(parseInt(offset), parseInt(offset) + parseInt(limit))

        // Create image objects with metadata
        const images = paginatedFiles.map(file => {
            const filePath = path.join(folderPath, file)
            const stats = fs.statSync(filePath)
            
            return {
                filename: file,
                url: `/uploads/${folder}/${file}`,
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime,
                extension: path.extname(file).toLowerCase().substring(1)
            }
        })

        return res.status(200).json({
            success: true,
            message: "Images retrieved successfully",
            data: {
                images: images,
                pagination: {
                    totalCount: totalCount,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
                },
                folder: folder,
                allowedExtensions: allowedExtensions
            }
        })

    } catch (error) {
        console.error("Error in getImages:", error)
        return res.status(500).json({
            success: false,
            message: "Error retrieving images",
            error: error.message
        })
    }
}

/**
 * Get all available folders in uploads directory
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getFolders = async (req, res) => {
    try {
        // Check if uploads directory exists
        if (!fs.existsSync(uploadsPath)) {
            return res.status(404).json({
                success: false,
                message: "Uploads directory not found",
                data: {
                    folders: []
                }
            })
        }

        // Get all directories in uploads folder
        const items = fs.readdirSync(uploadsPath, { withFileTypes: true })
        const folders = items
            .filter(item => item.isDirectory())
            .map(item => ({
                name: item.name,
                path: `/uploads/${item.name}`,
                imageCount: getImageCountInFolder(path.join(uploadsPath, item.name))
            }))

        return res.status(200).json({
            success: true,
            message: "Folders retrieved successfully",
            data: {
                folders: folders,
                totalFolders: folders.length
            }
        })

    } catch (error) {
        console.error("Error in getFolders:", error)
        return res.status(500).json({
            success: false,
            message: "Error retrieving folders",
            error: error.message
        })
    }
}

/**
 * Get image count in a specific folder
 * @param {string} folderPath - Path to the folder
 * @returns {number} - Number of image files
 */
const getImageCountInFolder = (folderPath) => {
    try {
        if (!fs.existsSync(folderPath)) return 0
        
        const files = fs.readdirSync(folderPath)
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg']
        
        return files.filter(file => {
            const ext = path.extname(file).toLowerCase().substring(1)
            return imageExtensions.includes(ext)
        }).length
    } catch (error) {
        return 0
    }
}

/**
 * Delete a specific image
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteImage = async (req, res) => {
    try {
        const { folder, filename } = req.params

        // Validate folder and filename to prevent directory traversal
        if (folder.includes("..") || folder.includes("/") || folder.includes("\\") ||
            filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
            return res.status(400).json({
                success: false,
                message: "Invalid folder or filename"
            })
        }

        const filePath = path.join(uploadsPath, folder, filename)
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            })
        }

        // Delete the file
        fs.unlinkSync(filePath)

        return res.status(200).json({
            success: true,
            message: "Image deleted successfully",
            data: {
                deletedFile: filename,
                folder: folder
            }
        })

    } catch (error) {
        console.error("Error in deleteImage:", error)
        return res.status(500).json({
            success: false,
            message: "Error deleting image",
            error: error.message
        })
    }
}
