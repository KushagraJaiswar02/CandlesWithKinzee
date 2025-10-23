// src/components/Header.jsx

import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

// We no longer need to import the PNG logo.

const Header = () => { 
    const [isOpen, setIsOpen] = useState(false);

    // Placeholder Icons (for visual structure without external libraries)
    const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
    const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
    const ShoppingCartIcon = () => '🛒';
    const UserIcon = () => '👤';

    // Base styles for navigation links
    const baseLinkStyle = 'px-3 py-2 text-charcoal font-medium hover:bg-beige transition duration-200 rounded-md';
    
    // Active style for NavLink
    const activeLinkStyle = ({ isActive }) => isActive 
        ? 'px-3 py-2 text-flame border-b-2 border-flame font-semibold' 
        : baseLinkStyle;

    return (
        <header className="bg-white shadow-md sticky top-0 z-50 border-b border-shadow/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    {/* LOGO AREA: Textual Logo with Elegant Font Style */}
                    <Link 
                        to="/" 
                        className="flex items-center space-x-1"
                    >
                        {/* KEY CHANGE: Uses a large, bold, font-serif style for elegance.
                          The 'K' and 'L' are highlighted using the 'flame' color for branding.
                        */}
                        <span className="text-4xl font-serif font-extrabold text-brown tracking-wide">
                            <span className="text-flame">K</span>indle<span className="text-flame">L</span>ight
                        </span>
                    </Link>

                    {/* Desktop Navigation Links (Hidden on Mobile) */}
                    <nav className="hidden md:flex items-center space-x-2 lg:space-x-6">
                        <NavLink to="/" className={activeLinkStyle}>Home</NavLink>
                        <NavLink to="/shop" className={activeLinkStyle}>Shop</NavLink>
                        <NavLink to="/profile" className={activeLinkStyle}>Account</NavLink>
                        <NavLink to="/admin" className={activeLinkStyle}>Admin</NavLink>
                    </nav>

                    {/* Right-Side Icons & CTAs (Desktop) */}
                    <div className="hidden md:flex items-center space-x-4">
                        
                        {/* Cart Button */}
                        <Link 
                            to="/cart" 
                            className="relative p-2 text-charcoal bg-beige rounded-full hover:bg-primary/50 transition duration-200"
                            title="Shopping Cart"
                        >
                            <ShoppingCartIcon />
                            {/* Cart Item Count */}
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 text-[10px] font-bold leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-flame rounded-full">
                                3
                            </span>
                        </Link>
                        
                        {/* Login CTA */}
                        <Link 
                            to="/login" 
                            className="flex items-center py-2 px-4 text-charcoal bg-primary font-semibold rounded-lg hover:bg-flame hover:text-white transition duration-200 shadow-md"
                        >
                            {UserIcon()} <span className="ml-1">Sign In</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button (Hidden on Desktop) */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setIsOpen(!isOpen)} 
                            className="p-2 text-brown hover:text-flame"
                        >
                            {isOpen ? <XIcon /> : <MenuIcon />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu (Conditionally Rendered) */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-shadow/50">
                    <div className="px-4 pt-2 pb-3 space-y-1 flex flex-col">
                        <Link to="/" className="block px-3 py-2 text-charcoal hover:bg-beige rounded-md font-medium" onClick={() => setIsOpen(false)}>Home</Link>
                        <Link to="/shop" className="block px-3 py-2 text-charcoal hover:bg-beige rounded-md font-medium" onClick={() => setIsOpen(false)}>Shop</Link>
                        
                        <div className="pt-2 border-t border-shadow space-y-2">
                            <Link to="/cart" className="flex items-center px-3 py-2 text-charcoal font-medium hover:bg-beige rounded-md" onClick={() => setIsOpen(false)}>
                                {ShoppingCartIcon()} <span className="ml-2">Cart (3)</span>
                            </Link>
                            <Link to="/login" className="flex items-center px-3 py-2 text-charcoal font-medium hover:bg-beige rounded-md" onClick={() => setIsOpen(false)}>
                                {UserIcon()} <span className="ml-2">Sign In / Register</span>
                            </Link>
                            <Link to="/admin" className="block px-3 py-2 text-charcoal font-medium border border-shadow rounded-md hover:bg-beige" onClick={() => setIsOpen(false)}>
                                Admin Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;