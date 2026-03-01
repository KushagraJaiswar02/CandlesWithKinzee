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
                if (!res.ok) throw new Error(`API Request Failed: ${res.status}`);

                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new TypeError("Received HTML instead of JSON. Check API URL.");
                }

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

            {/* 1. Hero Section: Refined Asymmetrical */}
            <section className="relative min-h-[90vh] flex items-center px-6 md:px-12 pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-beige via-beige to-white/50 -z-20"></div>

                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <motion.div
                        style={{ y: yHeroText }}
                        variants={itemVariants}
                        className="z-10 order-2 lg:order-1 text-center lg:text-left flex flex-col justify-center"
                    >
                        <span className="block text-primary uppercase tracking-[0.4em] text-xs font-bold mb-8">
                            Handcrafted with Intention
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif leading-[1.1] mb-8 text-charcoal">
                            Light the <br />
                            <span className="italic font-light text-brown relative">
                                Moment.
                                {/* Decorative underline */}
                                <svg className="absolute w-full h-3 -bottom-2 left-0 text-primary/40 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-lg text-charcoal/70 font-light mb-12 max-w-md mx-auto lg:mx-0 leading-relaxed">
                            Discover the art of slow living with our small-batch, sustainably sourced soy candles. Created to ground your space and elevate your everyday.
                        </p>
                        <Link to="/shop">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group inline-flex items-center gap-4 px-10 py-5 bg-charcoal text-beige font-medium shadow-xl hover:bg-brown transition-all duration-300"
                            >
                                <span className="uppercase tracking-widest text-xs font-bold">Shop Collection</span>
                                <span className="w-8 h-[1px] bg-beige group-hover:w-16 transition-all duration-500"></span>
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Image Content */}
                    <div className="order-1 lg:order-2 relative flex justify-center items-center h-full min-h-[50vh]">
                        {/* Elegant Soft Backdrop Mask */}
                        <div className="absolute inset-0 bg-primary/5 rounded-[4rem] transform rotate-3 scale-105 -z-10"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-white/60 blur-[100px] rounded-full -z-10" />

                        <motion.img
                            style={{ y: yHeroImage }}
                            src={heroImage}
                            alt="Floating Hero"
                            className="w-full max-w-sm md:max-w-md lg:max-w-xl object-contain drop-shadow-2xl z-10"
                            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            transition={{ duration: 1.8, ease: smoothEase }}
                        />
                    </div>
                </div>
            </section>

            {/* 2. Elevated Bento Grid Collection */}
            <section className="py-32 px-6 bg-white">
                <div className="container mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10% 0px" }}
                        transition={{ duration: 1, ease: smoothEase }}
                        className="mb-16 text-center lg:text-left flex flex-col lg:flex-row justify-between items-end gap-6"
                    >
                        <div>
                            <span className="text-primary uppercase tracking-[0.2em] text-xs font-bold mb-4 block">The Collections</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-charcoal">Curated Scents</h2>
                        </div>
                        <p className="text-charcoal/60 font-light max-w-sm text-sm leading-relaxed hidden lg:block pb-2">
                            Explore our bespoke categories, formulated to transform the atmosphere of every room.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[650px]">
                        {bentoItems.map((item, index) => (
                            <Link
                                to={item.link}
                                key={index}
                                className={`relative group overflow-hidden ${item.col} ${item.row} min-h-[300px] md:min-h-0 bg-neutral-100`}
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <motion.img
                                        src={item.img}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                                    />
                                    {/* Gradient overlay for text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-700" />
                                </div>

                                {/* Content Overlay */}
                                <div className="absolute inset-x-0 bottom-0 p-8 z-10 flex flex-col justify-end h-full">
                                    <h3 className="text-3xl font-serif text-white tracking-wide mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[0.25,0.1,0.25,1]">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-3 text-white/90 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-[50ms] ease-[0.25,0.1,0.25,1]">
                                        <span className="text-xs font-medium uppercase tracking-[0.2em]">Explore</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Featured Products */}
            <section className="py-32 bg-beige text-charcoal">
                <div className="container mx-auto px-6 max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
                    >
                        <div>
                            <span className="text-brown uppercase tracking-[0.2em] text-xs font-bold mb-3 block">Weekly Picks</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-charcoal">Trending Now</h2>
                        </div>
                        <Link
                            to="/shop"
                            className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest hover:text-brown transition-colors"
                        >
                            <span>Discover All</span>
                            <span className="block w-6 h-[1px] bg-charcoal group-hover:w-10 group-hover:bg-brown transition-all duration-300"></span>
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map((product, i) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 1, delay: i * 0.1, ease: smoothEase }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))
                        ) : (
                            // Elegant Loading Skeletons
                            [1, 2, 3, 4].map(n => (
                                <div key={n} className="animate-pulse space-y-6 flex flex-col items-center">
                                    <div className="bg-charcoal/5 aspect-[4/5] w-full"></div>
                                    <div className="space-y-3 w-full px-4 text-center flex flex-col items-center">
                                        <div className="h-4 bg-charcoal/10 w-3/4"></div>
                                        <div className="h-3 bg-charcoal/10 w-1/4"></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* 4. Elegant Newsletter */}
            <section className="py-40 px-6 bg-charcoal text-beige relative overflow-hidden">
                {/* Soft ambient light blurs */}
                <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-flame/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

                <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: smoothEase }}
                        className="max-w-2xl w-full"
                    >
                        <span className="text-primary uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Stay Connected</span>
                        <h2 className="text-4xl md:text-6xl font-serif mb-8 text-white tracking-wide">Join the Inner Circle</h2>
                        <p className="text-white/50 mb-16 font-light text-lg leading-relaxed max-w-lg mx-auto">
                            Sign up for exclusive early access to drops, special discounts, and a daily dose of calm delivered straight to your inbox.
                        </p>

                        <div className="flex flex-col sm:flex-row w-full max-w-md mx-auto relative group">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 px-4 py-4 bg-transparent border-b border-white/30 text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors text-base text-center sm:text-left"
                            />
                            <button className="sm:absolute sm:right-0 sm:bottom-0 sm:top-0 mt-8 sm:mt-0 font-bold uppercase tracking-[0.2em] text-xs text-primary hover:text-white transition-colors flex items-center justify-center sm:justify-start gap-2 pr-4">
                                Subscribe
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </motion.div>
    );
};

export default HomePage;