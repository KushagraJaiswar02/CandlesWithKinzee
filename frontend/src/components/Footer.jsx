import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-beige text-charcoal py-20 border-t border-borderSubtle">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-16">

                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="mb-6 flex items-center gap-3">
                            <span className="text-2xl font-serif font-bold tracking-tight">
                                Candle<span className="font-light text-flame">WithKinzee</span>
                            </span>
                        </Link>
                        <p className="text-[13px] font-light leading-relaxed text-charcoal/70 mb-8 max-w-xs">
                            Handcrafted, small-batch soy candles designed to elevate your everyday moments with elegant fragrances.
                        </p>
                        <div className="flex space-x-6">
                            {['Instagram', 'Pinterest', 'TikTok'].map(social => (
                                <a key={social} href="#" className="text-[11px] font-bold uppercase tracking-widest hover:text-flame transition-colors duration-300">
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div className="md:col-span-1 md:ml-auto">
                        <h4 className="font-serif text-[17px] mb-6">Shop</h4>
                        <ul className="space-y-4 text-[13px] font-light">
                            <li><Link to="/shop" className="text-charcoal/70 hover:text-flame transition-colors">All Candles</Link></li>
                            <li><Link to="/collections" className="text-charcoal/70 hover:text-flame transition-colors">Collections</Link></li>
                            <li><Link to="/shop?category=gift" className="text-charcoal/70 hover:text-flame transition-colors">Gift Sets</Link></li>
                        </ul>
                    </div>

                    {/* About Links */}
                    <div className="md:col-span-1 md:ml-auto">
                        <h4 className="font-serif text-[17px] mb-6">About</h4>
                        <ul className="space-y-4 text-[13px] font-light">
                            <li><Link to="/about" className="text-charcoal/70 hover:text-flame transition-colors">Our Story</Link></li>
                            <li><Link to="/materials" className="text-charcoal/70 hover:text-flame transition-colors">Materials</Link></li>
                            <li><Link to="/faq" className="text-charcoal/70 hover:text-flame transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-1 md:ml-auto">
                        <h4 className="font-serif text-[17px] mb-6">Contact</h4>
                        <ul className="space-y-4 text-[13px] font-light">
                            <li className="text-charcoal/70">hello@candlewithkinzee.com</li>
                            <li className="text-charcoal/70">+1 (555) 123-4567</li>
                            <li className="text-charcoal/70 mt-4 leading-relaxed">
                                123 Artisan Way<br />
                                Brooklyn, NY 11201
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-charcoal/50">
                    <p>&copy; {new Date().getFullYear()} CandleWithKinzee. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link to="/privacy" className="hover:text-flame transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-flame transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
