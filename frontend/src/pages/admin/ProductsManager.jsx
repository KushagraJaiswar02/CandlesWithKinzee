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
                    <div className="bg-[#1A1A1A] border border-red-500/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={24} className="text-red-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Delete Product?</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                This will soft-delete <span className="text-white font-medium">"{confirmDelete.name}"</span>. It won't appear in the shop.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Products</h1>
                    <p className="text-gray-400 mt-1">Manage inventory, pricing, and active listings.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/product/new/edit')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#FF9F1C] hover:bg-[#ffaa33] text-[#111] font-semibold rounded-lg transition-colors w-full sm:w-auto justify-center"
                >
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-[#1A1A1A] border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or category..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF9F1C]/50 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 whitespace-nowrap">
                    <span>Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                        className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FF9F1C] appearance-none"
                    >
                        {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-medium">Product</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Inventory</th>
                                <th className="p-4 font-medium">Price</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading products...</td></tr>
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-gray-500">
                                        <Archive size={48} className="mx-auto mb-4 text-white/10" />
                                        <p>No products found.</p>
                                    </td>
                                </tr>
                            ) : paginated.map((product) => {
                                const imgUrl = (product.image && typeof product.image === 'object')
                                    ? (product.image.secure_url || product.image.url)
                                    : product.image;

                                return (
                                    <tr key={product._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                                                    {imgUrl
                                                        ? <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
                                                        : <Archive size={20} className="text-gray-500" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{product.name}</p>
                                                    <p className="text-xs text-gray-500 font-mono mt-0.5">SKU: {product._id.substring(0, 8).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white/5 text-gray-300">{product.category}</span>
                                        </td>
                                        <td className="p-4">
                                            {product.isDeleted ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Deleted
                                                </span>
                                            ) : product.countInStock > 0 ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Out of Stock
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-sm font-medium ${product.countInStock <= 5 && product.countInStock > 0 ? 'text-[#FF9F1C]' : 'text-gray-300'}`}>
                                                {product.countInStock} in stock
                                            </span>
                                            {product.countInStock <= 5 && product.countInStock > 0 && (
                                                <p className="text-[10px] text-[#FF9F1C]">Low inventory</p>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm font-medium text-white">₹{product.price.toFixed(2)}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => navigate(`/product/${product._id}`)}
                                                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                                                    title="View on shop"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                                                    className="p-1.5 text-gray-400 hover:text-[#FF9F1C] hover:bg-[#FF9F1C]/10 rounded-md transition-colors"
                                                    title="Edit product"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDelete(product)}
                                                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                                                    title="Delete product"
                                                >
                                                    <Trash2 size={16} />
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
                <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-400">
                    <div>Showing <span className="text-white font-medium">{paginated.length}</span> of <span className="text-white font-medium">{sorted.length}</span> products</div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-40">Previous</button>
                        <span className="text-white font-medium">{page} / {totalPages}</span>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-40">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsManager;
