const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/stats', protect, admin, getAdminStats);

module.exports = router;
