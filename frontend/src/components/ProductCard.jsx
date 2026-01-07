// src/components/ProductCard.jsx

import React from 'react';
import { motion } from 'framer-motion';

// --- Image Mapping Function ---
const generatePlaceholderUrl = (name) => {
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    return `https://res.cloudinary.com/demo/image/fetch/w_500,h_600,c_fill,g_auto/f_auto/${slug}.jpg`;
};

export default function ProductCard({ product }) {
    let imageUrl = product?.image || generatePlaceholderUrl(product?.name || 'Default Candle');

    // Fix for Windows paths and relative URLs
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
        imageUrl = imageUrl.replace(/\\/g, '/');
        if (!imageUrl.startsWith('/')) {
            imageUrl = `/${imageUrl}`;
        }
    }

    return (
        <motion.div
            className="group relative cursor-pointer bg-white rounded-lg overflow-hidden"
            initial="idle"
            whileHover="hover"
            // Soft shadow that grows on hover (No border)
            style={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)" }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-beige">
                <motion.img
                    src={imageUrl}
                    alt={product?.name}
                    className="w-full h-full object-cover origin-center"
                    variants={{
                        idle: { scale: 1 },
                        hover: { scale: 1.05 }
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />

                {/* Add to Cart - Slide Up & Fade In */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent flex justify-center items-end pb-6"
                    variants={{
                        idle: { opacity: 0, y: 20 },
                        hover: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <button
                        className="w-full bg-white text-charcoal font-medium py-3 rounded shadow-lg uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-colors"
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
            <div className="p-4 text-center">
                <h3 className="text-lg font-serif text-charcoal mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {product?.name}
                </h3>
                <p className="text-sm font-sans text-brown/70">
                    ${product?.price ? product.price.toFixed(2) : '0.00'}
                </p>
            </div>
        </motion.div>
    );
}