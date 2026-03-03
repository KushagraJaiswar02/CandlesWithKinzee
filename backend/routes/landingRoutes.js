const express = require('express');
const router = express.Router();
const { getLandingConfig, updateLandingConfig } = require('../controllers/landingController');
const { protect, admin } = require('../middlewares/authMiddleware');

// GET  /api/landing-config  — public (storefront reads it)
router.get('/', getLandingConfig);

// PUT  /api/landing-config  — admin only
router.put('/', protect, admin, updateLandingConfig);

module.exports = router;
