// src/ProfilePage.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO.jsx';

// Placeholder icons (using emojis for simplicity and aesthetic fit)
const ProfileIcon = () => '👤';
const OrdersIcon = () => '📦';
const AddressIcon = () => '🏠';
const SettingsIcon = () => '⚙️';

const ProfilePage = () => {
    // State to manage which section (tab) is currently active
    const [activeSection, setActiveSection] = useState('orders');

    // Framer Motion variant for page entry
    const pageVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    // --- Content Components for each section ---

    const OrderHistory = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-charcoal">Your Recent Orders</h2>
            <p className="text-shadow italic">Keep track of your purchases.</p>

            {/* Order Card Placeholder 1 */}
            <div className="p-4 bg-beige rounded-lg border border-shadow/50 shadow-sm">
                <p className="font-semibold text-brown">Order #KL-905284</p>
                <p className="text-sm text-charcoal">Status: Delivered (Oct 15, 2025)</p>
                <p className="text-lg font-bold text-flame">$55.98</p>
                <button className="text-primary hover:text-brown text-sm mt-2 underline">View Details</button>
            </div>

            {/* Order Card Placeholder 2 */}
            <div className="p-4 bg-beige rounded-lg border border-shadow/50 shadow-sm">
                <p className="font-semibold text-brown">Order #KL-905101</p>
                <p className="text-sm text-charcoal">Status: In Transit (Oct 20, 2025)</p>
                <p className="text-lg font-bold text-flame">$34.00</p>
                <button className="text-primary hover:text-brown text-sm mt-2 underline">Track Shipment</button>
            </div>
        </div>
    );

    const ProfileDetails = () => (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-charcoal">Personal Information</h2>
            <p className="text-shadow italic">Manage your contact details and password (Password hashing protects this).</p>

            <div className="p-4 bg-beige rounded-lg border border-shadow/50">
                <p className="font-semibold text-brown">Name: Jane Doe</p>
                <p className="text-sm text-charcoal">Email: jane.doe@example.com</p>
            </div>
            <button className="py-2 px-4 bg-primary text-charcoal rounded-lg hover:bg-flame hover:text-white transition">
                Edit Details
            </button>
        </div>
    );

    const Addresses = () => (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-charcoal">Shipping Addresses</h2>
            <p className="text-shadow italic">For fast and easy checkout (Location tracking helps here).</p>

            <div className="p-4 bg-beige rounded-lg border border-shadow/50">
                <p className="font-semibold text-brown">Home:</p>
                <p className="text-sm text-charcoal">123 Candlelight Lane, Cityville, 45678</p>
            </div>
            <button className="py-2 px-4 bg-flame text-white rounded-lg hover:bg-brown transition">
                Add New Address
            </button>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'profile': return <ProfileDetails />;
            case 'addresses': return <Addresses />;
            case 'orders':
            default: return <OrderHistory />;
        }
    };

    const NavButton = ({ section, icon, label }) => (
        <button
            onClick={() => setActiveSection(section)}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg font-medium transition duration-200 
                ${activeSection === section
                    ? 'bg-flame text-white shadow-md'
                    : 'text-charcoal hover:bg-beige hover:text-brown'
                }`
            }
        >
            <span className="text-xl">{icon}</span>
            <span>{label}</span>
        </button>
    );

    return (
        <motion.div
            className="min-h-screen bg-beige p-4 md:p-12"
            variants={pageVariants}
            initial="initial"
            animate="animate"
        >
            <SEO title="My Account" description="Manage your CandlesWithKinzee profile and orders." />
            <div className="container mx-auto">
                <h1 className="text-4xl font-extrabold text-brown mb-8 text-center md:text-left">
                    My Account {ProfileIcon()}
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* 1. Sidebar Navigation */}
                    <div className="lg:w-1/4 bg-white p-6 rounded-xl shadow-xl border border-shadow/50 h-fit">
                        <h2 className="text-xl font-bold text-brown mb-4">Dashboard</h2>
                        <nav className="space-y-2">
                            <NavButton section="orders" icon={OrdersIcon()} label="My Orders" />
                            <NavButton section="profile" icon={ProfileIcon()} label="Profile Details" />
                            <NavButton section="addresses" icon={AddressIcon()} label="Addresses" />
                            <NavButton section="settings" icon={SettingsIcon()} label="Settings" />
                        </nav>
                    </div>

                    {/* 2. Main Content Area */}
                    <motion.div
                        key={activeSection} // Key change ensures Framer Motion re-animates content on tab switch
                        className="lg:w-3/4 bg-white p-8 rounded-xl shadow-xl border border-shadow/50"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {renderContent()}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfilePage;