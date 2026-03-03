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
    AlertTriangle,
    AlertCircle
} from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';
import { useToast } from '../../context/ToastContext';

const STATUS_OPTIONS = ['Pending', 'Processed', 'Out for Delivery', 'Delivered', 'Cancelled'];

const STATUS_LABELS = {
    'Pending': 'Payment Pending',
    'Processed': 'Being Prepared',
    'Out for Delivery': 'Out for Delivery',
    'Delivered': 'Delivered',
    'Cancelled': 'Cancelled'
};

const StatusBadge = ({ order }) => {
    if (order.isDelivered) return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium bg-green-100 text-green-700">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> {STATUS_LABELS['Delivered']}
        </span>
    );
    if (order.status === 'Out for Delivery') return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium bg-blue-100 text-blue-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> {STATUS_LABELS['Out for Delivery']}
        </span>
    );
    if (order.status === 'Cancelled') return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium bg-red-100 text-red-700">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> {STATUS_LABELS['Cancelled']}
        </span>
    );
    if (order.status === 'Processed') return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium bg-purple-100 text-purple-700">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span> {STATUS_LABELS['Processed']}
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium bg-amber-100 text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span> {STATUS_LABELS['Pending']}
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white border border-black/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-charcoal">Order Details</h2>
                        <p className="text-xs font-mono text-gray-500 mt-1">#{order._id}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-charcoal transition-colors"><X size={20} /></button>
                </div>

                {/* Customer */}
                <div className="mb-4 p-4 bg-neutral-50 rounded-lg border border-black/5">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Customer</p>
                    <p className="text-charcoal font-medium">{order.user?.name || 'Guest'}</p>
                    <p className="text-gray-500 text-sm">{order.user?.email || 'N/A'}</p>
                </div>

                {/* Items */}
                <div className="mb-4 p-4 bg-neutral-50 rounded-lg border border-black/5 max-h-40 overflow-y-auto">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Order Items</p>
                    {order.orderItems?.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm py-1 border-b border-black/5 last:border-0">
                            <span className="text-gray-600">{item.name} × {item.quantity}</span>
                            <span className="text-charcoal font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                {/* Shipping */}
                <div className="mb-4 p-4 bg-neutral-50 rounded-lg border border-black/5">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Shipping Address</p>
                    <p className="text-gray-600 text-sm">
                        {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                    </p>
                </div>

                {/* Payment */}
                <div className="mb-6 flex justify-between items-center p-4 bg-neutral-50 rounded-lg border border-black/5">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total</p>
                        <p className="text-xl font-bold text-flame">₹{order.totalPrice?.toFixed(2)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                </div>

                {/* Status Update */}
                <div>
                    <label className="block text-[12px] text-gray-500 font-medium mb-2">Update Order Status</label>
                    <div className="flex gap-3">
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 appearance-none shadow-sm text-[14px]"
                        >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>)}
                        </select>
                        <button
                            onClick={handleUpdate}
                            disabled={updating}
                            className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium text-[14px] rounded-lg transition-colors duration-150 disabled:opacity-50 shadow-sm"
                        >
                            {updating ? 'Saving...' : 'Update Status'}
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
        const searchSafe = searchTerm ? searchTerm.toLowerCase() : '';
        const idMatch = o._id ? o._id.toLowerCase().includes(searchSafe) : false;
        const nameMatch = o.user?.name ? o.user.name.toLowerCase().includes(searchSafe) : false;

        const matchesSearch = idMatch || nameMatch;

        let matchesStatus = true;
        if (statusFilter !== 'All') {
            matchesStatus = o.status === statusFilter || (statusFilter === 'Delivered' && o.isDelivered);
        }
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

    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
    const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
    const todayDeliveredCount = todayOrders.filter(o => o.isDelivered).length;
    const todayRevenue = todayOrders.filter(o => o.isPaid).reduce((acc, curr) => acc + curr.totalPrice, 0);

    return (
        <div className="space-y-8">
            {selectedOrder && (
                <OrderModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusUpdate={handleStatusUpdate}
                />
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                    <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight">Orders Operations</h1>
                    <p className="text-gray-500 text-[14px] mt-1">Manage processing, shipping, and fulfillment.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-900 shadow-sm border border-gray-200 text-[13px] font-medium rounded-lg transition-colors duration-150 w-full sm:w-auto justify-center"
                    >
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Top Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm group">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] text-gray-500 font-medium tracking-wide">Today's Orders</span>
                        <div className="group/tooltip relative">
                            <AlertCircle size={14} className="text-gray-400 cursor-help" />
                            <div className="absolute right-0 w-48 p-2 mt-2 text-[12px] bg-gray-900 text-white rounded-md opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-150 z-20">
                                Total number of orders placed since midnight.
                                <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                            </div>
                        </div>
                    </div>
                    <div className="text-[24px] font-bold text-gray-900">{todayOrders.length}</div>
                </div>

                <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm group">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] text-gray-500 font-medium tracking-wide">Pending Orders</span>
                        <div className="group/tooltip relative">
                            <AlertCircle size={14} className="text-gray-400 cursor-help" />
                            <div className="absolute right-0 w-48 p-2 mt-2 text-[12px] bg-gray-900 text-white rounded-md opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-150 z-20">
                                Orders that have not yet been processed or shipped.
                                <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                            </div>
                        </div>
                    </div>
                    <div className="text-[24px] font-bold text-amber-600">{pendingOrdersCount}</div>
                </div>

                <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm group">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] text-gray-500 font-medium tracking-wide">Delivered Today</span>
                    </div>
                    <div className="text-[24px] font-bold text-gray-900">{todayDeliveredCount}</div>
                </div>

                <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm group">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] text-gray-500 font-medium tracking-wide">Today's Revenue</span>
                        <div className="group/tooltip relative">
                            <AlertCircle size={14} className="text-gray-400 cursor-help" />
                            <div className="absolute right-0 w-48 p-2 mt-2 text-[12px] bg-gray-900 text-white rounded-md opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-150 z-20">
                                Total collected amount from paid orders today.
                                <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                            </div>
                        </div>
                    </div>
                    <div className="text-[24px] font-bold text-green-600">₹{todayRevenue.toFixed(2)}</div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white shadow-sm border border-gray-200 p-5 rounded-xl flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96 flex-shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search order ID or customer name..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-[14px] transition-all duration-150"
                    />
                </div>
                <div className="flex bg-gray-50 p-1 border border-gray-200 rounded-lg overflow-x-auto w-full sm:w-auto">
                    {['All', 'Pending', 'Processed', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => { setStatusFilter(status); setPage(1); }}
                            className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-colors duration-150 whitespace-nowrap ${statusFilter === status ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            {status === 'All' ? 'All' : (STATUS_LABELS[status] || status)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-[12px] uppercase tracking-wider border-b border-gray-200">
                                <th className="p-4 font-medium">Order</th>
                                <th className="p-4 font-medium">Customer</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Payment</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-gray-500">
                                        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent flex items-center justify-center rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-[14px]">Loading orders data...</p>
                                    </td>
                                </tr>
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-16 text-center text-gray-500">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ShoppingCart size={24} className="text-gray-400" />
                                        </div>
                                        <p className="text-[16px] font-medium text-gray-900">No orders found.</p>
                                        <p className="text-[13px] mt-1">Try adjusting your search criteria or clear filters.</p>
                                    </td>
                                </tr>
                            ) : paginated.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-150 group">
                                    <td className="p-5">
                                        <p className="text-[14px] font-mono text-gray-900 font-medium tracking-tight">#{order._id.substring(0, 8).toUpperCase()}</p>
                                        <p className="text-[12px] text-gray-500 mt-1">{order.orderItems?.length || 0} items</p>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-bold flex items-center justify-center text-[12px]">
                                                {order.user?.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="text-[14px] font-medium text-gray-900">{order.user?.name || 'Guest'}</p>
                                                <p className="text-[12px] text-gray-500">{order.user?.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <p className="text-[14px] text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        <p className="text-[12px] text-gray-500">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </td>
                                    <td className="p-5">
                                        <p className="text-[14px] font-semibold text-gray-900 mb-1">₹{order.totalPrice?.toFixed(2)}</p>
                                        <span className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-md font-medium ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {order.isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-5"><StatusBadge order={order} /></td>
                                    <td className="p-5 text-right">
                                        <button
                                            onClick={e => { e.stopPropagation(); setSelectedOrder(order); }}
                                            className="text-[13px] px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:shadow-sm font-medium transition-all duration-150"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-black/5 bg-neutral-50 flex items-center justify-between text-sm text-gray-500">
                    <div>Showing <span className="text-charcoal font-medium">{paginated.length}</span> of <span className="text-charcoal font-medium">{filteredOrders.length}</span> orders</div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1.5 rounded bg-white border border-gray-200 hover:bg-neutral-50 text-charcoal transition-colors disabled:opacity-40"
                        >Previous</button>
                        <span className="text-charcoal font-medium">{page} / {totalPages}</span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1.5 rounded bg-white border border-gray-200 hover:bg-neutral-50 text-charcoal transition-colors disabled:opacity-40"
                        >Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersManager;
