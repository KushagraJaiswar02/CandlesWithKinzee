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
            <div className="relative w-full aspect-[4/5] overflow-hidden bg-beige mb-6 rounded-none">
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
                    className="absolute inset-x-0 bottom-0 p-6 flex justify-center items-end bg-gradient-to-t from-charcoal/40 to-transparent"
                    variants={{
                        idle: { opacity: 0, y: 10 },
                        hover: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <button
                        className="w-full bg-white/90 backdrop-blur-sm text-charcoal font-medium py-3 px-6 shadow-xl uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all duration-300 pointer-events-auto"
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
            <div className="text-center px-4 w-full">
                <h3 className="text-lg md:text-xl font-serif text-charcoal mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300">
                    {product?.name}
                </h3>
                <p className="text-sm font-light tracking-wide text-brown">
                    ${product?.price ? product.price.toFixed(2) : '0.00'}
                </p>
            </div>
        </motion.div>
    );
}