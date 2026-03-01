const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    createRazorpayOrder,
    verifyPayment,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const {
    addOrderItemsSchema,
    verifyPaymentSchema,
    updateOrderStatusSchema,
} = require('../validators/orderValidator');
const { mongoIdParamSchema } = require('../validators/commonValidator');
const { orderLimiter, apiLimiter } = require('../middlewares/rateLimiter');

router.route('/')
    .post(protect, orderLimiter, validate(addOrderItemsSchema), addOrderItems)
    .get(protect, admin, apiLimiter, getOrders);

router.route('/myorders').get(protect, apiLimiter, getMyOrders);
router.route('/pay/verify').post(protect, orderLimiter, validate(verifyPaymentSchema), verifyPayment);
router.route('/pay/:id').post(protect, orderLimiter, validate(mongoIdParamSchema, 'params'), createRazorpayOrder);
router.route('/:id/deliver').put(protect, admin, apiLimiter, validate(mongoIdParamSchema, 'params'), validate(updateOrderStatusSchema), updateOrderStatus);

// Move parameterized route to the bottom
router.route('/:id').get(protect, apiLimiter, validate(mongoIdParamSchema, 'params'), getOrderById);

module.exports = router;
