const express = require('express');
const router = express.Router();
const { getAboutConfig, updateAboutConfig } = require('../controllers/aboutController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getAboutConfig)
    .put(protect, admin, updateAboutConfig);

module.exports = router;
