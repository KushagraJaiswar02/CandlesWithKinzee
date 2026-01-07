const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();

const { storage } = require('../config/cloudinary');

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    // Cloudinary handles file types, but good to double check or rely on allowed_formats in config
});

router.post('/', upload.single('image'), (req, res) => {
    // Return absolute Cloudinary URL directly as string
    res.send(req.file.path);
});

module.exports = router;
