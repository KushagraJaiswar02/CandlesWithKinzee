// src/CartPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO.jsx';
import { useCart } from '../context/CartContext';
import { getValidImageUrl } from '../utils/imageHelper';

// Minimalist Cart Item
const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
    return (
        <motion.div
            className="flex flex-col sm:flex-row items-center gap-6 py-8 border-b border-neutral-100 last:border-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="w-full sm:w-24 h-32 bg-neutral-100 shrink-0">
                <img
                    src={getValidImageUrl(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x120/E5E5E5/A3A3A3?text=Candle" }}
                />
            </div>

            <div className="flex-1 w-full text-center sm:text-left">
                <div className="flex flex-col sm:flex-row justify-between items-start">
                    <div>
                        <h3 className="font-serif text-xl text-charcoal mb-1">{item.name}</h3>
                        {/* Assuming brand/scent is part of product, or just generic subtitle */}
                        <p className="text-sm text-brown/60 mb-4">{item.brand || 'Luxury Collection'}</p>
                    </div>
                    <p className="text-lg font-medium text-charcoal hidden sm:block">${(item.price * item.quantity).toFixed(2)}</p>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-6">
                    <div className="flex items-center border border-neutral-300">
                        <button
                            className="px-3 py-1 text-charcoal hover:bg-neutral-100 transition"
                            onClick={() => onUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
                        >-</button>
                        <span className="px-3 py-1 text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button
                            className="px-3 py-1 text-charcoal hover:bg-neutral-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                            disabled={item.quantity >= item.countInStock}
                        >+</button>
                    </div>

                    <button
                        onClick={() => onRemove(item._id)}
                        className="text-xs text-brown/50 uppercase tracking-wider hover:text-red-500 transition-colors border-b border-transparent hover:border-red-500 pb-0.5"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </motion.div>
    );
};


const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

    const subtotal = cartTotal;
    const shipping = subtotal > 50 ? 0 : 5.00;
    const total = subtotal + shipping;

    const pageVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            className="min-h-screen bg-white"
            variants={pageVariants}
            initial="initial"
            animate="animate"
        >
            <SEO title="Shopping Cart" description="Review your selected items." />

            <div className="container mx-auto px-4 py-16 md:py-24">
                <h1 className="text-4xl md:text-5xl font-serif text-center text-charcoal mb-16">
                    Shopping Cart
                </h1>

                <div className="flex flex-col lg:flex-row gap-16 max-w-6xl mx-auto">

                    {/* 1. Item List Area */}
                    <div className="lg:w-2/3">
                        {cartItems.length > 0 ? (
                            <div className="border-t border-neutral-200">
                                {cartItems.map(item => (
                                    <CartItem
                                        key={item._id}
                                        item={item}
                                        onRemove={removeFromCart}
                                        onUpdateQuantity={updateQuantity}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 border border-dashed border-neutral-300 bg-neutral-50">
                                <p className="text-xl font-serif text-charcoal mb-4">Your cart is empty.</p>
                                <Link to="/shop" className="text-sm font-bold uppercase tracking-widest border-b-2 border-charcoal pb-1 hover:text-primary hover:border-primary transition-colors">
                                    Continue Shopping
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* 2. Cart Summary (Clean Sticky) */}
                    <div className="lg:w-1/3">
                        <div className="bg-beige/30 p-8 sticky top-32">
                            <h2 className="font-serif text-2xl text-charcoal mb-8">Order Summary</h2>

                            <div className="space-y-4 mb-8 text-sm text-charcoal">
                                <div className="flex justify-between">
                                    <span className="text-brown/70">Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-brown/70">Shipping</span>
                                    <span>{shipping === 0 || cartItems.length === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="pt-4 border-t border-brown/10 flex justify-between items-end">
                                    <span className="font-bold uppercase tracking-wide">Total</span>
                                    <span className="text-2xl font-serif">${(cartItems.length === 0 ? 0 : total).toFixed(2)}</span>
                                </div>
                            </div>

                            <Link to="/checkout" className="block w-full">
                                <button
                                    disabled={cartItems.length === 0}
                                    className="w-full py-4 bg-charcoal text-white font-bold uppercase tracking-widest text-xs hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Proceed to Checkout
                                </button>
                            </Link>

                            <div className="mt-6 flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                                {/* Payment Icons Placeholders */}
                                <div className="w-8 h-5 bg-neutral-300 rounded"></div>
                                <div className="w-8 h-5 bg-neutral-300 rounded"></div>
                                <div className="w-8 h-5 bg-neutral-300 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartPage;