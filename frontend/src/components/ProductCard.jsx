/* eslint-disable */
// src/components/ProductCard.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { getValidImageUrl } from '../utils/imageHelper';
import { ShoppingCart, Star } from 'lucide-react';

// --- Image Mapping Function ---
const generatePlaceholderUrl = (name) => {
    const slug = name?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || 'candle';
    return `https://res.cloudinary.com/demo/image/fetch/w_500,h_500,c_fill,g_auto/f_auto/${slug}.jpg`;
};

export default function ProductCard({ product, view = 'grid' }) {
    // Use robust helper for image URL
    let imageUrl = getValidImageUrl(product?.image);
    imageUrl = imageUrl || generatePlaceholderUrl(product?.name);

    // Mock stock warning for premium feel "Only X left"
    const stockLeft = Math.floor(Math.random() * 5) + 1;
    const showStock = stockLeft <= 3 && Math.random() > 0.4;

    if (view === 'list') {
        return (
            <motion.div
                className="group relative flex flex-col sm:flex-row bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all duration-200 gap-6"
                whileHover={{ y: -2 }}
            >
                {/* Image */}
                <div className="w-full sm:w-48 aspect-square shrink-0 overflow-hidden rounded-lg bg-gray-50 relative">
                    <img
                        src={imageUrl}
                        alt={product?.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.target.onerror = null; e.target.src = generatePlaceholderUrl(product?.name); }}
                    />
                    {showStock && (
                        <span className="absolute top-2 left-2 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                            Only {stockLeft} left
                        </span>
                    )}
                </div>

                {/* Details */}
                <div className="flex flex-col flex-1 justify-center py-2">
                    <div className="mb-2 flex items-center gap-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={13} fill="currentColor" />)}
                        <span className="text-xs text-gray-400 ml-1.5 font-medium">(24)</span>
                    </div>
                    <span className="text-sm text-gray-500 mb-1.5 uppercase tracking-wide text-[11px] font-medium">{product?.category || 'Handcrafted'}</span>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{product?.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 max-w-lg mb-6 leading-relaxed">
                        Discover the essence of luxury with this premium candle. Designed to elevate your everyday sanctuary with a clean, sustained burn and sophisticated scent profile.
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                        <span className="text-xl font-semibold text-gray-900">₹{product?.price?.toFixed(2) || '0.00'}</span>

                        <button
                            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-[13px] font-medium hover:bg-amber-600 transition-colors shadow-sm"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Add to cart clicked');
                            }}
                        >
                            <ShoppingCart size={16} /> Add to Cart
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Grid View
    return (
        <motion.div
            className="group relative flex flex-col bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 h-full"
            whileHover={{ y: -2 }}
        >
            {/* Image Container */}
            <div className="relative w-full aspect-square overflow-hidden bg-gray-50 border-b border-gray-50">
                <img
                    src={imageUrl}
                    alt={product?.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = generatePlaceholderUrl(product?.name); }}
                />

                {showStock && (
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-red-600 border border-red-100 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shadow-sm">
                        Only {stockLeft} left
                    </span>
                )}

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out z-10">
                    <button
                        className="w-full bg-white/95 backdrop-blur-md text-gray-900 font-medium py-3 rounded-lg text-[13px] hover:bg-gray-900 hover:text-white transition-colors shadow-md flex items-center justify-center gap-2"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Quick add clicked');
                        }}
                    >
                        <ShoppingCart size={15} /> Quick Add
                    </button>
                </div>
            </div>

            {/* Product Details */}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">
                        {product?.category || 'Handcrafted'}
                    </span>
                    <div className="flex items-center text-amber-500">
                        <Star size={11} fill="currentColor" />
                        <span className="text-[11px] text-gray-400 ml-1 font-medium">4.9</span>
                    </div>
                </div>
                <h3 className="text-base font-medium text-gray-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                    {product?.name}
                </h3>
                <div className="mt-auto pt-2">
                    <p className="text-[17px] font-semibold text-gray-900">₹{product?.price?.toFixed(2) || '0.00'}</p>
                </div>
            </div>
        </motion.div>
    );
}