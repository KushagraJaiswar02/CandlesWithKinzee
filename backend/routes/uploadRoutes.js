const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

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
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/', upload.single('image'), (req, res) => {
    // Normalize path separators to forward slashes for URL compatibility
    const normalizedPath = req.file.path.replace(/\\/g, '/');
    // Return relative path (e.g., /uploads/image.jpg) so frontend can use proxy or base URL
    // Ensure we strip 'backend/' if it somehow got in there, or just ensure it starts with /uploads
    const relativePath = normalizedPath.startsWith('uploads/') ? `/${normalizedPath}` : `/uploads/${path.basename(normalizedPath)}`;

    res.json({ image: relativePath });
});

module.exports = router;
