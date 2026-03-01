/* eslint-disable */
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const categories = [
    {
        name: "Floral Aromas",
        description: "Soft, romantic scents that evoke blooming gardens in spring.",
        image: "https://images.unsplash.com/photo-1596433809252-260c27459d19?q=80&w=1964&auto=format&fit=crop",
        link: "/shop?category=floral"
    },
    {
        name: "Woody & Earthy",
        description: "Grounding fragrances of cedar, sandalwood, and fresh pine.",
        image: "https://images.unsplash.com/photo-1601379326920-5c4a5293dcb0?q=80&w=2070&auto=format&fit=crop",
        link: "/shop?category=woody"
    },
    {
        name: "Fresh & Citrus",
        description: "Uplifting notes of bergamot, lemon, and ocean breeze.",
        image: "https://images.unsplash.com/photo-1595425970377-c9703bc48baf?q=80&w=1974&auto=format&fit=crop",
        link: "/shop?category=fresh"
    }
];

const PopularCollection = () => {
    return (
        <section className="bg-white py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-serif text-charcoal mb-4"
                    >
                        Explore by Scent Profile
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-charcoal/70 font-light text-[17px]"
                    >
                        Find the perfect mood for your space.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="group relative h-[450px] md:h-[500px] w-full rounded-2xl overflow-hidden cursor-pointer"
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent pointer-events-none transition-opacity duration-500 group-hover:from-charcoal/90"></div>

                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <h3 className="text-2xl font-serif text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    {category.name}
                                </h3>
                                <p className="text-white/80 font-light text-[15px] mb-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
                                    {category.description}
                                </p>
                                <Link to={category.link} className="inline-flex w-max">
                                    <span className="text-white text-[11px] font-bold uppercase tracking-widest border-b border-white/30 pb-1 hover:border-white transition-colors duration-300">
                                        Explore Collection
                                    </span>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularCollection;
