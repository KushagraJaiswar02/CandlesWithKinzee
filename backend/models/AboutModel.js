const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    hero: {
        title: { type: String, default: 'Crafting Light, Warmth, and Memories' },
        subtitle: { type: String, default: 'Discover premium, small-batch soy candles designed to elevate your everyday moments.' },
        image: { type: String, default: '' },
        ctaText: { type: String, default: 'Explore Our Collection' },
        ctaLink: { type: String, default: '/shop' }
    },
    story: {
        title: { type: String, default: 'Our Story' },
        content: { type: String, default: 'We started with a simple vision to create moments of warmth and connection...' },
        image: { type: String, default: '' }
    },
    craftFeatures: [{
        title: { type: String },
        description: { type: String },
        icon: { type: String }
    }],
    values: [{
        title: { type: String },
        description: { type: String },
        icon: { type: String }
    }],
    founder: {
        name: { type: String, default: '' },
        image: { type: String, default: '' },
        description: { type: String, default: '' }
    },
    socialLinks: {
        instagram: { type: String, default: '' },
        facebook: { type: String, default: '' },
        pinterest: { type: String, default: '' },
        twitter: { type: String, default: '' },
        youtube: { type: String, default: '' },
        whatsapp: { type: String, default: '' }
    },
    ctaSection: {
        title: { type: String, default: 'Bring warmth and fragrance to your home.' },
        buttonText: { type: String, default: 'Shop Our Candles' },
        buttonLink: { type: String, default: '/shop' }
    }
}, { timestamps: true });

const About = mongoose.model('About', aboutSchema);
module.exports = About;
