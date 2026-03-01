import React from 'react';
import { Link } from 'react-router-dom';
import candleLogo from '../assets/CANDLE.png';

export default function Footer() {
    const footerSections = [
        {
            title: "Shop",
            links: [
                { label: "All Candles", to: "/shop" },
                { label: "Gift Sets", to: "/shop?category=gift" },
                { label: "Wax Melts", to: "/shop?type=melts" },
                { label: "Aromatherapy", to: "/shop?category=aromatherapy" },
            ]
        },
        {
            title: "About Us",
            links: [
                { label: "Our Story", to: "#" },
                { label: "Ethical Sourcing", to: "#" },
                { label: "In the Press", to: "#" },
                { label: "Careers", to: "#" },
            ]
        },
        {
            title: "Support",
            links: [
                { label: "FAQ", to: "#" },
                { label: "Shipping & Returns", to: "#" },
                { label: "T&Cs", to: "#" },
                { label: "Contact Us", to: "#" },
            ]
        }
    ];

    return (
        <footer className="bg-charcoal text-beige py-16">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    
                    {/* Brand & Newsletter (Takes up more space) */}
                    <div className="lg:col-span-2 flex flex-col items-start">
                        <Link to="/" className="mb-6 flex items-center gap-3 group">
                            <img src={candleLogo} alt="Logo" className="h-10 w-10 rounded-full object-cover brightness-0 invert opacity-90 transition-transform group-hover:scale-105" />
                            <span className="text-2xl font-serif font-bold text-white tracking-tight">
                                CandlesWith<span className="font-light">Kinzee</span>
                            </span>
                        </Link>

                        <p className="text-sm font-light leading-relaxed mb-6 text-beige/70 max-w-sm">
                            Discover the art of slow living with our small-batch, sustainably sourced soy candles. Handcrafted for comfort.
                        </p>

                        <div className="w-full max-w-sm">
                            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Join the Inner Circle</p>
                            <div className="flex w-full relative">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="w-full bg-transparent border-b border-white/20 pb-2 text-beige focus:outline-none focus:border-primary transition-colors text-sm placeholder-beige/40"
                                />
                                <button className="absolute right-0 bottom-2 text-primary text-sm font-semibold hover:text-white transition-colors uppercase tracking-wider">
                                    Join
                                </button>
                            </div>
                        </div>

                        <div className='flex space-x-5 mt-8'>
                            {['Instagram', 'Twitter', 'Facebook'].map(social => (
                                <a key={social} href='#' className='text-beige/50 hover:text-primary transition-colors duration-300 text-sm'>
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    {footerSections.map((section, idx) => (
                        <div key={idx} className="lg:col-span-1">
                            <h4 className="text-white font-serif text-lg mb-6">{section.title}</h4>
                            <ul className="space-y-4 text-sm font-light">
                                {section.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <Link to={link.to} className="text-beige/70 hover:text-white transition-colors duration-300 inline-block">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-beige/50 font-light">
                    <p>&copy; {new Date().getFullYear()} CandlesWithKinzee. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
