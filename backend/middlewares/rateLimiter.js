const rateLimit = require('express-rate-limit');

/**
 * Strict limiter for auth endpoints (login, register).
 * Prevents brute-force and credential stuffing attacks.
 * 10 attempts per IP per 15 minutes.
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { message: 'Too many attempts, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * General API limiter for product/admin browsing endpoints.
 * 100 requests per IP per 15 minutes.
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests, please slow down.' },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Order limiter — prevents order spam / payment abuse.
 * 20 order actions per IP per 15 minutes.
 */
const orderLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: 'Too many order requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter, orderLimiter };
