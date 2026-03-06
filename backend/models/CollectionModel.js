const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
        type: {
            type: String,
            enum: ['manual', 'automated'],
            default: 'manual',
            required: true,
        },
        bannerImage: {
            type: String, // URL from cloudinary or local
        },
        featuredProduct: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        // Only for automated collections
        rules: {
            tags: [String],
            priceRange: {
                min: { type: Number },
                max: { type: Number },
            },
            discountOnly: { type: Boolean, default: false },
            inStockOnly: { type: Boolean, default: false },
        },
        // Only for manual collections
        productIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        seo: {
            metaTitle: { type: String },
            metaDescription: { type: String },
        },
    },
    { timestamps: true }
);

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;
