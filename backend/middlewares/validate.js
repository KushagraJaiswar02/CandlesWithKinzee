/**
 * validate.js
 * Reusable Zod validation middleware factory.
 *
 * Usage:  validate(schema)            → validates req.body
 *         validate(schema, 'query')   → validates req.query
 *         validate(schema, 'params')  → validates req.params
 *
 * On success  → replaces req[target] with the parsed (stripped) data and calls next()
 * On failure  → returns 400 with a structured errors array
 */
const validate = (schema, target = 'body') => (req, res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
        // Zod v4 uses .issues; v3 used .errors — support both
        const issues = result.error.issues ?? result.error.errors ?? [];
        const errors = issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
        return res.status(400).json({ message: 'Validation failed', errors });
    }

    // Replace with sanitized/parsed data (strips unknown keys)
    req[target] = result.data;
    next();
};

module.exports = validate;
