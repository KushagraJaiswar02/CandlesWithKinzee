/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { useCart } from '../context/CartContext';

import candleLogo from '../assets/CANDLE.png';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = React.useContext(AuthContext);
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const { scrollY } = useScroll();

    useEffect(() => {
        return scrollY.onChange((latest) => {
            setScrolled(latest > 50);
        });
    }, [scrollY]);

    // Icons
    const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
    const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
    const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
    const ShoppingCartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
    const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/shop', label: 'Shop' },
        { path: '/collections', label: 'Collections' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
    ];

    return (
        <motion.header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out px-4 sm:px-8 
                ${scrolled ? 'bg-beige/90 backdrop-blur-md shadow-sm border-b border-black/5 py-4' : 'bg-transparent py-6'}`}
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* 1. Logo (Left) */}
                <Link to="/" className="group z-50 flex items-center gap-3">
                    <span className="text-xl md:text-2xl font-serif font-bold tracking-tight text-charcoal">
                        Candle<span className="font-light text-flame">WithKinzee</span>
                    </span>
                </Link>

                {/* 2. Desktop Navigation (Center) */}
                <nav className="hidden md:flex items-center space-x-10 absolute left-1/2 transform -translate-x-1/2">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `text-[13px] font-medium tracking-widest uppercase transition-all duration-300 relative group text-charcoal hover:text-flame ${isActive ? 'font-bold' : ''}`
                            }
                        >
                            {({ isActive: isCurrent }) => (
                                <>
                                    {link.label}
                                    <span className={`absolute -bottom-1.5 left-0 h-[1.5px] transition-all duration-300 group-hover:w-full bg-flame ${isCurrent ? 'w-full' : 'w-0'}`}></span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* 3. Action Icons (Right) */}
                <div className="hidden md:flex items-center space-x-6 text-charcoal">
                    <button className="hover:text-flame transition-colors opacity-80 hover:opacity-100" title="Search">
                        <SearchIcon />
                    </button>
                    <Link to="/cart" className="relative hover:text-flame transition-colors opacity-80 hover:opacity-100" title="Cart">
                        <ShoppingCartIcon />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-flame text-[9px] text-white font-bold shadow-sm">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <Link to={user ? "/profile" : "/login"} className="hover:text-flame transition-colors opacity-80 hover:opacity-100" title="Profile">
                        <UserIcon />
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden z-50 flex items-center gap-5 text-charcoal">
                    <Link to="/cart" className="relative hover:text-flame transition-colors">
                        <ShoppingCartIcon />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-flame text-[9px] text-white font-bold">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <button onClick={() => setIsOpen(!isOpen)} className="hover:text-flame transition-colors">
                        {isOpen ? <XIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-black/5 py-6 px-6 flex flex-col space-y-5 md:hidden"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-sm font-medium tracking-widest uppercase text-charcoal"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <hr className="border-black/5" />
                        <Link to={user ? "/profile" : "/login"} className="text-sm font-medium tracking-widest uppercase text-charcoal flex items-center gap-3" onClick={() => setIsOpen(false)}>
                            <UserIcon /> {user ? 'My Profile' : 'Sign In'}
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default Header;