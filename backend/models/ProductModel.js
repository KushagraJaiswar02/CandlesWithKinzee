const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    image: { type: String, required: false }, // URL to image
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isDeleted: { type: Boolean, required: true, default: false }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

productSchema.virtual('isOutOfStock').get(function () {
    return this.countInStock === 0;
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
