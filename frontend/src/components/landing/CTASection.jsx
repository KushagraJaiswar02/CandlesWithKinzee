/* eslint-disable */
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CTASection = () => {
    return (
        <section className="bg-beige py-32 px-6 border-b border-borderSubtle">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-flame text-[11px] font-bold tracking-[0.2em] uppercase mb-6 block">
                        Elevate Your Environment
                    </span>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-charcoal mb-8 leading-[1.1]">
                        Find Your Perfect Candle.
                    </h2>
                    <p className="text-charcoal/70 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed">
                        Join our community of scent lovers and start transforming your home one flame at a time.
                    </p>
                    <Link to="/shop">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-charcoal text-white px-10 py-4 rounded-full text-[13px] font-medium tracking-widest uppercase hover:bg-flame transition-colors duration-300 shadow-xl shadow-black/5"
                        >
                            Shop The Collection
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
