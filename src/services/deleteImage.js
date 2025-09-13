const fs = require('fs');
const path = require('path');

/**
 * Delete an image file from the filesystem
 * @param {string} imagePath - The path to the image file to delete
 * @returns {Promise<boolean>} - Returns true if deletion was successful, false otherwise
 */
export const deleteImage = async (imagePath) => {
    try {
        // Check if the file exists
        if (!fs.existsSync(imagePath)) {
            console.log(`Image file does not exist: ${imagePath}`);
            return false;
        }

        // Delete the file
        fs.unlinkSync(imagePath);
        console.log(`Successfully deleted image: ${imagePath}`);
        return true;
    } catch (error) {
        console.error(`Error deleting image ${imagePath}:`, error.message);
        return false;
    }
};

/**
 * Delete multiple image files
 * @param {string[]} imagePaths - Array of image paths to delete
 * @returns {Promise<{success: string[], failed: string[]}>} - Object containing arrays of successful and failed deletions
 */
const deleteMultipleImages = async (imagePaths) => {
    const results = {
        success: [],
        failed: []
    };

    for (const imagePath of imagePaths) {
        const deleted = await deleteImage(imagePath);
        if (deleted) {
            results.success.push(imagePath);
        } else {
            results.failed.push(imagePath);
        }
    }

    return results;
};


