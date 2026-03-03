import React, { useState, useEffect, useContext } from 'react';
import {
    Search,
    Plus,
    Filter,
    Edit,
    Trash2,
    Eye,
    Archive,
    X,
    ChevronDown
} from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';
import { cn } from '../../utils/cn';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const PER_PAGE = 10;
const SORT_OPTIONS = ['Newest', 'Price: High→Low', 'Price: Low→High', 'Stock: Low→High'];

const ProductsManager = () => {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('Newest');
    const [page, setPage] = useState(1);
    const [confirmDelete, setConfirmDelete] = useState(null); // product to delete

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/products?showAll=true`);
            if (res.ok) setProducts(await res.json());
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (product) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/products/${product._id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` },
            });
            if (res.ok) {
                addToast(`"${product.name}" deleted.`, 'success');
                setProducts(prev => prev.filter(p => p._id !== product._id));
                setConfirmDelete(null);
            } else {
                const err = await res.json();
                addToast(err.message || 'Delete failed', 'error');
            }
        } catch (e) {
            addToast('Network error', 'error');
        }
    };

    // Filter + Sort
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'Price: High→Low') return b.price - a.price;
        if (sortBy === 'Price: Low→High') return a.price - b.price;
        if (sortBy === 'Stock: Low→High') return a.countInStock - b.countInStock;
        return new Date(b.createdAt) - new Date(a.createdAt); // Newest
    });

    const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
    const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div className="space-y-6">
            {/* Delete Confirmation */}
            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                        <div>
                            <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight">Products</h1>
                            <p className="text-gray-500 text-[14px] mt-1">Manage inventory, pricing, and active listings.</p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/product/new/edit')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium text-[13px] rounded-lg transition-colors duration-150 w-full sm:w-auto justify-center"
                        >
                            <Plus size={18} /> Add Product
                        </button>
                    </div>

                    {/* Toolbar */}
                    <div className="bg-white shadow-sm border border-gray-200 p-5 rounded-xl flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full sm:w-96 flex-shrink-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name or category..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-[14px] transition-all duration-150"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-[13px] text-gray-500 whitespace-nowrap">
                            <span>Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 appearance-none shadow-sm text-[13px]"
                            >
                                {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white border border-gray-200 rounded-2xl p-7 w-full max-w-sm shadow-xl">
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 border border-red-100">
                                <Trash2 size={24} className="text-red-600" />
                            </div>
                            <h3 className="text-[18px] font-semibold text-gray-900 mb-2">Delete Product?</h3>
                            <p className="text-gray-500 text-[14px] mb-8">
                                This will soft-delete <span className="text-gray-900 font-medium">"{confirmDelete.name}"</span>. It won't appear in the shop.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-150 text-[14px] font-medium shadow-sm">
                                    Cancel
                                </button>
                                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-[14px] rounded-lg transition-colors duration-150 shadow-sm">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                    <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight">Products Management</h1>
                    <p className="text-gray-500 text-[14px] mt-1">Manage inventory, pricing, and active listings.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/product/new/edit')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium text-[13px] rounded-lg transition-colors duration-150 w-full sm:w-auto justify-center shadow-sm"
                >
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-white shadow-sm border border-gray-200 p-5 rounded-xl flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96 flex-shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or category..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-[14px] transition-all duration-150"
                    />
                </div>
                <div className="flex items-center gap-2 text-[13px] text-gray-500 whitespace-nowrap">
                    <span>Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 appearance-none shadow-sm text-[13px]"
                    >
                        {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden mt-8">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-[12px] uppercase tracking-wider border-b border-gray-200">
                                <th className="p-4 font-medium">Product</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Inventory</th>
                                <th className="p-4 font-medium">Price</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-gray-500">
                                        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent flex items-center justify-center rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-[14px]">Loading products data...</p>
                                    </td>
                                </tr>
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-16 text-center text-gray-500">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Archive size={24} className="text-gray-400" />
                                        </div>
                                        <p className="text-[16px] font-medium text-gray-900">No products found.</p>
                                        <p className="text-[13px] mt-1">Try adjusting your search criteria or clear filters.</p>
                                    </td>
                                </tr>
                            ) : paginated.map((product) => {
                                const imgUrl = (product.image && typeof product.image === 'object')
                                    ? (product.image.secure_url || product.image.url)
                                    : product.image;

                                return (
                                    <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-150 group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                                                    {imgUrl
                                                        ? <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
                                                        : <Archive size={20} className="text-gray-300" />}
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-medium text-gray-900 tracking-tight">{product.name}</p>
                                                    <p className="text-[12px] text-gray-500 font-mono mt-0.5">SKU: {product._id.substring(0, 8).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="inline-flex items-center px-2 py-1.5 rounded-md text-[12px] font-medium bg-gray-50 border border-gray-100 text-gray-600">{product.category}</span>
                                        </td>
                                        <td className="p-5">
                                            {product.isDeleted ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium bg-gray-100 text-gray-700">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500" /> Deleted
                                                </span>
                                            ) : product.countInStock > 0 ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium bg-green-100 text-green-700">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-600" /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium bg-red-100 text-red-700">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> Out of Stock
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-5">
                                            <span className={`text-[14px] font-medium ${product.countInStock <= 5 && product.countInStock > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
                                                {product.countInStock} in stock
                                            </span>
                                            {product.countInStock <= 5 && product.countInStock > 0 && (
                                                <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Low inventory</p>
                                            )}
                                        </td>
                                        <td className="p-5">
                                            <span className="text-[14px] font-semibold text-gray-900">₹{product.price.toFixed(2)}</span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/product/${product._id}`)}
                                                    className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-150"
                                                    title="View on shop"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                                                    className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors duration-150"
                                                    title="Edit product"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDelete(product)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
                                                    title="Delete product"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-5 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[13px] text-gray-500 gap-4">
                    <div>Showing <span className="text-gray-900 font-medium">{paginated.length}</span> of <span className="text-gray-900 font-medium">{sorted.length}</span> products</div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-900 transition-colors duration-150 disabled:opacity-40 shadow-sm font-medium">Previous</button>
                        <span className="text-gray-900 font-medium">Page {page} of {totalPages}</span>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-900 transition-colors duration-150 disabled:opacity-40 shadow-sm font-medium">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsManager;
