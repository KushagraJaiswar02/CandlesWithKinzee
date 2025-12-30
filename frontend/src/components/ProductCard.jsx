// src/components/ProductCard.jsx

import React from 'react';
import { motion } from 'framer-motion';

// --- Inline SVG Placeholder for Sparkle Icon (Quick View/Feature Highlight) ---
const SparkleIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.09 3.55l-2.06 1.13c-.17.09-.38.09-.55 0L10.4 3.55c-.27-.15-.6 0-.75.27L9.5 5.56c-.09.17-.09.38 0 .55l1.13 2.06c.15.27 0 .6-.27.75l-2.06 1.13c-.17.09-.38.09-.55 0L3.55 10.4c-.27-.15-0-.6.27-.75L5.56 9.5c.17-.09.17-.38 0-.55L4.43 6.94c-.15-.27 0-.6.27-.75l2.06-1.13c.17-.09.38-.09.55 0l2.06 1.13c.27.15.6 0 .75-.27l1.13-2.06c.09-.17.09-.38 0-.55L15.09 3.55zM12 21.45l2.06-1.13c.17-.09-.38-.09-.55 0L17.5 20.45c.27.15.6 0 .75-.27l1.13-2.06c.09-.17.09-.38 0-.55l-1.13-2.06c-.15-.27 0-.6.27-.75l2.06-1.13c.17-.09.38-.09.55 0l2.06 1.13c.27.15.6 0 .75-.27l1.13-2.06c.09-.17.09-.38 0-.55l-1.13-2.06c-.15-.27 0-.6.27-.75l2.06-1.13c.17-.09.38-.09.55 0L24 12.95l-1.13 2.06c-.09.17-.09.38 0 .55l1.13 2.06c.15.27 0 .6-.27.75l-2.06 1.13c-.17.09-.38-.09-.55 0L12 21.45zM21 12H3"></path>
    </svg>
);

// --- Helper Function: Render Stars ---
const renderStars = (rating) => {
    // FIX: Provides a default value (0) if rating is undefined
    const safeRating = rating || 0;
    const roundedRating = Math.round(safeRating * 2) / 2;

    return (
        <div className="flex items-center text-primary text-sm">
            {Array(5).fill(0).map((_, i) => {
                const starValue = i + 1;
                return (
                    <span key={i} className={starValue <= roundedRating ? 'text-flame' : 'text-shadow'}>
                        ★
                    </span>
                );
            })}
            <span className="text-charcoal ml-2 text-xs">({safeRating.toFixed(1)})</span>
        </div>
    );
};

// --- Image Mapping Function ---
const generatePlaceholderUrl = (name) => {
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    return `https://res.cloudinary.com/demo/image/fetch/w_350,h_350,c_fill,g_auto/f_auto/${slug}.jpg`;
};

// --- Reusable Product Card Component ---
export default function ProductCard({ product }) {

    const imageUrl = product?.image || generatePlaceholderUrl(product?.name || 'Default Candle');

    return (
        <motion.div
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-shadow/50 transform transition duration-500 hover:shadow-2xl cursor-pointer"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
            <div className="relative">
                <img
                    src={imageUrl}
                    alt={product?.name}
                    // KEY CHANGE: Reduced height further from h-56 to h-48
                    className="w-full h-48 object-cover object-center transition duration-300 group-hover:opacity-90"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/350x350/8B5E3C/FFF7E6?text=Candle+Image" }}
                />
                <motion.button
                    className="absolute top-3 right-3 bg-primary/90 p-2 rounded-full shadow-md backdrop-blur-sm"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    title="Quick View"
                    onClick={(e) => { e.stopPropagation(); console.log('Quick view for:', product?.name); }}
                >
                    <SparkleIcon className="w-4 h-4 text-charcoal" />
                </motion.button>
            </div>

            {/* Padding remains compact (p-4) */}
            <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-brown mb-0.5 hover:text-flame transition duration-200">{product?.name}</h3>
                <p className="text-charcoal/70 mb-2 text-xs italic">{product?.scent}</p>

                {/* Rating Section */}
                <div className="flex justify-center mb-3">{renderStars(product?.rating)}</div>

                <div className="flex justify-between items-center pt-3 border-t border-shadow/30">
                    {/* Slightly reduced text size for price (text-lg instead of text-xl) for better compactness */}
                    <span className="text-lg font-extrabold text-charcoal">${product?.price ? product.price.toFixed(2) : 'N/A'}</span>
                    <motion.button
                        className="bg-flame text-white font-medium py-1.5 px-3 rounded-full text-sm shadow-md transition duration-300 hover:bg-brown"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); console.log('Added to cart:', product?.name); }}
                    >
                        Add to Cart
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}