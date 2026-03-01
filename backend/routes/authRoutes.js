const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema, updateProfileSchema } = require('../validators/authValidator');

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, validate(updateProfileSchema), updateUserProfile);

module.exports = router;
