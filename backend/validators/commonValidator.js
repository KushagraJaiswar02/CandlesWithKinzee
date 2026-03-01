const { z } = require('zod');

/**
 * Validates that req.params.id is a valid 24-hex-char MongoDB ObjectId.
 * Use with:  validate(mongoIdParamSchema, 'params')
 */
const mongoIdParamSchema = z.object({
    id: z
        .string()
        .regex(/^[a-f\d]{24}$/i, 'Invalid resource ID format'),
});

module.exports = { mongoIdParamSchema };
