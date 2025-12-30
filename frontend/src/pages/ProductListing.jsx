// src/ProductListingPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard.jsx';
import SEO from '../components/SEO.jsx';

const ProductListingPage = () => {
    // Dummy Data for Product Display
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const [filterOpen, setFilterOpen] = useState(false);

    // Placeholder Icons for Filter and Close
    const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>;
    const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

    // --- Framer Motion Variants (Unchanged) ---
    const sidebarVariants = {
        hidden: { x: '-100%', opacity: 0, transition: { type: "tween" } },
        visible: { x: '0%', opacity: 1, transition: { type: "spring", stiffness: 100, damping: 20 } },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.07,
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const mainContentClass = filterOpen ? 'md:w-3/4' : 'w-full';


    return (
        <div className="bg-beige min-h-screen">
            <SEO
                title="Shop All Candles"
                description="Browse our wide selection of candles including aromatherapy, soy wax, pillar, and more."
                keywords="buy candles, shop candles, candle store, online candle shop"
            />
            <div className="container mx-auto px-4 py-8">

                <motion.h1
                    className="text-4xl font-extrabold text-brown mb-6 text-center md:text-left"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Our Candle Collection 🕯️
                </motion.h1>

                <div className="flex flex-col md:flex-row gap-6 relative">

                    <AnimatePresence>
                        {filterOpen && (
                            <motion.aside
                                className="w-full md:w-1/4 bg-white p-6 rounded-xl shadow-2xl border border-shadow/50 absolute md:relative top-0 left-0 h-full md:h-auto z-40"
                                variants={sidebarVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                            >

                                <div className="flex justify-between items-center mb-4 border-b pb-3 border-shadow/50">
                                    <h2 className="text-xl font-bold text-charcoal">Filter Options</h2>
                                    <button
                                        className="p-1 text-brown hover:text-flame transition"
                                        onClick={() => setFilterOpen(false)}
                                        title="Close Filters"
                                    >
                                        <XIcon />
                                    </button>
                                </div>

                                {/* Filter content (unchanged) */}
                                <div className="mb-6 pb-4 border-b border-shadow">
                                    <h3 className="font-semibold text-brown mb-2">Price Range</h3>
                                    <input type="range" min="10" max="50" className="w-full h-2 bg-beige rounded-lg appearance-none cursor-pointer range-lg accent-flame" />
                                    <div className="flex justify-between text-sm text-shadow mt-1"><span>$10</span><span>$50</span></div>
                                </div>

                                <div className="mb-6 pb-4 border-b border-shadow">
                                    <h3 className="font-semibold text-brown mb-2">Candle Type</h3>
                                    {['Soy Wax', 'Aromatherapy', 'Pillar', 'Votive', 'Seasonal'].map(type => (
                                        <label key={type} className="flex items-center text-charcoal text-sm mt-2 cursor-pointer hover:text-flame">
                                            <input type="checkbox" className="mr-2 rounded text-primary focus:ring-primary border-shadow" />
                                            {type}
                                        </label>
                                    ))}
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-semibold text-brown mb-2">Customer Rating</h3>
                                    <label className="flex items-center text-charcoal text-sm mt-2 cursor-pointer hover:text-flame">
                                        <input type="radio" name="rating" className="mr-2 text-primary focus:ring-primary border-shadow" />
                                        4 Stars & Up
                                    </label>
                                    <label className="flex items-center text-charcoal text-sm mt-2 cursor-pointer hover:text-flame">
                                        <input type="radio" name="rating" className="mr-2 text-primary focus:ring-primary border-shadow" />
                                        3 Stars & Up
                                    </label>
                                </div>

                                <button className="w-full mt-4 py-2 bg-flame text-white font-semibold rounded-lg hover:bg-brown transition">
                                    Apply Filters
                                </button>
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* Product Grid Area */}
                    <main className={mainContentClass}>
                        <div className="flex justify-between items-center bg-white p-3 mb-4 rounded-lg shadow-sm border border-shadow/50">

                            {!filterOpen && (
                                <button
                                    className="flex items-center py-2 px-4 bg-primary text-charcoal rounded-lg font-medium hover:bg-flame hover:text-white transition"
                                    onClick={() => setFilterOpen(true)}
                                >
                                    <FilterIcon /> <span className="ml-2">Filter</span>
                                </button>
                            )}

                            <h3 className="text-charcoal font-medium">
                                Showing {products.length} Results
                            </h3>

                            <div className="flex items-center space-x-2">
                                <label htmlFor="sort" className="text-charcoal text-sm hidden sm:block">Sort By:</label>
                                <select id="sort" className="p-2 border border-shadow rounded-lg bg-white text-charcoal text-sm focus:ring-primary focus:border-primary">
                                    <option>Popularity</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Newest Arrivals</option>
                                </select>
                            </div>
                        </div>

                        {/* PRODUCT GRID CHANGE: Reverted to a less dense grid for medium-sized cards */}
                        <motion.div
                            // Mobile/Small: 2 columns
                            // Medium: 3 columns (regardless of filter state)
                            // Large (Filter Open): 3 columns
                            // Large (Filter Closed): 4 columns max
                            className={`grid grid-cols-2 md:grid-cols-3 ${filterOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4 sm:gap-6`}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {products.map(product => (
                                <motion.div key={product._id} variants={itemVariants}>
                                    <Link to={`/product/${product._id}`}>
                                        <ProductCard product={product} />
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductListingPage;