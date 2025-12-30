import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO.jsx';

// --- Icons (Inline SVGs for Premium Feel) ---
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const ProductIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const OrderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>; // Same as product for now, or use box
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');

    // --- Dummy Data ---
    const [products, setProducts] = useState([
        { id: 1, name: 'Lavender Bliss', price: 24.99, stock: 12, category: 'Aromatherapy' },
        { id: 2, name: 'Vanilla Bean', price: 22.50, stock: 45, category: 'Scented' },
        { id: 3, name: 'Ocean Breeze', price: 26.00, stock: 2, category: 'Fresh' },
        { id: 4, name: 'Sandalwood', price: 28.00, stock: 0, category: 'Woody' },
    ]);

    const [orders, setOrders] = useState([
        { id: '#ORD-001', customer: 'Alice Smith', total: 49.98, status: 'Shipped', date: '2023-11-20' },
        { id: '#ORD-002', customer: 'Bob Jones', total: 22.50, status: 'Pending', date: '2023-11-21' },
        { id: '#ORD-003', customer: 'Charlie Brown', total: 78.00, status: 'Delivered', date: '2023-11-18' },
    ]);

    const users = [
        { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Customer', joined: 'Oct 2023' },
        { id: 2, name: 'Admin User', email: 'admin@candles.com', role: 'Admin', joined: 'Sep 2023' },
        { id: 3, name: 'Bob Jones', email: 'bob@test.com', role: 'Customer', joined: 'Nov 2023' },
    ];

    // --- Form State ---
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '' });

    const handleAddProduct = (e) => {
        e.preventDefault();
        const product = {
            id: products.length + 1,
            name: newProduct.name,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock),
            category: newProduct.category
        };
        setProducts([...products, product]);
        setNewProduct({ name: '', price: '', stock: '', category: '' });
        alert("Product Added Successfully!");
    };

    const handleDeleteProduct = (id) => {
        setProducts(products.filter(p => p.id !== id));
    };

    // --- Sub-components ---

    const StatsCard = ({ title, value, color, flicker }) => (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className={`p-6 bg-white rounded-xl shadow-lg border-l-4 ${color}`}
        >
            <p className="text-charcoal/70 font-medium text-sm uppercase tracking-wider">{title}</p>
            <p className={`text-3xl font-bold text-charcoal mt-2 ${flicker ? 'animate-pulse' : ''}`}>{value}</p>
        </motion.div>
    );

    const DashboardHome = () => (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-6">Dashboard Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Revenue" value="$12,450" color="border-green-500" />
                <StatsCard title="Total Orders" value={orders.length} color="border-blue-500" />
                <StatsCard title="Total Users" value={users.length} color="border-purple-500" />
                <StatsCard title="Low Stock Alerts" value={products.filter(p => p.stock < 5).length} color="border-red-500" flicker={true} />
            </div>

            {/* User Interactions Graph (Visual Simulation) */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-brown mb-4">User Interactions (Last 7 Days)</h3>
                <div className="flex items-end space-x-4 h-40 border-b border-shadow pb-2">
                    {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center group">
                            <div
                                className="w-full bg-primary/40 rounded-t-lg group-hover:bg-flame transition-all duration-300"
                                style={{ height: `${h}%` }}
                            ></div>
                            <span className="text-xs text-charcoal mt-2">day {i + 1}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const ProductSection = () => (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Product Management</h2>

            {/* Add Product Form */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-brown mb-4">Add New Product</h3>
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text" placeholder="Product Name" required
                        className="p-3 border border-shadow rounded-lg"
                        value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                    <input
                        type="text" placeholder="Category" required
                        className="p-3 border border-shadow rounded-lg"
                        value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    />
                    <input
                        type="number" placeholder="Price ($)" required
                        className="p-3 border border-shadow rounded-lg"
                        value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                    <input
                        type="number" placeholder="Stock Quantity" required
                        className="p-3 border border-shadow rounded-lg"
                        value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                    />
                    <button type="submit" className="md:col-span-2 py-3 bg-flame text-white font-bold rounded-lg hover:bg-brown transition">
                        Add Product
                    </button>
                </form>
            </div>

            {/* Stock Table */}
            <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
                <h3 className="text-xl font-bold text-brown mb-4">Current Stock & Inventory</h3>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-shadow/30 text-charcoal/70 text-sm">
                            <th className="p-3">ID</th>
                            <th className="p-3">Product Name</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b border-shadow/10 hover:bg-beige/30 transition">
                                <td className="p-3 font-mono text-sm">{product.id}</td>
                                <td className="p-3 font-semibold text-charcoal">{product.name}</td>
                                <td className="p-3 text-sm">{product.category}</td>
                                <td className="p-3">${product.price.toFixed(2)}</td>
                                <td className={`p-3 font-bold ${product.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>
                                    {product.stock} {product.stock === 0 && '(Out of Stock)'}
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="text-red-500 hover:text-red-700 transition"
                                        title="Delete"
                                    >
                                        <TrashIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const OrderSection = () => (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Order Information</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-primary/20 text-charcoal text-sm">
                            <th className="p-3 rounded-tl-lg">Order ID</th>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Total</th>
                            <th className="p-3 rounded-tr-lg">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, i) => (
                            <tr key={i} className="border-b border-shadow/10">
                                <td className="p-3 font-mono text-flame">{order.id}</td>
                                <td className="p-3">{order.customer}</td>
                                <td className="p-3 text-sm text-charcoal/70">{order.date}</td>
                                <td className="p-3 font-bold">${order.total.toFixed(2)}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold 
                                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-blue-100 text-blue-700'}`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const UserSection = () => (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Official Users</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.map(user => (
                    <div key={user.id} className="bg-white p-4 rounded-xl shadow flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/30 rounded-full flex items-center justify-center text-flame font-bold text-xl">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-charcoal">{user.name}</p>
                            <p className="text-sm text-charcoal/70">{user.email}</p>
                            <p className="text-xs text-shadow uppercase mt-1">{user.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // --- Render Helper ---
    const renderContent = () => {
        switch (activeSection) {
            case 'products': return <ProductSection />;
            case 'orders': return <OrderSection />;
            case 'users': return <UserSection />;
            default: return <DashboardHome />;
        }
    };

    return (
        <div className="min-h-screen bg-charcoal flex flex-col md:flex-row font-sans">
            <SEO title="Admin Dashboard" description="Admin dashboard for CandlesWithKinzee." robots="noindex, nofollow" />

            {/* Sidebar */}
            <nav className="w-full md:w-64 bg-brown/90 text-white p-6 flex-shrink-0">
                <h1 className="text-2xl font-serif font-bold mb-8 tracking-wider text-primary">AdminPanel</h1>
                <ul className="space-y-2">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
                        { id: 'products', label: 'Products', icon: ProductIcon },
                        { id: 'orders', label: 'Orders', icon: OrderIcon },
                        { id: 'users', label: 'Users', icon: UserIcon },
                    ].map(item => (
                        <li key={item.id}>
                            <button
                                onClick={() => setActiveSection(item.id)}
                                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition duration-200 
                                    ${activeSection === item.id ? 'bg-flame text-white shadow-lg' : 'hover:bg-white/10'}`}
                            >
                                <item.icon />
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Main Content */}
            <main className="flex-grow p-6 md:p-10 overflow-y-auto">
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderContent()}
                </motion.div>
            </main>
        </div>
    );
};

export default AdminDashboard;