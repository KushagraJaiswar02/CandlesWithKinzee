const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Log for debugging
            console.log('Verifying Token:', token.substring(0, 10) + '...');

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded ID:', decoded.id);

            // Exclude password from the user object
            req.user = await User.findById(decoded.id).select('-password');
            console.log('User Found:', req.user ? req.user.email : 'No User');

            if (!req.user) {
                console.log('User not found in DB for this token');
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error('Token Verification Failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        console.log('No Token Provided');
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        console.log('Admin Check Failed for:', req.user ? req.user.email : 'No User');
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
