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

const mockChartData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 5000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 6890 },
    { name: 'Sat', revenue: 8390 },
    { name: 'Sun', revenue: 7490 },
];

const StatCard = ({ title, value, icon: Icon, trend, isAlert }) => (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6 relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-white/5 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                <Icon size={24} className={isAlert ? 'text-red-400' : ''} />
            </div>
            {trend && (
                <div className={`flex items-center text-sm font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend > 0 ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <div className="relative z-10">
            <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
            <div className={`text-3xl font-bold ${isAlert ? 'text-red-400' : 'text-white'}`}>
                {value}
            </div>
        </div>
        {/* Decorative background gradient */}
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-[#FF9F1C]/10 transition-colors" />
    </div>
);

const DashboardOverview = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ revenue: 0, ordersCount: 0, usersCount: 0, lowStock: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats({
                        revenue: data.totalRevenue || 0,
                        ordersCount: data.totalOrders || 0,
                        usersCount: data.totalUsers || 0,
                        lowStock: data.lowStockProducts || 0
                    });
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user.token]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">System Overview</h1>
                    <p className="text-gray-400 mt-1">Real-time metrics and operational status.</p>
                </div>
                <div className="bg-[#1A1A1A] border border-white/5 rounded-lg p-1 hidden sm:flex">
                    <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-[#FF9F1C] text-[#111111]">7 Days</button>
                    <button className="px-4 py-1.5 text-sm font-medium rounded-md text-gray-400 hover:text-white transition-colors">30 Days</button>
                    <button className="px-4 py-1.5 text-sm font-medium rounded-md text-gray-400 hover:text-white transition-colors">90 Days</button>
                </div>
            </div>

            {/* KPI Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.revenue.toFixed(2)}`}
                    icon={DollarSign}
                    trend={12.5}
                />
                <StatCard
                    title="Total Orders"
                    value={stats.ordersCount}
                    icon={ShoppingBag}
                    trend={8.2}
                />
                <StatCard
                    title="Conversion Rate"
                    value="3.2%"
                    icon={TrendingUp}
                    trend={-1.4}
                />
                <StatCard
                    title="Low Stock Alerts"
                    value={stats.lowStock}
                    icon={AlertCircle}
                    isAlert={stats.lowStock > 0}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

                {/* Main Graph Area */}
                <div className="lg:col-span-2 bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-6">Revenue Over Time</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF9F1C" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#FF9F1C" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#666" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#222', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#FF9F1C' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#FF9F1C" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Secondary Data/List Area */}
                <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <ShoppingBag size={14} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white font-medium">Order #100{i}</p>
                                        <p className="text-xs text-gray-400">2 mins ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-[#FF9F1C]">$124.99</p>
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-medium">Paid</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-sm text-gray-400 hover:text-white border border-white/5 rounded-lg hover:bg-white/5 transition-colors">
                        View All Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
