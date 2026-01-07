const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Body parser

// CORS Configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*', // Default to allow all in development if not set
    credentials: true,
};
app.use(cors(corsOptions));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

const uploadsPath = path.join(__dirname, '/uploads');
app.use('/uploads', express.static(uploadsPath));

const fs = require('fs');

// Error Handling Middleware
app.use((err, req, res, next) => {
    const errorLog = `[${new Date().toISOString()}] ${err.stack}\n`;
    fs.appendFile(path.join(__dirname, 'error.log'), errorLog, (fileErr) => {
        if (fileErr) console.error('Failed to write to error log:', fileErr);
    });

    console.error('🔥 Server Error:', err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} - WITH UPLOAD SUPPORT`);
});
