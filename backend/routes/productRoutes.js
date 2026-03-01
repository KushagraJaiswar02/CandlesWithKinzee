const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    getDeletedProducts,
    getCategories,
    createProductReview,
    updateProductReview,
    deleteProductReview
} = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const {
    productQuerySchema,
    createProductSchema,
    updateProductSchema,
    createReviewSchema,
    updateReviewSchema,
} = require('../validators/productValidator');
const { mongoIdParamSchema } = require('../validators/commonValidator');
const { apiLimiter } = require('../middlewares/rateLimiter');

router.route('/categories').get(apiLimiter, getCategories);
router.route('/')
    .get(apiLimiter, validate(productQuerySchema, 'query'), getProducts)
    .post(protect, admin, apiLimiter, validate(createProductSchema), createProduct);
router.route('/history').get(protect, admin, apiLimiter, getDeletedProducts);
router.route('/:id/reviews')
    .post(protect, apiLimiter, validate(mongoIdParamSchema, 'params'), validate(createReviewSchema), createProductReview)
    .put(protect, apiLimiter, validate(mongoIdParamSchema, 'params'), validate(updateReviewSchema), updateProductReview)
    .delete(protect, apiLimiter, validate(mongoIdParamSchema, 'params'), deleteProductReview);
router.route('/:id')
    .get(apiLimiter, validate(mongoIdParamSchema, 'params'), getProductById)
    .delete(protect, admin, apiLimiter, validate(mongoIdParamSchema, 'params'), deleteProduct)
    .put(protect, admin, apiLimiter, validate(mongoIdParamSchema, 'params'), validate(updateProductSchema), updateProduct);

module.exports = router;
