const express = require('express');
const router = express.Router();
const {
    createCollection,
    getCollections,
    getAdminCollections,
    getCollectionBySlug,
    updateCollection,
    deleteCollection,
} = require('../controllers/collectionController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/').post(protect, admin, createCollection).get(getCollections);
router.route('/admin').get(protect, admin, getAdminCollections);
router.route('/:slug').get(getCollectionBySlug);
router.route('/:id').put(protect, admin, updateCollection).delete(protect, admin, deleteCollection);

module.exports = router;
