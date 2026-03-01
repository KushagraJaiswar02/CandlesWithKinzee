/* eslint-disable */
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard';

const FeaturedProducts = ({ products }) => {
    // If no products passed, fall back to an empty array (parent provides them)
    const displayProducts = products?.slice(0, 4) || [];

    return (
        <section className="bg-beige py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-xl"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-4">
                            Featured Collection
                        </h2>
                        <p className="text-charcoal/70 font-light text-[17px]">
                            Our most loved seasonal scents, handpicked for you.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="hidden md:block"
                    >
                        <Link to="/shop" className="text-charcoal text-[13px] font-medium tracking-widest uppercase border-b border-charcoal/20 hover:border-flame hover:text-flame transition-all duration-300 pb-1">
                            View All Products
                        </Link>
                    </motion.div>
                </div>

                {displayProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                        {displayProducts.map((product, index) => (
                            <motion.div
                                key={product._id || index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Link to={`/product/${product._id}`}>
                                    <ProductCard product={product} />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="w-full py-10 flex justify-center">
                        <p className="text-charcoal/50 italic font-light">Loading featured products...</p>
                    </div>
                )}

                {/* Mobile View All Button */}
                <div className="mt-16 text-center md:hidden">
                    <Link to="/shop" className="text-charcoal text-[13px] font-medium tracking-widest uppercase border-b border-charcoal/20 hover:border-flame hover:text-flame transition-all duration-300 pb-1">
                        View All Products
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
