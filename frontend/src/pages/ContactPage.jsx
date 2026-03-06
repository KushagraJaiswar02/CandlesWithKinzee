import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import SEO from '../components/SEO';
import API_BASE_URL from '../config/api';

const DynamicIcon = ({ name, size = 24, className = '' }) => {
    const IconComponent = LucideIcons[name];
    if (!IconComponent) return <LucideIcons.Circle size={size} className={className} />;
    return <IconComponent size={size} className={className} />;
};

const ContactPage = () => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({ name: '', email: '', orderNumber: '', message: '' });
    const [formStatus, setFormStatus] = useState({ sending: false, success: false, error: '' });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/contact`);
                if (res.ok) {
                    const data = await res.json();
                    setConfig(data);
                }
            } catch (error) {
                console.error("Failed to fetch contact config", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus({ sending: true, success: false, error: '' });

        // Mocking email submission for now
        setTimeout(() => {
            setFormStatus({ sending: false, success: true, error: '' });
            setFormData({ name: '', email: '', orderNumber: '', message: '' });
            // reset success after 5s
            setTimeout(() => setFormStatus(prev => ({ ...prev, success: false })), 5000);
        }, 1500);
    };

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

    const { hero, instagramSection, contactOptions, contactForm, socialLinks, faq } = config;

    return (
        <div className="bg-[#FAFAFA] min-h-screen font-sans pb-20">
            <SEO title="Contact Us | KindleLight" description={hero.description || "Get in touch with us."} />

            {/* 1. Welcoming Hero */}
            <div className="bg-white border-b border-gray-100 pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-3xl text-center">
                    <span className="text-amber-600 font-medium text-[12px] tracking-widest uppercase mb-4 block">Here to help</span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 tracking-tight"
                    >
                        {hero.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-gray-500 text-lg leading-relaxed mb-10"
                    >
                        {hero.description}
                    </motion.p>
                    {hero.instagramCTAtext && hero.instagramLink && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                            <a href={hero.instagramLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all duration-300">
                                <LucideIcons.Instagram size={20} />
                                {hero.instagramCTAtext}
                            </a>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="container mx-auto max-w-6xl px-4 md:px-8 mt-16">

                {/* 2. Primary Instagram Accent Card */}
                {instagramSection && instagramSection.handle && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
                        className="bg-white rounded-3xl p-10 md:p-16 text-center border border-pink-100 shadow-sm relative overflow-hidden mb-16"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl opacity-60 pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center text-white mb-6 shadow-md rotate-3">
                                <LucideIcons.Instagram size={40} />
                            </div>
                            <h2 className="text-3xl font-serif text-gray-900 mb-2">{instagramSection.handle}</h2>
                            <p className="text-gray-500 text-lg max-w-xl mb-8 leading-relaxed">{instagramSection.description}</p>
                            <a href={instagramSection.link} target="_blank" rel="noopener noreferrer" className="bg-gray-900 text-white px-8 py-3.5 rounded-full font-medium hover:bg-gray-800 transition shadow-sm inline-flex items-center gap-2">
                                Open Instagram <LucideIcons.ExternalLink size={16} />
                            </a>
                        </div>
                    </motion.div>
                )}

                {/* 3. Split Layout: Form & Secondary Methods */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* Left side: Alternative Contact Cards */}
                    <div className="lg:col-span-5 space-y-6">
                        <h3 className="text-2xl font-serif text-gray-900 mb-6">Other ways to reach us</h3>

                        {(contactOptions.email || contactOptions.phone || contactOptions.whatsapp || contactOptions.businessHours) ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                                {contactOptions.email && (
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><LucideIcons.Mail size={20} /></div>
                                        <div>
                                            <div className="text-[13px] font-medium text-gray-400 uppercase tracking-wide mb-1">Email</div>
                                            <a href={`mailto:${contactOptions.email}`} className="text-gray-900 font-medium hover:text-amber-600 transition">{contactOptions.email}</a>
                                        </div>
                                    </div>
                                )}
                                {contactOptions.whatsapp && (
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0"><LucideIcons.MessageCircle size={20} /></div>
                                        <div>
                                            <div className="text-[13px] font-medium text-gray-400 uppercase tracking-wide mb-1">WhatsApp</div>
                                            <a href={`https://wa.me/${contactOptions.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-900 font-medium hover:text-amber-600 transition">{contactOptions.whatsapp}</a>
                                        </div>
                                    </div>
                                )}
                                {contactOptions.phone && (
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><LucideIcons.Phone size={20} /></div>
                                        <div>
                                            <div className="text-[13px] font-medium text-gray-400 uppercase tracking-wide mb-1">Phone</div>
                                            <a href={`tel:${contactOptions.phone}`} className="text-gray-900 font-medium hover:text-amber-600 transition">{contactOptions.phone}</a>
                                        </div>
                                    </div>
                                )}
                                {contactOptions.businessHours && (
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center shrink-0"><LucideIcons.Clock size={20} /></div>
                                        <div>
                                            <div className="text-[13px] font-medium text-gray-400 uppercase tracking-wide mb-1">Hours</div>
                                            <p className="text-gray-900 font-medium">{contactOptions.businessHours}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500">Please reach out to us via Instagram for all inquiries.</p>
                        )}

                        {/* Social Follow */}
                        <div className="pt-8">
                            <h4 className="text-[13px] font-medium text-gray-400 uppercase tracking-wide mb-4">Follow Along</h4>
                            <div className="flex gap-4">
                                {Object.entries(socialLinks).map(([platform, link]) => {
                                    if (!link) return null;
                                    const iconName = platform.charAt(0).toUpperCase() + platform.slice(1);
                                    return (
                                        <a key={platform} href={link} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-amber-600 hover:border-amber-200 hover:shadow-sm transition-all">
                                            <DynamicIcon name={iconName} size={20} />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right side: Optional Contact Form */}
                    {contactForm?.enabled && (
                        <div className="lg:col-span-7">
                            <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm relative overflow-hidden">
                                {formStatus.success ? (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-20 h-full">
                                        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                                            <LucideIcons.Check size={32} />
                                        </div>
                                        <h3 className="text-2xl font-serif text-gray-900 mb-2">Message Sent!</h3>
                                        <p className="text-gray-500">We'll get back to you to {formData.email || 'your email'} as soon as possible.</p>
                                    </motion.div>
                                ) : (
                                    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                        <h3 className="text-2xl font-serif text-gray-900 mb-6">Send an Email</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[13px] font-medium text-gray-600 mb-2">Name</label>
                                                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 transition" />
                                            </div>
                                            <div>
                                                <label className="block text-[13px] font-medium text-gray-600 mb-2">Email</label>
                                                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 transition" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-medium text-gray-600 mb-2">Order Number (Optional)</label>
                                            <input type="text" name="orderNumber" value={formData.orderNumber} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 transition" placeholder="#CWK-" />
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-medium text-gray-600 mb-2">Message</label>
                                            <textarea required name="message" value={formData.message} onChange={handleChange} rows="5" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 transition" placeholder="How can we help?" />
                                        </div>
                                        <button disabled={formStatus.sending} type="submit" className="w-full sm:w-auto bg-gray-900 text-white px-10 py-3.5 rounded-full font-medium hover:bg-amber-700 transition disabled:opacity-70 disabled:cursor-not-allowed">
                                            {formStatus.sending ? 'Sending...' : 'Send Message'}
                                        </button>
                                    </motion.form>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 4. FAQ Section */}
            {faq && faq.length > 0 && (
                <div className="container mx-auto max-w-3xl px-4 md:px-8 mt-32">
                    <div className="text-center mb-12">
                        <span className="text-amber-600 font-medium text-[12px] tracking-widest uppercase mb-4 block">Quick Answers</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-gray-900">Frequently Asked</h2>
                    </div>
                    <div className="space-y-4">
                        {faq.map((item, idx) => (
                            <FaqItem key={idx} question={item.question} answer={item.answer} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Extracted FAQ accordion component
const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-amber-100 transition-colors">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full px-6 py-5 flex items-center justify-between bg-white text-left focus:outline-none">
                <span className="font-medium text-gray-900">{question}</span>
                <LucideIcons.ChevronDown className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={20} />
            </button>
            <motion.div initial={false} animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }} className="overflow-hidden bg-gray-50/50">
                <div className="px-6 pb-5 pt-1 text-gray-600 leading-relaxed text-[15px]">
                    {answer}
                </div>
            </motion.div>
        </div>
    );
};

export default ContactPage;
