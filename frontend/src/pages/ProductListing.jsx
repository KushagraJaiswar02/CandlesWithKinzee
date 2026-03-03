// src/pages/ProductListing.jsx

/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard.jsx';
import SEO from '../components/SEO.jsx';
import API_BASE_URL from '../config/api';
import { SlidersHorizontal, LayoutGrid, List, ChevronDown, X } from 'lucide-react';

const ProductListingPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [sortOption, setSortOption] = useState('Popular');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/products`);
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Helper to render the sidebar filters
    const renderFilters = () => (
        <div className="space-y-8">
            <div className="flex items-center justify-between md:hidden mb-6 cursor-pointer" onClick={() => setMobileFilterOpen(false)}>
                <h2 className="text-lg font-serif text-gray-900">Filters</h2>
                <button className="p-2 text-gray-400 hover:text-gray-900">
                    <X size={20} />
                </button>
            </div>

            {/* Category */}
            <div>
                <h3 className="text-[13px] font-semibold text-gray-900 mb-4 tracking-wide uppercase">Category</h3>
                <ul className="space-y-3">
                    {['Shop All', 'Signature Candles', 'Aromatherapy', 'Festive Collection'].map((cat, i) => (
                        <li key={cat}>
                            <button className={`text-[14px] transition-colors ${i === 0 ? 'font-medium text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
                                {cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Fragrance Type */}
            <div>
                <h3 className="text-[13px] font-semibold text-gray-900 mb-4 tracking-wide uppercase">Fragrance Notes</h3>
                <div className="flex flex-col gap-3">
                    {['Woody & Earthy', 'Floral', 'Fresh & Citrus', 'Spiced'].map(note => (
                        <label key={note} className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center group-hover:border-gray-400 transition-colors">
                            </div>
                            <span className="text-[14px] text-gray-600 group-hover:text-gray-900">{note}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price */}
            <div>
                <h3 className="text-[13px] font-semibold text-gray-900 mb-4 tracking-wide uppercase">Price</h3>
                <div className="flex flex-col gap-3">
                    {['Under ₹499', '₹500 - ₹999', '₹1000+'].map((price) => (
                        <label key={price} className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-gray-400 transition-colors">
                            </div>
                            <span className="text-[14px] text-gray-600 group-hover:text-gray-900">{price}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Availability */}
            <div className="pt-6 border-t border-gray-100">
                <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-[14px] text-gray-900 font-medium tracking-wide">In Stock Only</span>
                    <div className="w-9 h-5 bg-gray-200 rounded-full relative transition-colors duration-200 group-hover:bg-gray-300">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-200 shadow-sm"></div>
                    </div>
                </label>
            </div>
        </div>
    );

    return (
        <div className="bg-white min-h-screen pb-20">
            <SEO
                title="Shop Handcrafted Candles"
                description="Discover our premium handcrafted candle collection. Clean burning soy wax with sophisticated scent profiles."
            />


            {/* 2. Main Content Area */}
            <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1400px] pt-28 md:pt-32">

                {/* Mobile Controls (Filters + Sort) */}
                <div className="flex md:hidden items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <button
                        onClick={() => setMobileFilterOpen(true)}
                        className="flex items-center gap-2 text-[14px] font-medium text-gray-900"
                    >
                        <SlidersHorizontal size={18} /> Filters
                    </button>

                    <div className="relative">
                        <select
                            className="appearance-none bg-transparent border-none text-[14px] font-medium text-gray-900 pr-6 focus:ring-0 cursor-pointer"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option>Popular</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Newest</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

                    {/* 3. Desktop Sidebar Filters (240px fixed) */}
                    {showFilters && (
                        <aside className="hidden md:block w-[240px] shrink-0 sticky top-28 pr-4">
                            {renderFilters()}
                        </aside>
                    )}

                    {/* Mobile Slide-over Filters */}
                    <AnimatePresence>
                        {mobileFilterOpen && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-gray-900/40 z-[100] md:hidden backdrop-blur-sm"
                                    onClick={() => setMobileFilterOpen(false)}
                                />
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '-100%' }}
                                    transition={{ type: 'tween', duration: 0.3 }}
                                    className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white z-[110] p-6 pt-10 overflow-y-auto shadow-2xl md:hidden custom-scrollbar"
                                >
                                    {renderFilters()}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* 4. Product Grid Area */}
                    <main className="flex-1 w-full min-w-0">

                        {/* Desktop Toolbar (Sort & View Toggle) */}
                        <div className="hidden md:flex justify-between items-center mb-6 bg-white z-10 sticky top-[72px] py-4 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 text-[14px] font-medium text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <SlidersHorizontal size={18} />
                                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                                </button>
                                <p className="text-[14px] text-gray-500 font-medium">
                                    Showing {products.length} products
                                </p>
                            </div>

                            <div className="flex items-center gap-6">
                                {/* View Toggle */}
                                <div className="flex items-center bg-gray-50 p-1 rounded-lg border border-gray-100">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <LayoutGrid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <List size={18} />
                                    </button>
                                </div>

                                {/* Sort Options */}
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] text-gray-500 uppercase tracking-widest font-medium">Sort by:</span>
                                    <div className="relative">
                                        <select
                                            className="appearance-none bg-transparent border-none text-[14px] font-medium text-gray-900 pr-6 py-1 focus:ring-0 cursor-pointer hover:text-amber-600 transition-colors"
                                            value={sortOption}
                                            onChange={(e) => setSortOption(e.target.value)}
                                        >
                                            <option>Popular</option>
                                            <option>Price: Low to High</option>
                                            <option>Price: High to Low</option>
                                            <option>Newest</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Render Loop */}
                        {loading ? (
                            <div className="py-32 flex flex-col items-center justify-center">
                                <div className="w-8 h-8 flex items-center justify-center border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-400 text-[14px] font-medium tracking-wide">Curating collection...</p>
                            </div>
                        ) : (
                            <motion.div
                                layout
                                className={
                                    viewMode === 'grid'
                                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
                                        : "flex flex-col gap-6"
                                }
                            >
                                <AnimatePresence mode="popLayout">
                                    {products.length > 0 ? products.map((product) => (
                                        <motion.div
                                            layout
                                            key={product._id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Link to={`/product/${product._id}`} className="block h-full">
                                                <ProductCard product={product} view={viewMode} />
                                            </Link>
                                        </motion.div>
                                    )) : (
                                        <div className="col-span-full py-20 text-center">
                                            <p className="text-gray-500 text-[15px]">No products match the selected criteria.</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductListingPage;