// src/CheckoutPage.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';

// Placeholder Icons
const LockIcon = () => '🔒'; // For security
const LocationIcon = () => '📍'; // For shipping/location
const PaymentIcon = () => '💳'; // For payment

const CheckoutPage = () => {
    // Simple state to simulate checkout steps
    const [currentStep, setCurrentStep] = useState(1);

    // Dummy Order Summary Data (Ideally passed from CartPage or Context API)
    const subtotal = 36.99;
    const shipping = 5.00;
    const taxes = subtotal * 0.08;
    const total = subtotal + shipping + taxes;

    // Framer Motion variant for page entry
    const pageVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    const StepIndicator = ({ step, label }) => (
        <div className={`flex flex-col items-center w-1/3 ${step <= currentStep ? 'text-flame' : 'text-shadow'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${step <= currentStep ? 'bg-flame text-white' : 'bg-beige border border-shadow'}`}>
                {step}
            </div>
            <span className="text-sm font-medium hidden sm:block">{label}</span>
        </div>
    );

    const ShippingForm = () => (
        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-4">
            <h2 className="text-2xl font-bold text-brown flex items-center space-x-2">{LocationIcon()} <span>Shipping Address</span></h2>
            [cite_start]<p className="text-charcoal/70 text-sm">Location tracking helps with shipping estimation and address autofill[cite: 13].</p>

            <input type="text" placeholder="Full Name" className="w-full p-3 border border-shadow rounded-lg focus:ring-primary focus:border-primary" />
            <input type="text" placeholder="Address Line 1" className="w-full p-3 border border-shadow rounded-lg focus:ring-primary focus:border-primary" />
            <input type="text" placeholder="City" className="w-full p-3 border border-shadow rounded-lg focus:ring-primary focus:border-primary" />
            <div className="flex space-x-4">
                <input type="text" placeholder="Zip/Postal Code" className="w-1/2 p-3 border border-shadow rounded-lg focus:ring-primary focus:border-primary" />
                <input type="text" placeholder="Country" className="w-1/2 p-3 border border-shadow rounded-lg focus:ring-primary focus:border-primary" />
            </div>

            <motion.button
                className="w-full py-3 bg-primary text-charcoal font-bold rounded-lg hover:bg-flame hover:text-white transition"
                onClick={() => setCurrentStep(2)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                Continue to Payment
            </motion.button>
        </motion.div>
    );

    const PaymentForm = () => (
        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-4">
            <h2 className="text-2xl font-bold text-brown flex items-center space-x-2">{PaymentIcon()} <span>Payment Method</span></h2>
            [cite_start]<p className="text-charcoal/70 text-sm">Secure online transactions with payment gateway integration (Razorpay / Stripe)[cite: 9, 14, 18].</p>

            {/* Simulated Payment Gateway Form */}
            <div className="p-6 bg-beige rounded-lg border border-shadow space-y-4">
                <p className="text-sm text-charcoal flex items-center">
                    [cite_start]{LockIcon()} **Security is key.** User data is secured via payment encryption[cite: 37].
                </p>
                <input type="text" placeholder="Card Number" className="w-full p-3 border border-shadow rounded-lg focus:ring-primary focus:border-primary" />
                <div className="flex space-x-4">
                    <input type="text" placeholder="MM/YY" className="w-1/3 p-3 border border-shadow rounded-lg focus:ring-primary focus:border-primary" />
                    <input type="text" placeholder="CVC" className="w-1/3 p-3 border border-shadow rounded-lg focus:ring-primary focus:border-primary" />
                </div>
            </div>

            <div className="flex space-x-4">
                <button
                    className="w-1/3 py-3 border border-brown text-brown font-bold rounded-lg hover:bg-beige transition"
                    onClick={() => setCurrentStep(1)}
                >
                    &larr; Back to Shipping
                </button>
                <motion.button
                    className="w-2/3 py-3 bg-flame text-white font-bold rounded-lg hover:bg-brown transition"
                    onClick={() => setCurrentStep(3)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    Review Order
                </motion.button>
            </div>
        </motion.div>
    );

    const ReviewOrder = () => (
        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-brown">Review & Place Order</h2>
            [cite_start]<p className="text-charcoal/70 text-sm">Final check before placing your order. Security is Flipkart-like secure checkout and encryption for user data[cite: 13].</p>

            {/* Review Sections */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-beige rounded-lg border border-shadow/50">
                    <h3 className="font-semibold text-brown mb-2">Shipping Details</h3>
                    <p className="text-sm text-charcoal">Jane Doe</p>
                    <p className="text-sm text-charcoal">123 Candlelight Lane, Cityville</p>
                    <button className="text-flame text-xs mt-1 hover:underline" onClick={() => setCurrentStep(1)}>Edit</button>
                </div>
                <div className="p-4 bg-beige rounded-lg border border-shadow/50">
                    <h3 className="font-semibold text-brown mb-2">Payment Details</h3>
                    <p className="text-sm text-charcoal">Card ending in **** 4242</p>
                    <button className="text-flame text-xs mt-1 hover:underline" onClick={() => setCurrentStep(2)}>Edit</button>
                </div>
            </div>

            {/* Final Place Order Button */}
            <motion.button
                className="w-full py-4 bg-flame text-white font-extrabold text-xl rounded-lg shadow-xl hover:bg-brown transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => alert("Order Placed! Thank you.")}
            >
                Place Order (${total.toFixed(2)})
            </motion.button>

        </motion.div>
    );


    const renderFormContent = () => {
        switch (currentStep) {
            case 1: return <ShippingForm />;
            case 2: return <PaymentForm />;
            case 3: return <ReviewOrder />;
            default: return <ShippingForm />;
        }
    };


    return (
        <motion.div
            className="min-h-screen bg-beige p-4 md:p-12"
            variants={pageVariants}
            initial="initial"
            animate="animate"
        >
            <SEO title="Secure Checkout" description="Complete your purchase securely." robots="noindex, nofollow" />
            <div className="container mx-auto">
                <Link to="/cart" className="flex items-center text-brown hover:text-flame mb-4 text-sm font-medium transition">
                    &larr; Back to Cart
                </Link>

                <h1 className="text-4xl font-extrabold text-brown mb-8 text-center md:text-left flex items-center space-x-3">
                    {LockIcon()} <span>Secure Checkout</span>
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* 1. Main Form Area */}
                    <div className="lg:w-3/5 bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-shadow/50">

                        {/* Step Indicator */}
                        <div className="flex justify-between mb-8 pb-4 border-b border-shadow/50">
                            <StepIndicator step={1} label="Shipping" />
                            <StepIndicator step={2} label="Payment" />
                            <StepIndicator step={3} label="Review" />
                        </div>

                        {/* Form Content (Animated) */}
                        <div key={currentStep}>
                            {renderFormContent()}
                        </div>
                    </div>

                    {/* 2. Order Summary Sidebar */}
                    <div className="lg:w-2/5 h-fit">
                        <div className="bg-white p-6 rounded-xl shadow-xl border border-shadow/50 sticky top-24">
                            <h2 className="text-2xl font-bold text-brown mb-4 border-b pb-3 border-shadow/50">Order Summary</h2>

                            <div className="space-y-3 text-charcoal">
                                <div className="flex justify-between">
                                    <span className="text-md">Subtotal:</span>
                                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-md">Shipping:</span>
                                    <span className="font-semibold text-primary">${shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-b border-shadow/50 pb-3">
                                    <span className="text-md">Taxes (8%):</span>
                                    <span className="font-semibold">${taxes.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between pt-3">
                                    <span className="text-2xl font-extrabold text-charcoal">Order Total:</span>
                                    <span className="text-2xl font-extrabold text-flame">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CheckoutPage;