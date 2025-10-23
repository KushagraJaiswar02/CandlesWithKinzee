// src/AdminDashboard.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Placeholder Icons (using emojis and simple text)
const DashboardIcon = () => '📊';
const ProductsIcon = () => '🕯️';
const OrdersIcon = () => '📦';
const UsersIcon = () => '👤';
const SettingsIcon = () => '⚙️';

const AdminDashboard = () => {
    // State to manage which admin section is currently active
    const [activeSection, setActiveSection] = useState('dashboard');

    // Framer Motion variant for page entry
    const pageVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.5 } }
    };

    // --- Content Components for Admin Sections ---

    const DashboardOverview = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Overview & Analytics</h2>
            <p className="text-flicker italic">Key metrics for managing the candle business.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-brown/50 rounded-lg shadow-xl">
                    <p className="text-flicker">Total Sales (Placeholder)</p>
                    <p className="text-4xl font-extrabold text-white">$15,450</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-brown/50 rounded-lg shadow-xl">
                    <p className="text-flicker">New Orders</p>
                    <p className="text-4xl font-extrabold text-white">12</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-brown/50 rounded-lg shadow-xl">
                    <p className="text-flicker">Low Stock Items</p>
                    <p className="text-4xl font-extrabold text-flame">4</p>
                </motion.div>
            </div>
            <p className="text-sm text-shadow pt-4 border-t border-shadow/50">Admin-level authorization is required for sensitive operations[cite: 38].</p>
        </div>
    );

    const ProductManagement = () => (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Product Management</h2>
            <p className="text-flicker italic">Manage images, categories, and stock[cite: 10].</p>
            
            <div className="p-6 bg-brown/30 rounded-lg space-y-3">
                <p className="font-semibold text-white">Current Inventory (35 Unique Products)</p>
                <button className="py-2 px-4 bg-primary text-charcoal rounded-lg hover:bg-flame hover:text-white transition">
                    Add New Product
                </button>
            </div>
            
            {/* Table/List Placeholder */}
            <div className="h-40 p-4 bg-brown/20 rounded-lg flex items-center justify-center text-shadow">
                Product List Table Placeholder (Name, Stock, Price, Actions)
            </div>
        </div>
    );

    const OrderManagement = () => (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Order Management</h2>
            <p className="text-flicker italic">View, process, and track customer orders.</p>
            
            {/* Order Filter/Search Placeholder */}
            <div className="h-20 p-4 bg-brown/30 rounded-lg flex items-center justify-center text-white">
                Filter by Status (Pending, Shipped, Delivered)
            </div>
            
            {/* Order List Placeholder */}
            <div className="h-40 p-4 bg-brown/20 rounded-lg flex items-center justify-center text-shadow">
                Order History Table Placeholder
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'products': return <ProductManagement />;
            case 'orders': return <OrderManagement />;
            case 'dashboard': 
            default: return <DashboardOverview />;
        }
    };

    const NavButton = ({ section, icon, label }) => (
        <motion.button
            onClick={() => setActiveSection(section)}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg font-medium transition duration-200 
                ${activeSection === section 
                    ? 'bg-primary text-charcoal shadow-md' 
                    : 'text-flicker hover:bg-brown/50 hover:text-white'
                }`
            }
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <span className="text-xl">{icon}</span>
            <span>{label}</span>
        </motion.button>
    );

    return (
        <motion.div 
            className="min-h-screen bg-charcoal p-4 md:p-12"
            variants={pageVariants}
            initial="initial"
            animate="animate"
        >
            <div className="container mx-auto">
                <h1 className="text-4xl font-extrabold text-primary mb-8 text-center md:text-left">
                    Admin Dashboard
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* 1. Sidebar Navigation */}
                    <div className="lg:w-1/4 bg-charcoal/80 p-6 rounded-xl shadow-2xl border border-brown/50 h-fit">
                        <h2 className="text-xl font-bold text-white mb-4 border-b border-brown/50 pb-3">Management</h2>
                        <nav className="space-y-2">
                            <NavButton section="dashboard" icon={DashboardIcon()} label="Dashboard" />
                            <NavButton section="products" icon={ProductsIcon()} label="Products" />
                            <NavButton section="orders" icon={OrdersIcon()} label="Orders" />
                            <NavButton section="users" icon={UsersIcon()} label="Users" />
                            <NavButton section="settings" icon={SettingsIcon()} label="Settings" />
                        </nav>
                    </div>
                    
                    {/* 2. Main Content Area */}
                    <motion.div 
                        key={activeSection} // Key ensures re-animation on tab switch
                        className="lg:w-3/4 bg-charcoal/80 p-8 rounded-xl shadow-2xl border border-brown/50"
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

export default AdminDashboard;