const mongoose = require('mongoose');

const landingConfigSchema = new mongoose.Schema(
    {
        heroTitle: { type: String, default: 'CANDLES WITH KINZEE' },
        heroSubtitle: { type: String, default: 'Hand-poured perfection for your sacred spaces.' },
        heroImage: { type: String, default: '' },
        festiveModeActive: { type: Boolean, default: false },
        discountBannerActive: { type: Boolean, default: true },
        discountBannerText: { type: String, default: 'FREE SHIPPING ON ORDERS OVER ₹999' },
        featuredCollection: { type: String, default: 'Aromatherapy' },
    },
    { timestamps: true }
);

// Only ever one document — use singleton pattern
const LandingConfig = mongoose.model('LandingConfig', landingConfigSchema);

module.exports = LandingConfig;
