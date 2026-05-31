const mongoose = require('mongoose');
const Product = require('../models/ProductModel');

const SHIPPING_PRICE_PAISE = 5000;
const TAX_PRICE_PAISE = 0;
const DISCOUNT_AMOUNT_PAISE = 0;
const MAX_QUANTITY_PER_PRODUCT = 100;
const MAX_ORDER_TOTAL_PAISE = 100000000;

const toPaise = (amount) => Math.round(Number(amount) * 100);
const fromPaise = (paise) => Number((paise / 100).toFixed(2));

const calculateOrderPricing = async (orderItems) => {
    const quantitiesByProductId = new Map();

    for (const item of orderItems) {
        const productId = String(item.product);
        const quantity = Number(item.quantity);

        if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_PRODUCT) {
            const error = new Error('Invalid product quantity');
            error.statusCode = 400;
            throw error;
        }

        quantitiesByProductId.set(productId, (quantitiesByProductId.get(productId) || 0) + quantity);
    }

    const productIds = [...quantitiesByProductId.keys()].map((id) => new mongoose.Types.ObjectId(id));
    const products = await Product.find({ _id: { $in: productIds }, isDeleted: false });
    const productsById = new Map(products.map((product) => [product._id.toString(), product]));

    const pricedItems = [];
    let itemsPricePaise = 0;

    for (const [productId, quantity] of quantitiesByProductId.entries()) {
        const product = productsById.get(productId);

        if (!product) {
            const error = new Error(`Product not found: ${productId}`);
            error.statusCode = 404;
            throw error;
        }

        if (product.countInStock < quantity) {
            const error = new Error(`Insufficient stock for ${product.name}`);
            error.statusCode = 400;
            throw error;
        }

        const unitPricePaise = toPaise(product.price);
        const lineTotalPaise = unitPricePaise * quantity;

        if (!Number.isSafeInteger(lineTotalPaise)) {
            const error = new Error('Order amount is too large');
            error.statusCode = 400;
            throw error;
        }

        itemsPricePaise += lineTotalPaise;
        pricedItems.push({
            name: product.name,
            quantity,
            image: product.image || '',
            price: fromPaise(unitPricePaise),
            product: product._id,
        });
    }

    const totalPricePaise = itemsPricePaise + SHIPPING_PRICE_PAISE + TAX_PRICE_PAISE - DISCOUNT_AMOUNT_PAISE;

    if (!Number.isSafeInteger(totalPricePaise) || totalPricePaise <= 0 || totalPricePaise > MAX_ORDER_TOTAL_PAISE) {
        const error = new Error('Invalid order total');
        error.statusCode = 400;
        throw error;
    }

    return {
        orderItems: pricedItems,
        totals: {
            itemsPrice: fromPaise(itemsPricePaise),
            taxPrice: fromPaise(TAX_PRICE_PAISE),
            shippingPrice: fromPaise(SHIPPING_PRICE_PAISE),
            discountAmount: fromPaise(DISCOUNT_AMOUNT_PAISE),
            totalPrice: fromPaise(totalPricePaise),
            totalPricePaise,
        },
    };
};

module.exports = {
    calculateOrderPricing,
};
