const mongoose = require('mongoose');
const Product = require('../models/ProductModel');
const Order = require('../models/OrderModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { calculateOrderPricing } = require('../services/pricingService');

const decrementStockForPaidOrder = async (order) => {
    const bulkOps = order.orderItems.map((item) => ({
        updateOne: {
            filter: { _id: item.product, countInStock: { $gte: item.quantity }, isDeleted: false },
            update: { $inc: { countInStock: -item.quantity } },
        },
    }));

    const result = await Product.bulkWrite(bulkOps);

    if (result.modifiedCount !== order.orderItems.length) {
        const error = new Error('Stock is no longer available for this order. Manual review/refund may be required.');
        error.statusCode = 409;
        throw error;
    }
};

// Initialize Razorpay
let razorpay;
try {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    } else {
        console.warn('Razorpay keys missing in .env. Payment features will fail.');
    }
} catch (err) {
    console.error('Razorpay init failed:', err.message);
}

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    }

    // SECURITY: Product prices, line items, shipping, tax, discounts, and
    // payable totals are generated from trusted database state only. Any
    // monetary values sent by the client are treated as display-only legacy
    // fields and deliberately ignored.
    const pricedOrder = await calculateOrderPricing(orderItems);

    const order = new Order({
        orderItems: pricedOrder.orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod: paymentMethod || 'Razorpay',
        itemsPrice: pricedOrder.totals.itemsPrice,
        taxPrice: pricedOrder.totals.taxPrice,
        shippingPrice: pricedOrder.totals.shippingPrice,
        discountAmount: pricedOrder.totals.discountAmount,
        totalPrice: pricedOrder.totals.totalPrice,
        totalPricePaise: pricedOrder.totals.totalPricePaise,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        const orderUserId = order.user._id ? order.user._id.toString() : order.user.toString();
        if (req.user.isAdmin || orderUserId === req.user._id.toString()) {
            res.json(order);
        } else {
            res.status(403);
            throw new Error('Not authorized to view this order');
        }
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
};

// @desc    Create Razorpay Order
// @route   POST /api/orders/pay/:id
// @access  Private
const createRazorpayOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (order.user.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to pay for this order');
        }

        if (order.isPaid) {
            res.status(400);
            throw new Error('Order is already paid');
        }

        if (!Number.isSafeInteger(order.totalPricePaise) || order.totalPricePaise <= 0) {
            res.status(400);
            throw new Error('Order is missing a trusted payable amount. Please recreate the order.');
        }

        const options = {
            // SECURITY: Razorpay receives the backend-generated paise amount
            // stored with the order, never a value from the browser.
            amount: order.totalPricePaise,
            currency: 'INR',
            receipt: `receipt_${order._id}`,
        };

        try {
            const razorpayOrder = await razorpay.orders.create(options);

            // SECURITY: Link local order to Razorpay order for verification.
            order.razorpayOrderId = razorpayOrder.id;
            await order.save();

            res.json(razorpayOrder);
        } catch (error) {
            console.error('[Razorpay Error]:', error);
            res.status(500);
            throw new Error(error.error && error.error.description ? error.error.description : error.message);
        }
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/orders/pay/verify
// @access  Private
const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    const safeOrderId = new mongoose.Types.ObjectId(String(order_id));
    const order = await Order.findById(safeOrderId);

    // 1. IF order not found -> deny
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // 2. IF user not admin AND order.user != req.user._id -> deny
    const orderUserId = order.user._id ? order.user._id.toString() : order.user.toString();
    if (!req.user.isAdmin && orderUserId !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to verify this order');
    }

    // 3. IF order already paid -> deny duplicate verification
    if (order.isPaid) {
        res.status(400);
        throw new Error('Order already paid');
    }

    // 4. IF Razorpay order mismatch -> deny
    if (order.razorpayOrderId !== razorpay_order_id) {
        res.status(400);
        throw new Error('Payment verification failed: Order Mismatch');
    }

    // 5. IF signature invalid -> deny
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature !== razorpay_signature) {
        res.status(400);
        throw new Error('Invalid signature');
    }

    // 6. ELSE -> process payment
    // SECURITY: Atomically claim payment finalization so duplicate
    // verification requests cannot decrement stock more than once.
    const claim = await Order.updateOne(
        { _id: order._id, isPaid: false, paymentStatus: { $ne: 'PROCESSING' } },
        { $set: { paymentStatus: 'PROCESSING' } }
    );

    if (claim.modifiedCount !== 1) {
        const latestOrder = await Order.findById(order._id);
        if (latestOrder?.isPaid) {
            res.status(400);
            throw new Error('Order already paid');
        }
        res.status(409);
        throw new Error('Payment verification is already in progress');
    }

    // SECURITY: Commit inventory only after a verified payment.
    try {
        await decrementStockForPaidOrder(order);
    } catch (error) {
        order.paymentStatus = 'STOCK_FAILED';
        order.gatewayResponse = {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            stockError: error.message,
        };
        await order.save();
        throw error;
    }

    // PERSISTENCE & AUDIT
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentVerifiedAt = Date.now();
    order.paymentMethod = 'Razorpay';
    order.razorpayPaymentId = razorpay_payment_id;
    order.paymentStatus = 'SUCCESS';
    order.gatewayResponse = {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    };

    const updatedOrder = await order.save();
    res.json({ message: 'Payment success', order: updatedOrder });
};

