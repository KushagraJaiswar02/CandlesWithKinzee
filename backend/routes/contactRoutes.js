const express = require('express');
const router = express.Router();
const { getContactConfig, updateContactConfig } = require('../controllers/contactController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getContactConfig)
    .put(protect, admin, updateContactConfig);

module.exports = router;
