const { z } = require('zod');

// ─── Register ────────────────────────────────────────────────────────────────
const registerSchema = z.object({
    name: z
        .string({ required_error: 'Name is required' })
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be at most 50 characters'),

    email: z
        .string({ required_error: 'Email is required' })
        .trim()
        .toLowerCase()
        .email('Invalid email address'),

    password: z
        .string({ required_error: 'Password is required' })
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password is too long'),
});

// ─── Login ───────────────────────────────────────────────────────────────────
// NOTE: email validated as a true email string → blocks { "$gt": "" } injection
const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .trim()
        .toLowerCase()
        .email('Invalid email address'),

    password: z
        .string({ required_error: 'Password is required' })
        .min(1, 'Password is required'),
});

// ─── Update Profile ──────────────────────────────────────────────────────────
const addressSchema = z.object({
    label: z.string().max(50).optional(),
    street: z.string().max(200),
    city: z.string().max(100),
    state: z.string().max(100),
    postalCode: z.string().max(20),
    country: z.string().max(100),
    isDefault: z.boolean().optional(),
});

const paymentMethodSchema = z.object({
    type: z.string().max(50),
    last4: z.string().length(4).optional(),
    isDefault: z.boolean().optional(),
});

const updateProfileSchema = z
    .object({
        name: z.string().trim().min(2).max(50).optional(),
        email: z.string().trim().toLowerCase().email().optional(),
        password: z.string().min(8).max(100).optional(),
        phoneNumber: z
            .string()
            .regex(/^\+?[1-9]\d{6,14}$/, 'Invalid phone number')
            .optional(),
        profileImage: z.string().url('Invalid image URL').optional(),
        addresses: z.array(addressSchema).max(10).optional(),
        paymentMethods: z.array(paymentMethodSchema).max(10).optional(),
    })
    .strict(); // reject any unknown keys entirely

module.exports = { registerSchema, loginSchema, updateProfileSchema };
