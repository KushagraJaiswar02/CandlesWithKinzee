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

router.route('/categories').get(getCategories);
router.route('/')
    .get(validate(productQuerySchema, 'query'), getProducts)
    .post(protect, admin, validate(createProductSchema), createProduct);
router.route('/history').get(protect, admin, getDeletedProducts);
router.route('/:id/reviews')
    .post(protect, validate(mongoIdParamSchema, 'params'), validate(createReviewSchema), createProductReview)
    .put(protect, validate(mongoIdParamSchema, 'params'), validate(updateReviewSchema), updateProductReview)
    .delete(protect, validate(mongoIdParamSchema, 'params'), deleteProductReview);
router.route('/:id')
    .get(validate(mongoIdParamSchema, 'params'), getProductById)
    .delete(protect, admin, validate(mongoIdParamSchema, 'params'), deleteProduct)
    .put(protect, admin, validate(mongoIdParamSchema, 'params'), validate(updateProductSchema), updateProduct);

module.exports = router;
