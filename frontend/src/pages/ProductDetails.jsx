// src/ProductDetailPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO.jsx';
import AuthContext from '../context/AuthContext';

// --- Clean "Star" Component ---
const StarRating = ({ rating }) => {
    const safeRating = rating || 0;
    return (
        <div className="flex items-center space-x-1">
            <span className="flex text-flame">
                {Array(5).fill(0).map((_, i) => (
                    <span key={i} className={i < Math.round(safeRating) ? 'opacity-100' : 'opacity-20'}>★</span>
                ))}
            </span>
            <span className="text-xs text-charcoal/60 font-medium tracking-wide uppercase ml-2">
                {safeRating} / 5.0
            </span>
        </div>
    );
};

const ProductDetailPage = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const { addToCart } = useCart();

    // Fetch product logic...
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, Number(quantity));
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!product) return <div className="text-center py-20">Product not found</div>;

    // Framer Motion variant for page entry
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <motion.div
            className="min-h-screen bg-white"
            variants={pageVariants}
            initial="initial"
            animate="animate"
        >
            <SEO
                title={product.name}
                description={product.description}
                image={product.image}
            />

            <div className="flex flex-col lg:flex-row h-full">

                {/* 1. Left Side - Immersive Image Gallery (Full Height on Desktop) */}
                <div className="w-full lg:w-1/2 bg-neutral-100 relative lg:min-h-screen">
                    {/* Back Button (Absolute) */}
                    <div className="absolute top-6 left-6 z-20">
                        <Link to="/shop" className="flex items-center text-charcoal/80 hover:text-black transition-colors text-sm font-medium tracking-wide bg-white/50 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white">
                            &larr; Back to Shop
                        </Link>
                    </div>

                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-[50vh] lg:h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x1200/E5E5E5/A3A3A3?text=Kinzee+Detail" }}
                    />
                </div>

                {/* 2. Right Side - Minimalist Details (Scrollable) */}
                <div className="w-full lg:w-1/2 p-8 lg:p-20 flex flex-col justify-center bg-white">
                    <div className="max-w-xl mx-auto w-full">

                        {/* Header Info */}
                        <div className="mb-8">
                            <div className="flex justify-between items-start mb-4">
                                <h1 className="text-4xl lg:text-5xl font-serif text-charcoal leading-tight">
                                    {product.name}
                                </h1>
                                {user && user.isAdmin && (
                                    <Link to={`/admin/product/${product._id}/edit`} className="text-xs font-bold uppercase tracking-widest text-brown border-b border-brown hover:text-primary transition-colors">
                                        Edit
                                    </Link>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-2xl font-light text-charcoal">${product.price.toFixed(2)}</p>
                                <StarRating rating={product.rating} />
                            </div>
                        </div>

                        {/* Divider */}
                        <hr className="border-neutral-200 mb-8" />

                        {/* Description */}
                        <div className="mb-10 space-y-6 text-brown/80 font-light leading-relaxed">
                            <p>{product.description}</p>

                            <div className="grid grid-cols-2 gap-6 text-sm">
                                <div>
                                    <span className="block font-bold text-charcoal uppercase tracking-wider text-xs mb-1">Fragrance Notes</span>
                                    <span>{product.scent || 'Custom Blend'}</span>
                                </div>
                                <div>
                                    <span className="block font-bold text-charcoal uppercase tracking-wider text-xs mb-1">Weight</span>
                                    <span>{product.weight || 'Standard'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Add to Cart Section */}
                        <div className="space-y-6">
                            {/* Stock Indicator */}
                            {product.countInStock > 0 ? (
                                <p className="text-sm text-green-600 flex items-center">
                                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                                    In Stock ({product.countInStock} available)
                                </p>
                            ) : (
                                <p className="text-sm text-red-500 font-bold uppercase tracking-wide">Out of Stock</p>
                            )}

                            <div className="flex gap-4">
                                {/* Simple Quantity Input */}
                                <div className="relative w-20">
                                    <input
                                        type="number"
                                        value={quantity}
                                        min="1"
                                        max={product.countInStock}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            if (val > product.countInStock) setQuantity(product.countInStock);
                                            else if (val < 1) setQuantity(1);
                                            else setQuantity(val);
                                        }}
                                        disabled={product.countInStock === 0}
                                        className="w-full h-14 border border-neutral-300 rounded-none text-center text-charcoal focus:ring-0 focus:border-charcoal hover:border-gray-400 transition-colors disabled:opacity-50 disabled:bg-neutral-100"
                                    />
                                </div>

                                <motion.button
                                    onClick={handleAddToCart}
                                    className="flex-1 h-14 bg-charcoal text-white font-bold uppercase tracking-widest text-sm hover:bg-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-400"
                                    disabled={product.countInStock === 0}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </motion.button>
                            </div>

                            <p className="text-xs text-center text-brown/50 mt-4">
                                Free shipping on orders over $50. Calculated at checkout.
                            </p>
                        </div>

                        {/* Accordion / Extra Details */}
                        <div className="mt-12 space-y-4 border-t border-neutral-200 pt-8">
                            <details className="group cursor-pointer">
                                <summary className="flex justify-between items-center font-medium text-charcoal list-none">
                                    <span>Shipping & Returns</span>
                                    <span className="transition group-open:rotate-180">+</span>
                                </summary>
                                <p className="text-sm text-brown/70 mt-2 font-light">
                                    We ship within 2-3 business days. Returns accepted within 30 days of delivery.
                                </p>
                            </details>
                            <details className="group cursor-pointer">
                                <summary className="flex justify-between items-center font-medium text-charcoal list-none">
                                    <span>Care Instructions</span>
                                    <span className="transition group-open:rotate-180">+</span>
                                </summary>
                                <p className="text-sm text-brown/70 mt-2 font-light">
                                    Trim wick to 1/4 inch before lighting. Keep candle free of any foreign materials including matches and wick trimmings.
                                </p>
                            </details>
                        </div>

                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductDetailPage;