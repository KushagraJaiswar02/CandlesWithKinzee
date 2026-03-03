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
import Header from '../Header';

const SIDEBAR_GROUPS = [
    {
        title: "Control Center",
        items: [
            { name: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
            { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
        ]
    },
    {
        title: "Operations",
        items: [
            { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
            { name: 'Products', path: '/admin/products', icon: Package },
            { name: 'Inventory', path: '/admin/inventory', icon: Boxes },
            { name: 'Collections', path: '/admin/collections', icon: Layers },
        ]
    },
    {
        title: "Customers",
        items: [
            { name: 'Customers', path: '/admin/customers', icon: Users },
            { name: 'Promotions', path: '/admin/promotions', icon: Tag },
        ]
    },
    {
        title: "Configuration",
        items: [
            { name: 'Landing Page', path: '/admin/landing-page', icon: MonitorPlay },
            { name: 'Settings', path: '/admin/settings', icon: Settings },
        ]
    }
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
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col overflow-hidden font-sans">
            <SEO title="Admin Control Center" description="Business intelligence dashboard" robots="noindex" />
            <div className="flex-none">
                <Header isAdminPanel={true} />
            </div>

            <div className="flex-1 flex overflow-hidden relative">

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={cn(
                        "absolute lg:static inset-y-0 left-0 z-[60] w-64 bg-gray-900 border-r border-gray-800 shadow-none flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0",
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <div className="h-16 flex items-center px-6 border-b border-gray-800 shrink-0 justify-between lg:justify-start">
                        <span className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
                            Control<span className="text-amber-500 font-light">Center</span>
                        </span>
                        <button className="lg:hidden text-gray-400 hover:text-white transition-colors" onClick={() => setSidebarOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 custom-scrollbar">
                        {SIDEBAR_GROUPS.map((group) => (
                            <div key={group.title} className="px-3">
                                <h3 className="px-3 text-[11px] font-semibold tracking-wider text-gray-500 uppercase mb-2">
                                    {group.title}
                                </h3>
                                <div className="space-y-0.5">
                                    {group.items.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <NavLink
                                                key={item.path}
                                                to={item.path}
                                                end={item.exact}
                                                onClick={() => setSidebarOpen(false)}
                                                className={({ isActive }) =>
                                                    cn(
                                                        "flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-150",
                                                        isActive
                                                            ? "bg-gray-800 text-white border-l-[3px] border-amber-500"
                                                            : "text-gray-400 border-l-[3px] border-transparent hover:text-white hover:bg-gray-800"
                                                    )
                                                }
                                            >
                                                <Icon size={16} strokeWidth={2} />
                                                {item.name}
                                            </NavLink>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-gray-800 shrink-0">
                        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-white font-semibold">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-white font-medium text-[13px] truncate">{user?.name || 'Admin User'}</p>
                                <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors duration-150"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50">
                    {/* Top Header (Mobile & specific actions) */}
                    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shrink-0 relative z-20">
                        <div className="flex items-center gap-4 lg:hidden">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                <Menu size={24} />
                            </button>
                            <span className="text-[18px] font-semibold text-gray-900">Dashboard</span>
                        </div>

                        <div className="hidden lg:flex items-center gap-2 text-[13px] text-gray-500">
                            <span>Welcome back, <strong className="text-gray-900 font-medium">{user?.name?.split(' ')[0] || 'Admin'}</strong>.</span>
                            <span>All systems operational.</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-green-500" title="System Online"></div>
                        </div>
                    </header>

                    {/* Dynamic Nested Route Content */}
                    <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar">
                        <div className="max-w-[1400px] mx-auto space-y-10">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
