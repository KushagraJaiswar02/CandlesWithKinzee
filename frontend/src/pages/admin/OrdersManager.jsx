import React, { useState, useEffect, useContext } from 'react';
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    Calendar,
    ChevronDown,
    Truck,
    CheckCircle2,
    Clock
} from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';

const OrdersManager = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/orders`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user.token]);

    const filteredOrders = orders.filter(o => {
        const matchesSearch =
            o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.user && o.user.name.toLowerCase().includes(searchTerm.toLowerCase()));

        let matchesStatus = true;
        if (statusFilter === 'Delivered') matchesStatus = o.isDelivered;
        if (statusFilter === 'Pending') matchesStatus = !o.isDelivered && o.status !== 'Out for Delivery';
        if (statusFilter === 'Out for Delivery') matchesStatus = o.status === 'Out for Delivery';

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (order) => {
        if (order.isDelivered) return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                <CheckCircle2 size={12} /> Delivered
            </span>
        );
        if (order.status === 'Out for Delivery') return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Truck size={12} /> Out for Delivery
            </span>
        );
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FF9F1C]/10 text-[#FF9F1C] border border-[#FF9F1C]/20">
                <Clock size={12} /> Pending Fulfillment
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Orders</h1>
                    <p className="text-gray-400 mt-1">Manage processing, shipping, and fulfillment.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10 w-full sm:w-auto justify-center">
                        <Calendar size={18} />
                        Date Range
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors border border-white/10 w-full sm:w-auto justify-center">
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Top Toolbar */}
            <div className="bg-[#1A1A1A] border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96 flex-shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search order ID or customer name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF9F1C]/50 focus:ring-1 focus:ring-[#FF9F1C]/50 transition-all font-mono text-sm"
                    />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                    <div className="flex bg-[#111] p-1 rounded-lg border border-white/5 shrink-0">
                        {['All', 'Pending', 'Out for Delivery', 'Delivered'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${statusFilter === status ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-medium w-12">
                                    <input type="checkbox" className="rounded border-gray-600 bg-[#111] text-[#FF9F1C] focus:ring-[#FF9F1C]/20" />
                                </th>
                                <th className="p-4 font-medium">Order Details</th>
                                <th className="p-4 font-medium">Customer</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Payment</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-500">Loading orders...</td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
                                        <ShoppingCart size={48} className="mb-4 text-white/10" />
                                        <p>No orders found matching your filters.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                                        <td className="p-4">
                                            <input type="checkbox" className="rounded border-gray-600 bg-[#111] text-[#FF9F1C] focus:ring-[#FF9F1C]/20" />
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <p className="text-sm font-mono text-white">#{order._id.substring(0, 8).toUpperCase()}</p>
                                                <p className="text-xs text-gray-500 mt-1">{order.orderItems?.length || 0} items</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#FF9F1C]/10 text-[#FF9F1C] font-bold flex items-center justify-center text-xs">
                                                    {order.user?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{order.user?.name || 'Guest'}</p>
                                                    <p className="text-xs text-gray-500">{order.user?.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className="text-sm font-bold text-white">${order.totalPrice.toFixed(2)}</span>
                                                {order.isPaid ? (
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-medium tracking-wide uppercase">Paid</span>
                                                ) : (
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-medium tracking-wide uppercase">Unpaid</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(order)}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 text-gray-400">
                                                <button className="p-1.5 hover:text-white hover:bg-white/10 rounded-md transition-colors" title="View details">
                                                    <Eye size={18} />
                                                </button>
                                                <button className="p-1.5 hover:text-white hover:bg-white/10 rounded-md transition-colors">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-400">
                    <div>Showing <span className="text-white font-medium">{filteredOrders.length}</span> orders</div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50 text-gray-500">Previous</button>
                        <button className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersManager;
