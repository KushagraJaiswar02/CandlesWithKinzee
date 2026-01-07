// src/ProductListingPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard.jsx';
import SEO from '../components/SEO.jsx';
import API_BASE_URL from '../config/api';

const ProductListingPage = () => {
    // Dummy Data for Product Display
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/products`);
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

    const [filterOpen, setFilterOpen] = useState(true);

    // Placeholder Icons for Filter and Close
    const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>;
    const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

    // --- Framer Motion Variants ---
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

    return (
        <div className="bg-white min-h-screen">
            <SEO
                title="Shop All Candles"
                description="Browse our wide selection of candles including aromatherapy, soy wax, pillar, and more."
                keywords="buy candles, shop candles, candle store, online candle shop"
            />

            {/* 1. Collection Hero (Slightly shorter padding) */}
            <div className="bg-beige pt-32 pb-12 md:pt-40 md:pb-16 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Hand-Poured in small batches</p>
                    <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-4">The Collection</h1>
                    <p className="text-brown/70 max-w-lg mx-auto font-light">
                        Discover scents designed to elevate your sanctuary. 100% soy wax, clean burning, and sustainably crafted.
                    </p>
                </motion.div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-12">

                {/* 2. Top Toolbar: Toggle Filter & Sort (Desktop) */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-neutral-100 sticky top-20 bg-white/95 backdrop-blur z-20 md:static md:bg-transparent md:z-auto">

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                        {/* Filter Toggle Button */}
                        <button
                            onClick={() => setFilterOpen(!filterOpen)}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-charcoal hover:text-primary transition-colors"
                        >
                            <span className="text-lg">{filterOpen ? '−' : '+'}</span>
                            {filterOpen ? 'Hide Filters' : 'Show Filters'}
                        </button>

                        <span className="hidden md:inline-block w-px h-4 bg-neutral-300"></span>
                        <span className="text-xs text-brown/60 uppercase tracking-wide hidden md:inline-block">{products.length} Products</span>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto justify-end">
                        <span className="text-xs text-brown/60 uppercase tracking-wide">Sort by</span>
                        <select className="text-sm bg-transparent border-none focus:ring-0 text-charcoal font-medium cursor-pointer p-0 pr-8">
                            <option>Best Selling</option>
                            <option>Newest</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>
                </div>


                <div className="flex gap-12 items-start relative">

                    {/* 3. Toggleable Sidebar */}
                    <AnimatePresence>
                        {filterOpen && (
                            <motion.aside
                                initial={{ width: 0, opacity: 0, paddingRight: 0 }}
                                animate={{ width: 250, opacity: 1, paddingRight: 24 }}
                                exit={{ width: 0, opacity: 0, paddingRight: 0 }}
                                className="hidden md:block overflow-hidden shrink-0 sticky top-32"
                            >
                                <div className="space-y-10 w-60">
                                    {/* Categories */}
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal mb-4 border-b border-black pb-2">Category</h3>
                                        <ul className="space-y-3">
                                            {['Shop All', 'Aromatherapy', 'Soy Wax', 'Pillar', 'Votive'].map((item, i) => (
                                                <li key={item}>
                                                    <a href="#" className={`text-sm hover:text-primary transition-colors block ${i === 0 ? 'text-charcoal font-bold' : 'text-brown/80'}`}>
                                                        {item}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal mb-4 border-b border-black pb-2">Price</h3>
                                        <div className="space-y-3">
                                            {['Under $25', '$25 - $50', '$50 +'].map((price) => (
                                                <label key={price} className="flex items-center gap-3 text-sm text-brown/80 hover:text-charcoal cursor-pointer group">
                                                    <div className="relative flex items-center">
                                                        <input type="checkbox" className="peer h-4 w-4 cursor-pointer appearance-none rounded-sm border border-neutral-300 transition-all checked:border-charcoal checked:bg-charcoal" />
                                                        <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                    </div>
                                                    <span className="group-hover:translate-x-1 transition-transform">{price}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* Mobile Sidebar (Fixed Overlay) - Only if toggled on mobile */}
                    <div className={`fixed inset-0 z-50 bg-white p-6 transform transition-transform duration-300 md:hidden ${filterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="flex justify-between items-center mb-8">
                            <span className="font-serif text-xl">Filters</span>
                            <button onClick={() => setFilterOpen(false)}><XIcon /></button>
                        </div>
                        {/* Mobile Filter Content Repetition ... (Simplified for mobile usually) */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="font-bold mb-4">Category</h3>
                                <ul className="space-y-2">{['Shop All', 'Aromatherapy', 'Soy Wax'].map(i => <li key={i}>{i}</li>)}</ul>
                            </div>
                        </div>
                    </div>


                    {/* 4. Dynamic Product Grid */}
                    <main className="flex-1 w-full min-w-0">
                        <motion.div
                            layout
                            className={`grid gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16 ${filterOpen ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}
                        >
                            <AnimatePresence>
                                {products.length > 0 ? products.map(product => (
                                    <motion.div
                                        layout
                                        key={product._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <Link to={`/product/${product._id}`}>
                                            <ProductCard product={product} />
                                        </Link>
                                    </motion.div>
                                )) : (
                                    <div className="col-span-full py-32 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-charcoal mb-4"></div>
                                        <p className="text-brown/50 text-sm">Loading curation...</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductListingPage;