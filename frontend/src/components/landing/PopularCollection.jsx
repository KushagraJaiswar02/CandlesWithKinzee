/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CollectionCard from '../CollectionCard.jsx';
import API_BASE_URL from '../../config/api';

const PopularCollection = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                // Public endpoint automatically filters isActive and schedulers
                const res = await fetch(`${API_BASE_URL}/api/collections`);
                if (res.ok) {
                    const data = await res.json();
                    setCollections(data.slice(0, 3)); // Show top 3 by priority weight on homepage
                }
            } catch (error) {
                console.error("Failed to fetch featured collections", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCollections();
    }, []);

    if (loading || collections.length === 0) return null; // Hide section if no collections yet

    return (
        <section className="bg-white py-24 px-6 md:px-12">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-serif text-charcoal mb-4"
                        >
                            Curated Collections
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-charcoal/70 font-light text-[17px]"
                        >
                            Discover the perfect mood carefully arranged for your spaces and seasons.
                        </motion.p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 hidden-scrollbar">
                    {collections.map((collection, index) => (
                        <motion.div
                            key={collection._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                        >
                            <CollectionCard collection={collection} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularCollection;
