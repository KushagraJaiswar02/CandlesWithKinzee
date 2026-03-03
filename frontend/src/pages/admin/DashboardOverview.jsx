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

const StatCard = ({ title, value, icon: Icon, isAlert }) => (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6 relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-white/5 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                <Icon size={24} className={isAlert ? 'text-red-400' : ''} />
            </div>
        </div>
        <div className="relative z-10">
            <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
            <div className={`text-3xl font-bold ${isAlert ? 'text-red-400' : 'text-white'}`}>
                {value}
            </div>
        </div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-[#FF9F1C]/10 transition-colors" />
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
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">System Overview</h1>
                    <p className="text-gray-400 mt-1">Real-time metrics and operational status.</p>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue (Paid)" value={`₹${stats.revenue.toFixed(2)}`} icon={DollarSign} />
                <StatCard title="Total Orders" value={stats.ordersCount} icon={ShoppingBag} />
                <StatCard title="Total Users" value={stats.usersCount} icon={TrendingUp} />
                <StatCard title="Low Stock Alerts" value={stats.lowStock} icon={AlertCircle} isAlert={stats.lowStock > 0} />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

                {/* Revenue from recent orders chart */}
                <div className="lg:col-span-2 bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-2">Recent Revenue (by order date)</h3>
                    <p className="text-xs text-gray-500 mb-6">Based on the 5 most recent orders</p>
                    <div className="h-[280px] w-full">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF9F1C" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#FF9F1C" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} dy={10} />
                                    <YAxis stroke="#666" axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                                    <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#333', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#FF9F1C' }} />
                                    <Area type="monotone" dataKey="revenue" stroke="#FF9F1C" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 text-sm">No order data yet.</div>
                        )}
                    </div>
                </div>

                {/* Recent Activity — real orders */}
                <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-6">Recent Orders</h3>
                    {loading ? (
                        <p className="text-gray-500 text-sm">Loading...</p>
                    ) : recentOrders.length === 0 ? (
                        <p className="text-gray-500 text-sm">No orders yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order._id} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#FF9F1C]/10 flex items-center justify-center text-[#FF9F1C] font-bold text-xs">
                                            {order.user?.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm text-white font-medium font-mono">#{order._id.substring(0, 8).toUpperCase()}</p>
                                            <p className="text-xs text-gray-400">{order.user?.name || 'Guest'} · {new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-[#FF9F1C]">₹{order.totalPrice.toFixed(2)}</p>
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${order.isPaid ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {order.isPaid ? 'Paid' : 'Unpaid'}
                                        </span>
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
