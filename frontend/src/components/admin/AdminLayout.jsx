import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BarChart3,
    ShoppingCart,
    Package,
    Layers,
    Boxes,
    Users,
    Tag,
    MonitorPlay,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { cn } from '../../utils/cn';
import AuthContext from '../../context/AuthContext';
import SEO from '../SEO';

const NAV_ITEMS = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Collections', path: '/admin/collections', icon: Layers },
    { name: 'Inventory', path: '/admin/inventory', icon: Boxes },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Promotions', path: '/admin/promotions', icon: Tag },
    { name: 'Landing Page', path: '/admin/landing-page', icon: MonitorPlay },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
];

const AdminLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { logout, user } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#111111] text-gray-200 flex overflow-hidden font-sans">
            <SEO title="Admin Control Center" description="Business intelligence dashboard" robots="noindex" />

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1A1A1A] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0 justify-between lg:justify-start">
                    <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        Control<span className="text-[#FF9F1C] font-light">Center</span>
                    </span>
                    <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 custom-scrollbar">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.exact}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-[#FF9F1C]/10 text-[#FF9F1C]"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )
                                }
                            >
                                <Icon size={18} strokeWidth={2} />
                                {item.name}
                            </NavLink>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-white/5 shrink-0">
                    <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 mb-2">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-white font-medium truncate">{user?.name || 'Admin User'}</p>
                            <p className="text-xs truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Top Header (Mobile & specific actions) */}
                <header className="h-16 bg-[#1A1A1A]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 lg:px-8 shrink-0">
                    <div className="flex items-center gap-4 lg:hidden">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <span className="text-lg font-bold text-white">Dashboard</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-2 text-sm text-gray-400">
                        <span>Welcome back, <strong className="text-white">{user?.name?.split(' ')[0] || 'Admin'}</strong>.</span>
                        <span>All systems operational.</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Future global search or notifications could go here */}
                        <div className="w-2h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" title="System Online"></div>
                    </div>
                </header>

                {/* Dynamic Nested Route Content */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
