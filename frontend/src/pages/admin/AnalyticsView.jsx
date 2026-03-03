import React, { useState, useEffect, useContext } from 'react';
import {
    BarChart as BarChartIcon,
    TrendingUp,
    Users,
    Activity,
    Download
} from 'lucide-react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import AuthContext from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#222] border border-white/10 p-4 rounded-lg shadow-xl">
                <p className="text-gray-400 text-sm mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-white font-medium">{entry.name}:</span>
                        <span className="text-white font-bold ml-auto">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const StatCard = ({ title, value, subtext, icon: Icon }) => (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
        <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                <Icon size={20} />
            </div>
        </div>
        <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
        <div className="text-2xl font-bold text-white mb-2">{value}</div>
        <div className="text-xs text-gray-500">{subtext}</div>
    </div>
);

const AnalyticsView = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = { Authorization: `Bearer ${user.token}` };
                const [statsRes, ordersRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/admin/stats`, { headers }),
                    fetch(`${API_BASE_URL}/api/orders`, { headers }),
                ]);
                if (statsRes.ok) setStats(await statsRes.json());
                if (ordersRes.ok) setOrders(await ordersRes.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.token]);

    // Compute AOV
    const paidOrders = orders.filter(o => o.isPaid);
    const aov = paidOrders.length > 0
        ? (paidOrders.reduce((a, o) => a + o.totalPrice, 0) / paidOrders.length).toFixed(2)
        : '0.00';

    // Build category sales from order items
    const categoryMap = {};
    orders.forEach(o => {
        o.orderItems?.forEach(item => {
            const cat = item.name?.split(' ')[0] || 'Other';
            categoryMap[cat] = (categoryMap[cat] || 0) + item.quantity;
        });
    });
    const categoryData = Object.entries(categoryMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, sales]) => ({ name, sales }));

    // Revenue by recent days
    const dayMap = {};
    orders.forEach(o => {
        const d = new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        dayMap[d] = (dayMap[d] || 0) + (o.totalPrice || 0);
    });
    const revenueData = Object.entries(dayMap)
        .slice(-7)
        .map(([name, revenue]) => ({ name, revenue }));

    const handleExport = () => {
        if (!stats) return;
        const csv = [
            ['Metric', 'Value'],
            ['Total Revenue', stats.totalRevenue],
            ['Total Orders', stats.totalOrders],
            ['Total Users', stats.totalUsers],
            ['Low Stock Products', stats.lowStockProducts],
            ['Avg Order Value', aov],
            ['Paid Orders', paidOrders.length],
        ].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Analytics & Intelligence</h1>
                    <p className="text-gray-400 mt-1">Store performance based on real order data.</p>
                </div>
                <button
                    onClick={handleExport}
                    disabled={loading || !stats}
                    className="flex items-center gap-2 px-4 py-2 bg-[#FF9F1C] hover:bg-[#ffaa33] text-[#111] font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                    <Download size={18} /> Export CSV
                </button>
            </div>

            {/* Hero KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Net Revenue (Paid)" value={loading ? '—' : `₹${stats?.totalRevenue?.toFixed(2) || '0.00'}`} subtext="From verified paid orders" icon={BarChartIcon} />
                <StatCard title="Total Orders" value={loading ? '—' : stats?.totalOrders ?? 0} subtext="All time orders" icon={Activity} />
                <StatCard title="Avg. Order Value" value={loading ? '—' : `₹${aov}`} subtext="Paid orders only" icon={TrendingUp} />
                <StatCard title="Total Customers" value={loading ? '—' : stats?.totalUsers ?? 0} subtext="Registered accounts" icon={Users} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Revenue over time */}
                <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6 lg:col-span-2">
                    <h3 className="text-white font-medium mb-6">Revenue Over Time (by order date)</h3>
                    <div className="h-[300px] w-full">
                        {revenueData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF9F1C" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#FF9F1C" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} dy={10} />
                                    <YAxis stroke="#666" axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" name="Revenue (₹)" dataKey="revenue" stroke="#FF9F1C" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 text-sm">{loading ? 'Loading...' : 'No order data yet.'}</div>
                        )}
                    </div>
                </div>

                {/* Category Sales */}
                <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-6">Units Sold by Product Name (Top 6)</h3>
                    <div className="h-[250px] w-full">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} dy={10} tick={{ fontSize: 11 }} />
                                    <YAxis stroke="#666" axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#FF9F1C', opacity: 0.05 }} />
                                    <Bar dataKey="sales" name="Units Sold" fill="#FF9F1C" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 text-sm">{loading ? 'Loading...' : 'No sales data yet.'}</div>
                        )}
                    </div>
                </div>

                {/* Paid vs Unpaid orders */}
                <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-6">Paid vs Unpaid Orders</h3>
                    <div className="h-[250px] w-full">
                        {orders.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={[{ name: 'Orders', Paid: paidOrders.length, Unpaid: orders.length - paidOrders.length }]}
                                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} dy={10} />
                                    <YAxis stroke="#666" axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                                    <Bar dataKey="Paid" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Unpaid" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 text-sm">{loading ? 'Loading...' : 'No data yet.'}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsView;
