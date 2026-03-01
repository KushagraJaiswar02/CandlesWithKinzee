/* eslint-disable */
// src/components/ProductCard.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { getValidImageUrl } from '../utils/imageHelper';

// --- Image Mapping Function ---
const generatePlaceholderUrl = (name) => {
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    return `https://res.cloudinary.com/demo/image/fetch/w_500,h_600,c_fill,g_auto/f_auto/${slug}.jpg`;
};

export default function ProductCard({ product }) {
    // Use robust helper for image URL
    let imageUrl = getValidImageUrl(product?.image);
    imageUrl = imageUrl || generatePlaceholderUrl(product?.name || 'Default Candle');

    return (
        <motion.div
            className="group relative cursor-pointer flex flex-col items-center"
            initial="idle"
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
        >
            {/* Image Container */}
            <div className="relative w-full aspect-[4/5] overflow-hidden bg-soft mb-5 rounded-2xl shadow-sm group-hover:shadow-lg group-hover:shadow-black/5 transition-all duration-500">
                <motion.img
                    src={imageUrl}
                    alt={product?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = generatePlaceholderUrl(product?.name || 'Candle'); }}
                    variants={{
                        idle: { scale: 1 },
                        hover: { scale: 1.08 }
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />

                {/* Add to Cart Overlay */}
                <motion.div
                    className="absolute inset-x-0 bottom-0 p-5 flex justify-center items-end bg-gradient-to-t from-charcoal/30 to-transparent"
                    variants={{
                        idle: { opacity: 0, y: 10 },
                        hover: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <button
                        className="w-full bg-white/95 backdrop-blur-md text-charcoal font-medium py-3.5 px-6 rounded-xl uppercase tracking-widest text-[11px] hover:bg-flame hover:text-white transition-all duration-300 pointer-events-auto shadow-xl"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Logic to add to cart would go here
                            console.log('Add to cart clicked');
                        }}
                    >
                        Add to Cart
                    </button>
                </motion.div>
            </div>

            {/* Product Details */}
            <div className="text-center px-2 w-full">
                <h3 className="text-[1.1rem] font-serif text-charcoal mb-1 line-clamp-1 group-hover:text-flame transition-colors duration-300">
                    {product?.name}
                </h3>
                <p className="text-[13px] font-light tracking-wide text-charcoal/60">
                    ${product?.price ? product.price.toFixed(2) : '0.00'}
                </p>
            </div>
        </motion.div>
    );
}