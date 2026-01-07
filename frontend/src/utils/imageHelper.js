
import API_BASE_URL from '../config/api';

/**
 * Robustly extracts a valid image URL from a product image field.
 * Handles strings, Cloudinary objects, and local vs remote paths.
 * @param {string|object} image - The image data from the product.
 * @returns {string} - The valid image URL.
 */
export const getValidImageUrl = (image) => {
    let imageUrl = image;

    // 1. Handle Object: Extract URL string if it's an object
    if (imageUrl && typeof imageUrl === 'object') {
        imageUrl = imageUrl.secure_url || imageUrl.url || imageUrl.image;
    }

    // 2. Handle Local vs Remote: Prepend API URL only if it's a local path (not http/data)
    if (imageUrl && typeof imageUrl === 'string') {
        if (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
            // Remove leading slash from path if present to avoid double slash, assuming API_BASE_URL doesn't end in slash
            const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
            return `${API_BASE_URL}${cleanPath}`;
        }
    }

    return imageUrl || '';
};
