import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import SEO from '../components/SEO';
import API_BASE_URL from '../config/api';

const DynamicIcon = ({ name, size = 24, className = '' }) => {
    const IconComponent = LucideIcons[name];
    if (!IconComponent) return <LucideIcons.Heart size={size} className={className} />;
    return <IconComponent size={size} className={className} />;
};

const AboutPage = () => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/about`);
                if (res.ok) {
                    const data = await res.json();
                    setConfig(data);
                }
            } catch (error) {
                console.error("Failed to fetch about config", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA]">
                <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!config) {
        return <div className="min-h-screen flex items-center justify-center text-gray-400">Content not available</div>;
    }

    const { hero, story, craftFeatures, values, founder, socialLinks, ctaSection } = config;

    return (
        <div className="bg-[#FAFAFA] min-h-screen font-sans overflow-hidden">
            <SEO title="About Us | KindleLight" description={hero.subtitle || "Learn about our brand story and craftsmanship."} />

            {/* 1. Hero Section */}
            <div className="relative pt-32 pb-24 px-4 md:px-8 bg-white border-b border-gray-100 overflow-hidden">
                {hero.image && (
                    <div className="absolute inset-0 z-0">
                        <img src={hero.image} alt={hero.title} className="w-full h-full object-cover opacity-10" />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white/95"></div>
                    </div>
                )}
                <div className="container mx-auto max-w-4xl text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-gray-900 mb-6 tracking-tight leading-[1.1]">{hero.title}</h1>
                        <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">{hero.subtitle}</p>
                        {hero.ctaText && (
                            <Link to={hero.ctaLink || '/shop'} className="inline-block bg-gray-900 text-white px-8 py-3.5 rounded-full font-medium hover:bg-amber-700 transition-colors duration-300">
                                {hero.ctaText}
                            </Link>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* 2. Our Story */}
            <div className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                        {story.image ? (
                            <img src={story.image} alt={story.title} className="w-full h-[600px] object-cover rounded-2xl shadow-sm" />
                        ) : (
                            <div className="w-full h-[600px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300">No Image</div>
                        )}
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                        <span className="text-amber-600 font-medium text-[12px] tracking-widest uppercase mb-4 block">Origin</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">{story.title}</h2>
                        <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-line">
                            {story.content}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* 3. Craftsmanship */}
            {craftFeatures && craftFeatures.length > 0 && (
                <div className="py-24 bg-white border-y border-gray-100 px-4 md:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="text-amber-600 font-medium text-[12px] tracking-widest uppercase mb-4 block">Process</span>
                            <h2 className="text-3xl md:text-4xl font-serif text-gray-900">Craftsmanship</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                            {craftFeatures.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.1 }} viewport={{ once: true }}
                                    className="text-center"
                                >
                                    <div className="w-16 h-16 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-6 text-amber-600">
                                        <DynamicIcon name={feature.icon} size={28} />
                                    </div>
                                    <h3 className="text-[17px] font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-500 leading-relaxed text-[15px]">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 4. Brand Values */}
            {values && values.length > 0 && (
                <div className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-1">
                            <span className="text-amber-600 font-medium text-[12px] tracking-widest uppercase mb-4 block">Philosophy</span>
                            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">Our Values</h2>
                            <p className="text-gray-500 text-lg leading-relaxed">
                                The principles that guide every pour, package, and promise we make to you.
                            </p>
                        </div>
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-10">
                            {values.map((val, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.1 }} viewport={{ once: true }}
                                    className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm"
                                >
                                    <DynamicIcon name={val.icon} size={24} className="text-amber-500 mb-5" />
                                    <h3 className="text-[17px] font-bold text-gray-900 mb-3">{val.title}</h3>
                                    <p className="text-gray-500 leading-relaxed text-[15px]">{val.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 5. Founder Section */}
            {founder && founder.name && (
                <div className="py-20 px-4 md:px-8 bg-[#F5F2EF]">
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl p-10 md:p-16 shadow-sm border border-[#EBE6E0] flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                        {founder.image && (
                            <div className="shrink-0">
                                <img src={founder.image} alt={founder.name} className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-full shadow-md" />
                            </div>
                        )}
                        <div>
                            <span className="text-amber-600 font-medium text-[12px] tracking-widest uppercase mb-4 block">The Founder</span>
                            <h2 className="text-3xl font-serif text-gray-900 mb-4">{founder.name}</h2>
                            <p className="text-gray-600 text-lg leading-relaxed italic">
                                "{founder.description}"
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 6. Social Links (Minimal display) */}
            <div className="py-16 text-center border-t border-gray-200 px-4">
                <h3 className="text-gray-500 text-sm tracking-widest uppercase mb-8">Join Our Community</h3>
                <div className="flex justify-center gap-6">
                    {socialLinks && Object.entries(socialLinks).map(([platform, link]) => {
                        if (!link) return null;
                        const iconName = platform.charAt(0).toUpperCase() + platform.slice(1);
                        return (
                            <a key={platform} href={link} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-amber-600 hover:border-amber-200 transition-colors shadow-sm">
                                <DynamicIcon name={iconName} size={20} />
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* 7. Final CTA */}
            {ctaSection && ctaSection.title && (
                <div className="py-24 px-4 text-center bg-gray-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">{ctaSection.title}</h2>
                        <Link to={ctaSection.buttonLink || '/shop'} className="inline-block bg-white text-gray-900 px-10 py-4 rounded-full font-bold hover:bg-amber-500 hover:text-white transition-colors duration-300 tracking-wide text-[15px]">
                            {ctaSection.buttonText}
                        </Link>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AboutPage;
