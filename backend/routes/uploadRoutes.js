const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();

const { storage } = require('../config/cloudinary');
const { apiLimiter } = require('../middlewares/rateLimiter');

const upload = multer({ storage });

// POST /api/upload
// FIX: res.json() sets Content-Type: application/json — prevents reflected XSS
// that res.send(string) causes by defaulting to text/html
router.post('/', apiLimiter, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    // Return as JSON — never interpreted as HTML by the browser
    res.status(200).json({ url: req.file.path });
});

module.exports = router;

