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

router.route('/')
    .post(protect, validate(addOrderItemsSchema), addOrderItems)
    .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);
router.route('/pay/verify').post(protect, validate(verifyPaymentSchema), verifyPayment);
router.route('/pay/:id').post(protect, validate(mongoIdParamSchema, 'params'), createRazorpayOrder);
router.route('/:id/deliver').put(protect, admin, validate(mongoIdParamSchema, 'params'), validate(updateOrderStatusSchema), updateOrderStatus);

// Move parameterized route to the bottom
router.route('/:id').get(protect, validate(mongoIdParamSchema, 'params'), getOrderById);

module.exports = router;
