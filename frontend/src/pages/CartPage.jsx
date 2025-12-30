// src/CartPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO.jsx';

// Placeholder for Trash Icon
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);

// Placeholder Cart Item Component
const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
    return (
        <motion.div
            className="flex items-center justify-between p-4 mb-4 bg-beige rounded-lg shadow-sm border border-shadow/50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center space-x-4">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md border border-shadow"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64/8B5E3C/FFF7E6?text=C" }}
                />
                <div className="text-charcoal">
                    <h3 className="font-semibold text-brown">{item.name}</h3>
                    <p className="text-sm">${item.price.toFixed(2)}</p>
                </div>
            </div>

            <div className="flex items-center space-x-6">
                {/* Quantity Control */}
                <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    className="w-16 p-2 border border-shadow rounded-lg text-center text-charcoal focus:ring-flame focus:border-flame"
                    onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                />

                {/* Total Price for Item */}
                <p className="text-lg font-bold text-flame hidden sm:block">
                    ${(item.price * item.quantity).toFixed(2)}
                </p>

                {/* Remove Button */}
                <motion.button
                    className="p-2 text-charcoal hover:text-brown transition duration-200"
                    onClick={() => onRemove(item.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Remove Item"
                >
                    <TrashIcon />
                </motion.button>
            </div>
        </motion.div>
    );
};


const CartPage = () => {
    const [cartItems, setCartItems] = useState([
        { id: 'p1', name: 'Warm Vanilla Glow', price: 19.99, quantity: 2, image: 'https://res.cloudinary.com/demo/image/fetch/w_64,h_64,c_fill/vanilla.jpg' },
        { id: 'p3', name: 'Fresh Linen Breeze', price: 17.00, quantity: 1, image: 'https://res.cloudinary.com/demo/image/fetch/w_64,h_64,c_fill/linen.jpg' },
    ]);

    const handleRemove = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const handleUpdateQuantity = (id, newQuantity) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 50 ? 0 : 5.00; // Free shipping over $50
    const total = subtotal + shipping;

    // Framer Motion variant for page entry
    const pageVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.5 } }
    };


    return (
        <motion.div
            className="min-h-screen bg-beige p-4 md:p-12"
            variants={pageVariants}
            initial="initial"
            animate="animate"
        >
            <SEO title="Shopping Cart" description="Review your selected items and proceed to checkout." />
            <div className="container mx-auto">
                <h1 className="text-4xl font-extrabold text-brown mb-8 text-center md:text-left">
                    Your Shopping Cart 🛒
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* 1. Item List Area */}
                    <div className="lg:w-2/3">
                        <motion.div
                            className="bg-white p-6 rounded-xl shadow-xl border border-shadow/50"
                            layout
                        >
                            {cartItems.length > 0 ? (
                                cartItems.map(item => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onRemove={handleRemove}
                                        onUpdateQuantity={handleUpdateQuantity}
                                    />
                                ))
                            ) : (
                                <div className="text-center p-12 text-charcoal">
                                    <p className="text-xl font-semibold mb-4">Your cart is empty.</p>
                                    <Link to="/shop" className="text-flame hover:underline font-medium">
                                        Start shopping now!
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* 2. Cart Summary/Checkout Area (Sticky on Desktop) */}
                    <div className="lg:w-1/3">
                        <div className="bg-white p-6 rounded-xl shadow-xl border border-shadow/50 sticky top-24">
                            <h2 className="text-2xl font-bold text-brown mb-4 border-b pb-3 border-shadow/50">Order Summary</h2>

                            <div className="space-y-3 text-charcoal">
                                <div className="flex justify-between">
                                    <span className="text-md">Subtotal:</span>
                                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-b border-shadow/50 pb-3">
                                    <span className="text-md">Shipping:</span>
                                    <span className="font-semibold text-primary">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                </div>

                                <div className="flex justify-between pt-3">
                                    <span className="text-2xl font-extrabold text-charcoal">Total Cost:</span>
                                    <span className="text-2xl font-extrabold text-flame">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Link to="/checkout">
                                    <button
                                        disabled={cartItems.length === 0}
                                        className="w-full mt-6 py-3 bg-primary text-charcoal font-bold text-lg rounded-lg shadow-xl hover:bg-flame hover:text-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </Link>
                            </motion.div>

                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartPage;