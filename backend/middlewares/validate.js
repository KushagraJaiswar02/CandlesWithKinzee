
const validate = (schema, target = 'body') => (req, res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
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
