import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import CollectionCard from '../components/CollectionCard';
import API_BASE_URL from '../config/api';

const CollectionsPage = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/collections`);
            if (!res.ok) throw new Error('Failed to fetch collections');
            const data = await res.json();
            setCollections(data);
        } catch (err) {
            setError('Could not load collections at this time.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#FAFAFA] min-h-screen pb-20 font-sans">
            <SEO title="Curated Collections | KindleLight" description="Discover our handcrafted premium candles grouped by season, mood, and fragrance notes." />

            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100 pt-32 pb-16 px-4 md:px-8">
                <div className="container mx-auto max-w-[1400px] text-center">
                    <span className="text-amber-600 font-medium text-[12px] tracking-widest uppercase mb-4 block">Curated By Us</span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-serif text-gray-900 mb-4 tracking-tight"
                    >
                        Collections
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-gray-500 max-w-2xl mx-auto text-[15px] leading-relaxed"
                    >
                        Explore our carefully arranged selections, from limited drops to seasonal warmth. Step into a world of curated fragrances.
                    </motion.p>
                </div>
            </div>

            {/* Grid Area */}
            <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1400px] pt-16">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                        <p className="text-gray-400 text-[15px] font-medium tracking-wide animate-pulse">Gathering Collections...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-gray-500">{error}</div>
                ) : collections.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 bg-white rounded-3xl border border-gray-100">
                        No active collections available right now. Check back later!
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                    >
                        {collections.map((collection) => (
                            <motion.div
                                key={collection._id}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                                }}
                            >
                                <CollectionCard collection={collection} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CollectionsPage;
