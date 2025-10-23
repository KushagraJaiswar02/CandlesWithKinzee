// src/ProductDetailPage.jsx

import React from 'react';
import { useParams , Link} from 'react-router-dom';
import { motion } from 'framer-motion';

// Placeholder for Add to Cart Icon
const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
);

// Helper function for placeholder stars
const renderStars = (rating) => {
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
            <span className="text-charcoal ml-2 text-sm font-medium">({safeRating.toFixed(1)} / 5)</span>
        </div>
    );
};


const ProductDetailPage = () => {
    const { id } = useParams(); // Get the product ID from the URL

    // --- Dummy Product Data (Replace with API fetch later) ---
    const product = {
        id: id,
        name: id === 'p1' ? 'Warm Vanilla Glow' : id === 'p2' ? 'Sandalwood Serenity' : 'Handcrafted Candle',
        price: 24.99,
        description: "Experience the ultimate comfort with this hand-poured, slow-burning candle. Made from natural soy wax with a lead-free wick. It features notes of roasted vanilla bean, caramel, and a hint of smoky cedar.",
        scent: 'Sweet & Comforting',
        weight: '8 oz',
        rating: 4.7,
        stock: 15,
        image: `https://res.cloudinary.com/demo/image/fetch/w_600,h_800,c_fill,g_auto/f_auto/product-${id}.jpg` // Cloudinary structure
    };
    
    // Framer Motion variant for page entry
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <motion.div 
            className="min-h-screen bg-beige p-4 md:p-12"
            variants={pageVariants}
            initial="initial"
            animate="animate"
        >
            <div className="container mx-auto">
                {/* Back to Shop Link */}
                <Link to="/shop" className="flex items-center text-brown hover:text-flame mb-6 text-sm font-medium transition">
                    &larr; Back to all Candles
                </Link>

                <div className="flex flex-col lg:flex-row gap-10 bg-white p-6 md:p-10 rounded-xl shadow-2xl border border-shadow/50">
                    
                    {/* 1. Image Gallery (Placeholder) */}
                    <div className="lg:w-1/2">
                        <motion.img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-auto object-cover rounded-xl border border-shadow/30"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x800/8B5E3C/FFF7E6?text=Product+Image" }}
                        />
                    </div>

                    {/* 2. Product Details */}
                    <div className="lg:w-1/2 space-y-6">
                        <h1 className="text-4xl font-extrabold text-brown font-serif">{product.name}</h1>
                        
                        {/* Rating and Reviews */}
                        <div className="flex items-center space-x-4 border-b border-shadow/50 pb-4">
                            {renderStars(product.rating)}
                            <span className="text-charcoal text-sm hover:text-flame cursor-pointer underline">
                                Read all 45 reviews (Review system is required) [cite: 11, 13]
                            </span>
                        </div>

                        {/* Pricing */}
                        <p className="text-5xl font-bold text-flame">
                            ${product.price.toFixed(2)}
                        </p>

                        {/* Description */}
                        <div className="space-y-3 text-charcoal">
                            <h2 className="text-xl font-semibold text-brown">Product Summary</h2>
                            <p>{product.description}</p>
                            <ul className="list-disc list-inside text-sm text-shadow ml-4">
                                <li>Scent Profile: {product.scent}</li>
                                <li>Weight: {product.weight}</li>
                                <li>In Stock: <span className="text-primary font-bold">{product.stock} units</span></li>
                            </ul>
                        </div>

                        {/* Add to Cart/Quantity Controls */}
                        <div className="flex space-x-4 pt-4 border-t border-shadow/50">
                            <input 
                                type="number" 
                                defaultValue="1" 
                                min="1" 
                                max={product.stock}
                                className="w-20 p-3 border border-shadow rounded-lg text-center text-charcoal focus:ring-primary focus:border-primary"
                            />
                            
                            <motion.button
                                className="flex-1 flex items-center justify-center py-3 bg-primary text-charcoal font-bold text-lg rounded-lg shadow-xl hover:bg-flame hover:text-white transition duration-200"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <CartIcon className="w-5 h-5 mr-2" />
                                Add to Cart
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* 3. Review Section Placeholder */}
                <section className="mt-12 p-8 bg-white rounded-xl shadow-lg">
                    <h2 className="text-3xl font-bold text-brown mb-6">Customer Feedback</h2>
                    <p className="text-charcoal/70">
                        This section will integrate the **Product Reviews** system for customer feedback and star ratings, crucial for credibility.
                    </p>
                    <div className="mt-4 h-32 bg-beige border border-shadow rounded-lg flex items-center justify-center">
                        Placeholder for Review Submission Form and List of Reviews
                    </div>
                </section>

            </div>
        </motion.div>
    );
};

export default ProductDetailPage;