// @desc    Update order status
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        const { status } = req.body;

        // SECURITY: Allow List Validation
        const validStatuses = ['Pending', 'Processed', 'Out for Delivery', 'Delivered', 'Cancelled'];
        if (status && !validStatuses.includes(status)) {
            res.status(400);
            throw new Error('Invalid status update');
        }

        order.status = status || order.status;

        if (order.status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Handle Razorpay Webhook
// @route   POST /api/orders/webhook
// @access  Public
const handleRazorpayWebhook = async (req, res) => {
    const signature = req.headers['x-razorpay-signature'];
    if (!signature) {
        return res.status(400).json({ message: 'Missing signature' });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
        console.error('RAZORPAY_WEBHOOK_SECRET is not configured');
        return res.status(500).json({ message: 'Webhook secret not configured' });
    }

    // Verify webhook signature using the captured raw body
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(req.rawBody || '')
        .digest('hex');

    if (expectedSignature !== signature) {
        return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    console.log(`[Razorpay Webhook] Event received: ${event}`);

    // We process 'order.paid' or 'payment.captured' events
    if (event === 'order.paid' || event === 'payment.captured') {
        const payload = req.body.payload;
        let razorpay_order_id;
        let razorpay_payment_id;

        if (event === 'order.paid' && payload.order?.entity) {
            razorpay_order_id = payload.order.entity.id;
            razorpay_payment_id = payload.payment?.entity?.id;
        } else if (event === 'payment.captured' && payload.payment?.entity) {
            razorpay_order_id = payload.payment.entity.order_id;
            razorpay_payment_id = payload.payment.entity.id;
        }

        if (!razorpay_order_id || !razorpay_payment_id) {
            return res.status(400).json({ message: 'Invalid payload structure' });
        }

        // Find the order by razorpayOrderId
        const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

        if (!order) {
            console.warn(`[Webhook Error] Order not found for Razorpay Order ID: ${razorpay_order_id}`);
            return res.status(404).json({ message: 'Order not found' });
        }

        // Idempotency: If already paid, return 200 OK immediately
        if (order.isPaid) {
            console.log(`[Webhook] Order ${order._id} is already marked as paid.`);
            return res.json({ message: 'Order already processed' });
        }

        // Atomically claim payment processing
        const claim = await Order.updateOne(
            { _id: order._id, isPaid: false, paymentStatus: { $ne: 'PROCESSING' } },
            { $set: { paymentStatus: 'PROCESSING' } }
        );

        if (claim.modifiedCount !== 1) {
            const latestOrder = await Order.findById(order._id);
            if (latestOrder?.isPaid) {
                return res.json({ message: 'Order already processed' });
            }
            return res.status(409).json({ message: 'Payment verification is already in progress' });
        }

        try {
            // Commit inventory stock decrements
            await decrementStockForPaidOrder(order);
        } catch (error) {
            console.error(`[Webhook Stock Error] for order ${order._id}:`, error.message);
            order.paymentStatus = 'STOCK_FAILED';
            order.gatewayResponse = {
                razorpay_order_id,
                razorpay_payment_id,
                webhook_signature: signature,
                stockError: error.message,
                via: 'webhook'
            };
            await order.save();
            return res.status(409).json({ message: error.message });
        }

        // Mark paid, audit and persist
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentVerifiedAt = Date.now();
        order.paymentMethod = 'Razorpay';
        order.razorpayPaymentId = razorpay_payment_id;
        order.paymentStatus = 'SUCCESS';
        order.gatewayResponse = {
            razorpay_order_id,
            razorpay_payment_id,
            webhook_signature: signature,
            via: 'webhook'
        };

        await order.save();
        console.log(`[Webhook Success] Order ${order._id} successfully marked as paid.`);
        return res.json({ message: 'Payment verified and captured via webhook', orderId: order._id });
    }

    // Acknowledge other events with 200 OK
    return res.json({ message: 'Event ignored' });
};

module.exports = {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    createRazorpayOrder,
    verifyPayment,
    updateOrderStatus,
    handleRazorpayWebhook,
};
