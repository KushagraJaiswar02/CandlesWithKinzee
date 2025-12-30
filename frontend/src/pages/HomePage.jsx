// src/HomePage.jsx

import React from 'react';
import { motion } from 'framer-motion';
// FIX: Change '../components/...' back to './components/...'
import SEO from '../components/SEO.jsx';
import HeroSection from '../components/HeroSection.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { Link } from 'react-router-dom';

const HomePage = () => {
    // Dummy Data for featured products (replace with actual data fetching later)
    const featuredProducts = [
        { id: 'p1', name: 'Warm Vanilla Glow', price: 19.99, image: 'vanilla.jpg' },
        { id: 'p2', name: 'Sandalwood Serenity', price: 24.50, image: 'sandalwood.jpg' },
        { id: 'p3', name: 'Fresh Linen Breeze', price: 17.00, image: 'linen.jpg' },
        { id: 'p4', name: 'Midnight Musk', price: 29.99, image: 'musk.jpg' },
    ];

    // Dummy Data for candle types/categories
    const candleTypes = [
        { name: 'Aromatherapy', icon: '🧘', link: '/shop?category=aromatherapy' },
        { name: 'Soy Wax', icon: '🌱', link: '/shop?type=soy' },
        { name: 'Pillar Candles', icon: '🗼', link: '/shop?type=pillar' },
        { name: 'Scented Votives', icon: '🌸', link: '/shop?type=votives' },
        { name: 'Seasonal', icon: '🍂', link: '/shop?category=seasonal' },
    ];

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="bg-beige min-h-screen">
            <SEO
                title="Home"
                description="Welcome to CandlesWithKinzee, your premier destination for handcrafted, soy wax, and aromatherapy candles. Light up your life with our premium collection."
                keywords="candles, handcrafted candles, soy wax, aromatherapy, home decor, CandlesWithKinzee"
            />

            {/* 1. Hero Section (Assumes content is in components/HeroSection.jsx) */}
            <HeroSection />

            {/* NEW SECTION: Famous Candle Types Available (Category/Recommendation) */}
            <section className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl font-bold text-brown text-center mb-8">
                        Shop by Candle Type & Mood 🔍
                    </h2>
                </motion.div>

                <motion.div
                    className="flex flex-wrap justify-center gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {candleTypes.map((type, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Link
                                to={type.link}
                                className="flex flex-col items-center p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-b-4 border-primary hover:border-flame w-32 text-center transform hover:-translate-y-1"
                            >
                                <span className="text-4xl block mb-2">{type.icon}</span>
                                <span className="text-sm font-semibold text-charcoal">{type.name}</span>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
                <div className="text-center mt-6">
                    <p className="text-shadow text-sm">Use these categories for better searching and filtering!</p>
                </div>
            </section>

            {/* Horizontal Divider for Separation */}
            <hr className="border-t-2 border-shadow/50 mx-auto max-w-5xl" />

            {/* 2. Featured Products Section */}
            <section className="container mx-auto px-4 py-12">
                <motion.h2
                    className="text-4xl font-extrabold text-brown text-center mb-10 border-b-2 border-primary/50 pb-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Our Best Sellers 🔥
                </motion.h2>

                {/* Product Grid: Inspired by Flipkart UI for clean layout */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {featuredProducts.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                            <Link to={`/product/${product.id}`}>
                                <ProductCard product={product} />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action Button */}
                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link to="/shop" className="inline-block py-3 px-8 text-lg font-semibold bg-flame text-white rounded-full hover:bg-primary hover:text-charcoal transition duration-300 shadow-xl transform hover:scale-105">
                        Explore All Candles
                    </Link>
                </motion.div>
            </section>

            {/* 3. Value Proposition Section (Aesthetic UI & Smooth Experience) */}
            <section className="bg-primary/30 py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-brown text-center mb-8">
                        Why Choose CandlesWithKinzee?
                    </h2>
                    <motion.div
                        className="grid md:grid-cols-3 gap-8 text-center"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.div variants={itemVariants} className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-flame hover:shadow-2xl transition duration-300">
                            <span className="text-4xl block mb-3">✨</span>
                            <h3 className="text-xl font-semibold text-charcoal mb-2">Handcrafted Quality</h3>
                            <p className="text-shadow">Every candle is poured with love and care.</p>
                        </motion.div>
                        <motion.div variants={itemVariants} className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-flame hover:shadow-2xl transition duration-300">
                            <span className="text-4xl block mb-3">🔒</span>
                            <h3 className="text-xl font-semibold text-charcoal mb-2">Secure Transactions</h3>
                            [cite_start]<p className="text-shadow">Payment encryption and secure checkout guaranteed[cite: 9, 12, 37].</p>
                        </motion.div>
                        <motion.div variants={itemVariants} className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-flame hover:shadow-2xl transition duration-300">
                            <span className="text-4xl block mb-3">🚚</span>
                            <h3 className="text-xl font-semibold text-charcoal mb-2">Fast & Reliable</h3>
                            [cite_start]<p className="text-shadow">Built to be fast and mobile-friendly[cite: 7, 24].</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;