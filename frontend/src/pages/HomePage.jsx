// src/pages/HomePage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import ProductCard from '../components/ProductCard.jsx';
import heroImage from '../assets/hero.png';
import API_BASE_URL from '../config/api';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const containerRef = useRef(null);
    const { scrollY, scrollYProgress } = useScroll();

    // Luxuriously smooth spring for the progress bar
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 70,
        damping: 25,
        mass: 0.5,
        restDelta: 0.001
    });

    // Parallax Effects
    const yHeroText = useTransform(scrollY, [0, 500], [0, 150]); // Text moves slower
    const yHeroImage = useTransform(scrollY, [0, 500], [0, -100]); // Image moves slightly up

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/products`);
                const data = await res.json();
                setFeaturedProducts(data.slice(0, 4));
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    // --- Animations ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    // Custom "Luxury" Bezier Curve
    const smoothEase = [0.25, 0.1, 0.25, 1]; // Similar to iOS ease-out

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1.2,
                ease: smoothEase
            }
        }
    };

    const bentoItems = [
        {
            title: "Aromatherapy",
            col: "md:col-span-2",
            row: "md:row-span-2",
            img: "https://placehold.co/800x800/F5C76B/2C2C2C?text=Aromatherapy",
            link: "/shop?category=aromatherapy"
        },
        {
            title: "Soy Wax",
            col: "md:col-span-1",
            row: "md:row-span-1",
            img: "https://placehold.co/600x600/FFF7E6/8B5E3C?text=Pure+Soy",
            link: "/shop?type=soy"
        },
        {
            title: "Gift Sets",
            col: "md:col-span-1",
            row: "md:row-span-2",
            img: "https://placehold.co/600x800/FF9F1C/FFFFFF?text=Gift+Sets",
            link: "/shop?category=gift"
        },
        {
            title: "Pillars",
            col: "md:col-span-1",
            row: "md:row-span-1",
            img: "https://placehold.co/600x600/8B5E3C/FFF7E6?text=Pillars",
            link: "/shop?type=pillar"
        },
    ];

    return (
        <motion.div
            className="bg-beige min-h-screen text-charcoal font-sans"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            ref={containerRef}
        >
            <SEO title="CandlesWithKinzee" description="Warm minimalist artisanal candles." />

            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-flame origin-left z-[100]"
                style={{ scaleX }}
            />

            {/* 1. Hero Section: Floating Image + Left Text */}
            <section className="relative min-h-screen flex items-center px-6 md:px-12 pt-20 overflow-hidden">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Text Content (Parallax) */}
                    <motion.div
                        style={{ y: yHeroText }}
                        variants={itemVariants}
                        className="z-10 order-2 md:order-1 text-center md:text-left"
                    >
                        <span className="block text-primary uppercase tracking-[0.3em] text-xs font-bold mb-6">
                            Handcrafted in 2024
                        </span>
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif leading-tight mb-8 text-charcoal">
                            Light the <br />
                            <span className="italic font-light text-brown/80">Moment.</span>
                        </h1>
                        <p className="text-lg text-brown/70 font-light mb-10 max-w-md mx-auto md:mx-0 leading-relaxed">
                            Discover the art of slow living with our small-batch, sustainably sourced soy candles.
                        </p>
                        <Link to="/shop">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(245, 199, 107, 0.5)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-4 bg-charcoal text-white font-medium rounded-full shadow-2xl hover:bg-primary transition-colors"
                            >
                                Shop Collection
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Image Content (Parallax + Float) */}
                    <div className="order-1 md:order-2 relative flex justify-center">
                        {/* Background Blob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/40 blur-[80px] rounded-full -z-10" />

                        <motion.img
                            style={{ y: yHeroImage }}
                            src={heroImage}
                            alt="Floating Hero"
                            className="w-full max-w-md md:max-w-lg object-contain drop-shadow-2xl z-10"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: smoothEase }}
                        />
                    </div>
                </div>
            </section>

            {/* 2. Bento Grid Category Section */}
            <section className="py-24 px-6">
                <div className="container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10% 0px" }}
                        transition={{ duration: 1, ease: smoothEase }}
                        className="mb-12 text-center md:text-left"
                    >
                        <h2 className="text-3xl md:text-4xl font-serif text-charcoal">Curated Collections</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[600px]">
                        {bentoItems.map((item, index) => (
                            <Link
                                to={item.link}
                                key={index}
                                className={`relative group overflow-hidden rounded-2xl ${item.col} ${item.row} min-h-[250px] md:min-h-0`}
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0">
                                    <motion.img
                                        src={item.img}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 1.2, ease: "easeOut" }}
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700" />
                                </div>

                                {/* Content Overlay (Backdrop Blur) */}
                                <div className="absolute bottom-6 left-6 z-10">
                                    <div className="overflow-hidden rounded-lg">
                                        <div className="bg-white/30 backdrop-blur-md px-6 py-3 border border-white/20 transition-all duration-500 group-hover:bg-white/40 group-hover:backdrop-blur-xl">
                                            <h3 className="text-xl md:text-2xl font-serif text-white font-medium tracking-wide">
                                                {item.title}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Featured Products */}
            <section className="py-24 bg-white/50 backdrop-blur-sm">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="flex justify-between items-end mb-16"
                    >
                        <div>
                            <span className="text-primary uppercase tracking-widest text-xs font-bold mb-2 block">Weekly Picks</span>
                            <h2 className="text-4xl font-serif text-charcoal">Trending Now</h2>
                        </div>
                        <Link
                            to="/shop"
                            className="hidden md:inline-block border-b border-charcoal pb-1 text-sm font-bold uppercase tracking-widest hover:text-primary hover:border-primary transition-all"
                        >
                            View All
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map((product, i) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.8, delay: i * 0.1, ease: smoothEase }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))
                        ) : (
                            // Loading Skeletons
                            [1, 2, 3, 4].map(n => (
                                <div key={n} className="animate-pulse space-y-4">
                                    <div className="bg-neutral-200 aspect-[3/4] rounded-lg"></div>
                                    <div className="h-4 bg-neutral-200 w-3/4 mx-auto rounded"></div>
                                    <div className="h-3 bg-neutral-200 w-1/2 mx-auto rounded"></div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-12 text-center md:hidden">
                        <Link to="/shop" className="text-sm font-bold uppercase tracking-widest border-b border-charcoal">View All Products</Link>
                    </div>
                </div>
            </section>

            {/* 4. Newsletter */}
            <section className="py-32 px-6 bg-charcoal text-beige flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: smoothEase }}
                    className="max-w-xl"
                >
                    <h2 className="text-4xl md:text-5xl font-serif mb-6">Join the Inner Circle</h2>
                    <p className="text-white/60 mb-10 font-light leading-relaxed">
                        Sign up for exclusive early access to drops, special discounts, and a daily dose of calm.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-1 px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors"
                        />
                        <button className="px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white hover:text-charcoal transition-colors">
                            Subscribe
                        </button>
                    </div>
                </motion.div>
            </section>
        </motion.div>
    );
};

export default HomePage;