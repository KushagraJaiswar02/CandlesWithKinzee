const { z } = require('zod');

// ─── Product Query (GET /api/products) ───────────────────────────────────────
// keyword MUST be a plain string — blocks $regex operator injection
const productQuerySchema = z.object({
    keyword: z.string().trim().max(200).optional(),
    category: z.string().trim().max(100).optional(),
    showAll: z.enum(['true', 'false']).optional(),
});

// ─── Create Product ───────────────────────────────────────────────────────────
const createProductSchema = z.object({
    name: z
        .string({ required_error: 'Product name is required' })
        .trim()
        .min(1)
        .max(200),
    price: z
        .number({ required_error: 'Price is required' })
        .positive('Price must be positive'),
    description: z.string().trim().max(2000).optional(),
    image: z.string().trim().max(500).optional(),
    category: z
        .string({ required_error: 'Category is required' })
        .trim()
        .min(1)
        .max(100),
    countInStock: z.number().int().nonnegative().optional(),
});

// ─── Update Product ───────────────────────────────────────────────────────────
const updateProductSchema = z
    .object({
        name: z.string().trim().min(1).max(200).optional(),
        price: z.number().positive().optional(),
        description: z.string().trim().max(2000).optional(),
        image: z.string().trim().max(500).optional(),
        category: z.string().trim().min(1).max(100).optional(),
        countInStock: z.number().int().nonnegative().optional(),
    })
    .strict();

// ─── Create Review ────────────────────────────────────────────────────────────
const createReviewSchema = z.object({
    rating: z
        .number({ required_error: 'Rating is required' })
        .int()
        .min(1, 'Rating must be between 1 and 5')
        .max(5, 'Rating must be between 1 and 5'),
    comment: z
        .string({ required_error: 'Comment is required' })
        .trim()
        .min(1)
        .max(1000),
    images: z.array(z.string().url()).max(5).optional(),
});

// ─── Update Review ────────────────────────────────────────────────────────────
const updateReviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().trim().min(1).max(1000),
});

module.exports = {
    productQuerySchema,
    createProductSchema,
    updateProductSchema,
    createReviewSchema,
    updateReviewSchema,
};
