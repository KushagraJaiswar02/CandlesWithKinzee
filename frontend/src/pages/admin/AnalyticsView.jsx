import React, { useState } from 'react';
import {
    BarChart as BarChartIcon,
    TrendingUp,
    Users,
    Activity,
    Calendar,
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

// Mock Data
const revenueData = [
    { name: 'Jan', current: 4000, previous: 2400 },
    { name: 'Feb', current: 3000, previous: 1398 },
    { name: 'Mar', current: 5000, previous: 8800 },
    { name: 'Apr', current: 2780, previous: 3908 },
    { name: 'May', current: 6890, previous: 4800 },
    { name: 'Jun', current: 8390, previous: 3800 },
    { name: 'Jul', current: 7490, previous: 4300 },
];

const categoryData = [
    { name: 'Soy Wax', sales: 400 },
    { name: 'Aromatherapy', sales: 300 },
    { name: 'Pillars', sales: 300 },
    { name: 'Seasonal', sales: 200 },
];

const customerGrowthData = [
    { name: 'Week 1', new: 120, returning: 80 },
    { name: 'Week 2', new: 180, returning: 90 },
    { name: 'Week 3', new: 250, returning: 110 },
    { name: 'Week 4', new: 320, returning: 150 },
];

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

const StatCard = ({ title, value, subtext, icon: Icon, trend }) => (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
        <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                <Icon size={20} />
            </div>
            <div className={`text-sm font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {trend > 0 ? '+' : ''}{trend}%
            </div>
        </div>
        <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
        <div className="text-2xl font-bold text-white mb-2">{value}</div>
        <div className="text-xs text-gray-500">{subtext}</div>
    </div>
);

const AnalyticsView = () => {
    const [timefrane, setTimeframe] = useState('Month');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Analytics & Intelligence</h1>
                    <p className="text-gray-400 mt-1">Deep dive into store performance and growth.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-[#1A1A1A] border border-white/5 rounded-lg p-1">
                        {['Week', 'Month', 'Year'].map(t => (
                            <button
                                key={t}
                                onClick={() => setTimeframe(t)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${timefrane === t ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#FF9F1C] hover:bg-[#ffaa33] text-[#111] font-medium rounded-lg transition-colors">
                        <Download size={18} /> Export Report
                    </button>
                </div>
            </div>

            {/* Hero KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Net Revenue" value="$42,890.00" subtext="Compared to $38,400 last period" icon={BarChartIcon} trend={11.4} />
                <StatCard title="Orders Count" value="1,280" subtext="Compared to 1,150 last period" icon={Activity} trend={8.2} />
                <StatCard title="Average Order Value" value="$64.50" subtext="Compared to $61.20 last period" icon={TrendingUp} trend={4.5} />
                <StatCard title="Repeat Purchase Rate" value="32.4%" subtext="Compared to 28.1% last period" icon={Users} trend={15.2} />
            </div>

            {/* Complex Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Revenue Multi-Line Chart */}
                <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white font-medium">Revenue Comparison</h3>
                        <button className="text-sm text-gray-400 hover:text-white flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded-lg">
                            <Calendar size={14} /> Year over Year
                        </button>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF9F1C" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#FF9F1C" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4B5563" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#4B5563" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#666" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                <Area type="monotone" name="Current Period" dataKey="current" stroke="#FF9F1C" strokeWidth={2} fillOpacity={1} fill="url(#colorCurrent)" />
                                <Area type="monotone" name="Previous Period" dataKey="previous" stroke="#4B5563" strokeWidth={2} fillOpacity={0.5} fill="url(#colorPrev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Sales Bar Chart */}
                <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-6">Sales by Category</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#666" axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#2bc1c1', opacity: 0.1 }} />
                                <Bar dataKey="sales" name="Units Sold" fill="#FF9F1C" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Customer Growth Stacked Area */}
                <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-6">Customer Growth Cohorts</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={customerGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#666" axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                                <Line type="monotone" name="New Customers" dataKey="new" stroke="#FF9F1C" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" name="Returning" dataKey="returning" stroke="#A78BFA" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AnalyticsView;
