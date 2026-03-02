/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO.jsx';
import API_BASE_URL from '../config/api';

// Landing Page Components
import Hero from '../components/landing/Hero.jsx';
import FeaturedProducts from '../components/landing/FeaturedProducts.jsx';
import BrandValues from '../components/landing/BrandValues.jsx';
import PopularCollection from '../components/landing/PopularCollection.jsx';
import CTASection from '../components/landing/CTASection.jsx';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [landingConfig, setLandingConfig] = useState(null);

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

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/landing-config`)
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data) setLandingConfig(data); })
            .catch(() => {});
    }, []);

    return (
        <motion.div
            className="bg-beige min-h-screen text-charcoal font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <SEO title="Candlewithkinzee | Premium Handcrafted Candles" description="Discover premium, small-batch soy candles designed to elevate your everyday moments." />

            <Hero
                heroTitle={landingConfig?.heroTitle}
                heroSubtitle={landingConfig?.heroSubtitle}
            />
            <FeaturedProducts products={featuredProducts} />
            <BrandValues />
            <PopularCollection />
            <CTASection />

        </motion.div>
    );
};

export default HomePage;