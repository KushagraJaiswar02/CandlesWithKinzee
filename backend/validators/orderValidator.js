const { z } = require('zod');

// Reusable MongoDB ObjectId string shape
const mongoId = z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid ID format');

// ─── Add Order Items ──────────────────────────────────────────────────────────
const orderItemSchema = z.object({
    product: mongoId,
    quantity: z.number().int().min(1).max(100),
    // Legacy clients may still send display-only fields. They are accepted for
    // compatibility but ignored by backend pricing.
    name: z.string().trim().min(1).max(200).optional(),
    image: z.string().trim().max(500).optional(),
    price: z.number().positive().optional(),
});

const shippingAddressSchema = z.object({
    address: z.string().trim().min(1).max(200),
    city: z.string().trim().min(1).max(100),
    postalCode: z.string().trim().min(1).max(20),
    country: z.string().trim().min(1).max(100),
    state: z.string().trim().max(100).optional(),
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{6,14}$/, 'Invalid phone number')
        .optional(),
});

const addOrderItemsSchema = z.object({
    orderItems: z
        .array(orderItemSchema)
        .min(1, 'No order items'),
    shippingAddress: shippingAddressSchema,
    paymentMethod: z.string().trim().min(1).max(50).optional().default('Razorpay'),
    couponCode: z.string().trim().max(50).optional(),
    shippingMethod: z.string().trim().max(50).optional(),
    // Deprecated monetary fields. Never use these for persistence or payment.
    itemsPrice: z.number().nonnegative().optional(),
    taxPrice: z.number().nonnegative().optional(),
    shippingPrice: z.number().nonnegative().optional(),
    discountAmount: z.number().nonnegative().optional(),
    totalPrice: z.number().positive().optional(),
}).strip();

// ─── Verify Payment ───────────────────────────────────────────────────────────
const verifyPaymentSchema = z.object({
    razorpay_order_id: z.string().trim().min(1).max(100),
    razorpay_payment_id: z.string().trim().min(1).max(100),
    razorpay_signature: z.string().trim().min(1).max(256),
    order_id: mongoId,
});

// ─── Update Order Status ──────────────────────────────────────────────────────
// Zod enum is more secure than a runtime includes() check — unknown values
// never reach mongoose, not even as a string
const updateOrderStatusSchema = z.object({
    status: z.enum(
        ['Pending', 'Processed', 'Out for Delivery', 'Delivered', 'Cancelled'],
        { required_error: 'Status is required' }
    ),
});

module.exports = {
    addOrderItemsSchema,
    verifyPaymentSchema,
    updateOrderStatusSchema,
};
