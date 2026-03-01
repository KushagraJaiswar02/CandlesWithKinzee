const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema, updateProfileSchema } = require('../validators/authValidator');
const { authLimiter, apiLimiter } = require('../middlewares/rateLimiter');

router.post('/register', authLimiter, validate(registerSchema), registerUser);
router.post('/login', authLimiter, validate(loginSchema), loginUser);
router.route('/profile')
    .get(protect, apiLimiter, getUserProfile)
    .put(protect, apiLimiter, validate(updateProfileSchema), updateUserProfile);

module.exports = router;
