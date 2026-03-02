/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/hero.png';
import candlenew from "../../assets/candlenew.jpeg";
import customSlideImage from "../../assets/image.png";

const slideImages = [
    heroImage,
    candlenew,
    customSlideImage
];

const Hero = ({ heroTitle, heroSubtitle }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const paginate = (newDirection) => {
        setCurrentIndex((prev) => (prev + newDirection + slideImages.length) % slideImages.length);
    };

    // Auto-scroll effect
    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1);
        }, 2500); // .5 second timer
        return () => clearInterval(timer);
    }, [currentIndex]);

    return (
        <section className="relative w-full min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-beige">
            <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">

                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-xl"
                >
                    <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-serif text-charcoal leading-[1.1] mb-6">
                        {heroTitle || 'Handcrafted Candles That Transform Your Space.'}
                    </h1>
                    <p className="text-charcoal/70 text-lg md:text-xl font-light mb-10 leading-relaxed max-w-lg">
                        {heroSubtitle || 'Discover premium, small-batch soy candles designed to elevate your everyday moments with long-lasting, elegant fragrances.'}
                    </p>
                    <div className="flex flex-wrap items-center gap-6">
                        <Link to="/shop">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-charcoal text-white px-9 py-4 rounded-full text-[13px] font-medium tracking-widest uppercase hover:bg-flame transition-colors duration-300 shadow-xl shadow-black/5"
                            >
                                Shop Now
                            </motion.button>
                        </Link>
                        <Link to="/collections">
                            <motion.button
                                whileHover={{ x: 5 }}
                                className="text-charcoal py-4 text-[13px] font-medium tracking-widest uppercase border-b border-black/10 hover:border-flame hover:text-flame transition-all duration-300"
                            >
                                Explore Collection
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                {/* Right Image Slideshow - Coverflow Style */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="relative flex justify-center items-center h-full w-full min-h-[500px]"
                >
                    {/* Decorative Blur Background Element */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-soft rounded-full blur-3xl opacity-60 z-0 pointer-events-none"></div>

                    <div className="relative w-full max-w-sm lg:max-w-md aspect-[3.5/5] flex justify-center items-center group z-10">
                        {slideImages.map((src, idx) => {
                            const total = slideImages.length;
                            // Safe circular modulo for both positive and negative offsets
                            let offset = ((idx - currentIndex) % total + total) % total;

                            // Normalize offset to find relative distance
                            if (offset > Math.floor(total / 2)) {
                                offset -= total;
                            }

                            // Calculate styling based on normalized offset
                            let x = 0;
                            let scale = 1;
                            let opacity = 1;
                            let zIndex = 10;
                            let blur = 0;
                            let isVisible = true;

                            if (offset === 0) {
                                x = 0;         // Center
                                scale = 1;
                                opacity = 1;
                                zIndex = 20;
                                blur = 0;
                            } else if (offset === 1) {
                                x = 75;        // Peeking from right
                                scale = 0.85;
                                opacity = 0.5;
                                zIndex = 15;
                                blur = 2;
                            } else if (offset === -1) {
                                x = -75;       // Peeking from left
                                scale = 0.85;
                                opacity = 0.5;
                                zIndex = 15;
                                blur = 2;
                            } else {
                                x = offset > 0 ? 120 : -120; // Hidden swoop behind
                                scale = 0.7;
                                opacity = 0;
                                zIndex = 5;
                                blur = 8;
                                isVisible = false;
                            }

                            return (
                                <motion.div
                                    key={idx}
                                    animate={{
                                        x: `${x}%`,
                                        scale,
                                        opacity,
                                        zIndex,
                                        filter: `blur(${blur}px)`,
                                        pointerEvents: isVisible ? 'auto' : 'none'
                                    }}
                                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                                    className={`absolute w-3/4 aspect-[4/5] rounded-t-[8rem] rounded-b-xl overflow-hidden shadow-2xl shadow-charcoal/20 border border-white/40 ${offset === 0 ? 'cursor-default' : 'cursor-pointer'}`}
                                    onClick={() => {
                                        if (offset !== 0 && isVisible) setCurrentIndex(idx);
                                    }}
                                >
                                    <img
                                        src={src}
                                        alt={`Handcrafted candle slide ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Subtle gradient specifically on the center item for depth */}
                                    {offset === 0 && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent mix-blend-multiply pointer-events-none transition-opacity duration-300"></div>
                                    )}
                                </motion.div>
                            )
                        })}

                        {/* Transparent Overlay for Swipe Navigation */}
                        <motion.div
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(e, { offset }) => {
                                if (offset.x < -40) paginate(1);
                                else if (offset.x > 40) paginate(-1);
                            }}
                            className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing"
                            title="Swipe to navigate"
                        />



                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default Hero;
