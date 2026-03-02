const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const REQUIRED_ENV_VARS = [
    'MONGO_URI',
    'JWT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
];

const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
    console.error('\n❌  Missing required environment variables:');
    missingVars.forEach((key) => console.error(`    • ${key}`));
    console.error('\nAdd them to your .env file and restart the server.\n');
    process.exit(1);
}


// Connect to database
connectDB();

const app = express();

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Middleware
app.use(express.json()); // Body parser



// List all allowed origins here
const allowedOrigins = [
    'https://candles-with-kinzee.vercel.app',
    'http://localhost:5173',                  
    /\.vercel\.app$/                          
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.some((allowed) => {
            if (allowed instanceof RegExp) {
                return allowed.test(origin); // Test origin against regex
            }
            return allowed === origin; // Compare strings directly
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Blocked by CORS policy'));
        }
    },
    credentials: true, // Required for sending cookies or auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow necessary methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Explicitly handle preflight OPTIONS requests for all routes
app.options('/*path', cors(corsOptions));


const { apiLimiter } = require('./middlewares/rateLimiter');
app.use('/api', apiLimiter);

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
