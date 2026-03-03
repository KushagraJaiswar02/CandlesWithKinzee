import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign,
    ShoppingBag,
    TrendingUp,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import AuthContext from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';

const StatCard = ({ title, value, icon: Icon, isAlert, tooltip }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-7 shadow-sm transition-shadow duration-150 hover:shadow group relative">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg transition-colors duration-150 ${isAlert ? 'bg-red-50 text-red-600 group-hover:bg-red-100' : 'bg-gray-50 text-gray-500 group-hover:text-gray-900 group-hover:bg-gray-100'}`}>
                <Icon size={22} />
            </div>
            {tooltip && (
                <div className="group/tooltip relative">
                    <AlertCircle size={16} className="text-gray-400 cursor-help" />
                    <div className="absolute right-0 w-48 p-2 mt-2 text-[12px] bg-gray-900 text-white rounded-md opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-150 z-20">
                        {tooltip}
                        <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                    </div>
                </div>
            )}
        </div>
        <div>
            <h3 className="text-gray-500 text-[14px] font-medium mb-1">{title}</h3>
            <div className={`text-[28px] font-bold tracking-tight ${isAlert ? 'text-red-600' : 'text-gray-900'}`}>
                {value}
            </div>
        </div>
    </div>
);

const DashboardOverview = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ revenue: 0, ordersCount: 0, usersCount: 0, lowStock: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = { Authorization: `Bearer ${user.token}` };

                // Fetch real stats
                const [statsRes, ordersRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/admin/stats`, { headers }),
                    fetch(`${API_BASE_URL}/api/orders`, { headers }),
                ]);

                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setStats({
                        revenue: data.totalRevenue || 0,
                        ordersCount: data.totalOrders || 0,
                        usersCount: data.totalUsers || 0,
                        lowStock: data.lowStockProducts || 0,
                    });
                }

                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    // Sort by newest first, take top 5
                    const sorted = [...ordersData].sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    setRecentOrders(sorted.slice(0, 5));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.token]);

    // Build a simple chart from recent orders grouped by date
    const chartData = (() => {
        if (recentOrders.length === 0) return [];
        const map = {};
        recentOrders.forEach(o => {
            const d = new Date(o.createdAt).toLocaleDateString('en-IN', { weekday: 'short' });
            map[d] = (map[d] || 0) + (o.totalPrice || 0);
        });
        return Object.entries(map).map(([name, revenue]) => ({ name, revenue }));
    })();

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight">System Overview</h1>
                    <p className="text-gray-500 text-[14px] mt-1">Real-time metrics and operational status.</p>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue (Paid)" value={`₹${stats.revenue.toFixed(2)}`} icon={DollarSign} tooltip="Total revenue from all paid orders." />
                <StatCard title="Total Orders" value={stats.ordersCount} icon={ShoppingBag} />
                <StatCard title="Total Users" value={stats.usersCount} icon={TrendingUp} />
                <StatCard title="Low Stock Alerts" value={stats.lowStock} icon={AlertCircle} isAlert={stats.lowStock > 0} tooltip="Products with 5 or fewer items remaining in inventory." />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">

                {/* Revenue from recent orders chart */}
                <div className="lg:col-span-2 bg-white border border-gray-200 shadow-sm rounded-xl p-7">
                    <h3 className="text-[18px] font-semibold text-gray-900 mb-2">Recent Revenue (by order date)</h3>
                    <p className="text-[12px] text-gray-500 mb-8">Based on the 5 most recent orders</p>
                    <div className="h-[280px] w-full">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                                    <XAxis dataKey="name" stroke="#9CA3AF" axisLine={false} tickLine={false} dy={10} fontSize={12} />
                                    <YAxis stroke="#9CA3AF" axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} fontSize={12} />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', borderRadius: '8px', color: '#111827', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', fontSize: '12px' }} itemStyle={{ color: '#F59E0B', fontWeight: 600 }} />
                                    <Area type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 text-[14px]">No order data yet.</div>
                        )}
                    </div>
                </div>

                {/* Recent Activity — real orders */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-7 flex flex-col">
                    <h3 className="text-[18px] font-semibold text-gray-900 mb-8">Recent Orders</h3>
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : recentOrders.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                <ShoppingBag size={20} className="text-gray-400" />
                            </div>
                            <p className="text-[14px] font-medium text-gray-900">No orders yet today.</p>
                            <p className="text-[12px] mt-1">Incoming orders will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order._id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-[12px] border border-blue-100">
                                            {order.user?.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="text-[14px] text-gray-900 font-medium font-mono">#{order._id.substring(0, 8).toUpperCase()}</p>
                                            <p className="text-[12px] text-gray-500">{order.user?.name || 'Guest'} · {new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[14px] font-semibold text-gray-900">₹{order.totalPrice.toFixed(2)}</p>
                                        <div className="mt-1">
                                            {order.isPaid ? (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-md">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Paid
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
