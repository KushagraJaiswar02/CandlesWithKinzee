import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Page Imports
import HomePage from '../pages/HomePage';
import ProductListingPage from '../pages/ProductListing';
import ProductDetailPage from '../pages/ProductDetails';
import CartPage from '../pages/CartPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegistrationPage';
import ProfilePage from '../pages/AccountPage';
import AdminDashboard from '../pages/AdminPage';
import CheckoutPage from '../pages/CheckOutpage';
import NotFound from '../pages/NotFound';

// Wrapper for consistent page transitions
const PageTransition = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
};

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
                <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
                <Route path="/shop" element={<PageTransition><ProductListingPage /></PageTransition>} />
                <Route path="/product/:id" element={<PageTransition><ProductDetailPage /></PageTransition>} />
                <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
                <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
                {/* AdminPage handles its own specific transitions, but we can wrap it too for consistency if desired. 
                    However, keeping it consistent with the global transition is better. */}
                <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
                <Route path="/checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;
