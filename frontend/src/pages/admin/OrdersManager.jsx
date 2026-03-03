import React, { useState, useEffect, useContext } from 'react';
import {
    Search,
    Calendar,
    ChevronDown,
    Truck,
    CheckCircle2,
    Clock,
    ShoppingCart,
    X,
    AlertTriangle
} from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';
import { useToast } from '../../context/ToastContext';

const STATUS_OPTIONS = ['Pending', 'Processed', 'Out for Delivery', 'Delivered', 'Cancelled'];

const StatusBadge = ({ order }) => {
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
    if (order.status === 'Cancelled') return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
            <X size={12} /> Cancelled
        </span>
    );
    if (order.status === 'Processed') return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <CheckCircle2 size={12} /> Processed
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FF9F1C]/10 text-[#FF9F1C] border border-[#FF9F1C]/20">
            <Clock size={12} /> Pending
        </span>
    );
};

// ─── Order Detail Modal ───────────────────────────────────────────────────────
const OrderModal = ({ order, onClose, onStatusUpdate }) => {
    const [status, setStatus] = useState(order.status || 'Pending');
    const [updating, setUpdating] = useState(false);
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/orders/${order._id}/deliver`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                const updated = await res.json();
                addToast(`Order status updated to "${status}"`, 'success');
                onStatusUpdate(updated);
                onClose();
            } else {
                const err = await res.json();
                addToast(err.message || 'Update failed', 'error');
            }
        } catch (e) {
            addToast('Network error', 'error');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Order Details</h2>
                        <p className="text-xs font-mono text-gray-400 mt-1">#{order._id}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
                </div>

                {/* Customer */}
                <div className="mb-4 p-4 bg-[#111] rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Customer</p>
                    <p className="text-white font-medium">{order.user?.name || 'Guest'}</p>
                    <p className="text-gray-400 text-sm">{order.user?.email || 'N/A'}</p>
                </div>

                {/* Items */}
                <div className="mb-4 p-4 bg-[#111] rounded-lg max-h-40 overflow-y-auto">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Order Items</p>
                    {order.orderItems?.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm py-1 border-b border-white/5 last:border-0">
                            <span className="text-gray-300">{item.name} × {item.quantity}</span>
                            <span className="text-white font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                {/* Shipping */}
                <div className="mb-4 p-4 bg-[#111] rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Shipping Address</p>
                    <p className="text-gray-300 text-sm">
                        {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                    </p>
                </div>

                {/* Payment */}
                <div className="mb-6 flex justify-between items-center p-4 bg-[#111] rounded-lg">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total</p>
                        <p className="text-xl font-bold text-[#FF9F1C]">₹{order.totalPrice?.toFixed(2)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.isPaid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                </div>

                {/* Status Update */}
                <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Update Status</label>
                    <div className="flex gap-3">
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            className="flex-1 bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#FF9F1C] appearance-none"
                        >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button
                            onClick={handleUpdate}
                            disabled={updating}
                            className="px-5 py-2.5 bg-[#FF9F1C] hover:bg-[#ffaa33] text-[#111] font-bold rounded-lg transition-colors disabled:opacity-50"
                        >
                            {updating ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const OrdersManager = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [page, setPage] = useState(1);
    const PER_PAGE = 10;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/orders`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                if (res.ok) setOrders(await res.json());
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user.token]);

    const handleStatusUpdate = (updated) => {
        setOrders(prev => prev.map(o => o._id === updated._id ? { ...o, ...updated } : o));
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch =
            o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
        let matchesStatus = true;
        if (statusFilter !== 'All') matchesStatus = o.status === statusFilter || (statusFilter === 'Delivered' && o.isDelivered);
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PER_PAGE));
    const paginated = filteredOrders.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const exportCSV = () => {
        const rows = [
            ['Order ID', 'Customer', 'Email', 'Date', 'Total', 'Paid', 'Status'],
            ...filteredOrders.map(o => [
                o._id,
                o.user?.name || 'Guest',
                o.user?.email || '',
                new Date(o.createdAt).toLocaleDateString(),
                o.totalPrice?.toFixed(2),
                o.isPaid ? 'Yes' : 'No',
                o.status || 'Pending',
            ])
        ].map(r => r.join(',')).join('\n');
        const blob = new Blob([rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {selectedOrder && (
                <OrderModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusUpdate={handleStatusUpdate}
                />
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Orders</h1>
                    <p className="text-gray-400 mt-1">Manage processing, shipping, and fulfillment.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors border border-white/10 w-full sm:w-auto justify-center"
                    >
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-[#1A1A1A] border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96 flex-shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search order ID or customer name..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF9F1C]/50 font-mono text-sm transition-all"
                    />
                </div>
                <div className="flex bg-[#111] p-1 rounded-lg border border-white/5 overflow-x-auto">
                    {['All', 'Pending', 'Processed', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => { setStatusFilter(status); setPage(1); }}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${statusFilter === status ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-medium">Order</th>
                                <th className="p-4 font-medium">Customer</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Payment</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading orders...</td></tr>
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-gray-500">
                                        <ShoppingCart size={48} className="mx-auto mb-4 text-white/10" />
                                        <p>No orders found.</p>
                                    </td>
                                </tr>
                            ) : paginated.map((order) => (
                                <tr key={order._id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                    <td className="p-4">
                                        <p className="text-sm font-mono text-white">#{order._id.substring(0, 8).toUpperCase()}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{order.orderItems?.length || 0} items</p>
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
                                        <span className="text-sm font-bold text-white">₹{order.totalPrice?.toFixed(2)}</span>
                                        <br />
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium uppercase ${order.isPaid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {order.isPaid ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </td>
                                    <td className="p-4"><StatusBadge order={order} /></td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={e => { e.stopPropagation(); setSelectedOrder(order); }}
                                            className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#FF9F1C]/10 hover:text-[#FF9F1C] text-gray-400 border border-white/10 transition-colors"
                                        >
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-400">
                    <div>Showing <span className="text-white font-medium">{paginated.length}</span> of <span className="text-white font-medium">{filteredOrders.length}</span> orders</div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-40"
                        >Previous</button>
                        <span className="text-white font-medium">{page} / {totalPages}</span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-40"
                        >Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersManager;
