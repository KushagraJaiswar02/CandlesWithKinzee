import React, { useState, useEffect, useContext } from 'react';
import {
    Search,
    Plus,
    Filter,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Archive
} from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';
import { cn } from '../../utils/cn';

const ProductsManager = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/products?showAll=true`);
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Products</h1>
                    <p className="text-gray-400 mt-1">Manage inventory, pricing, and active listings.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10 w-full sm:w-auto justify-center">
                        <Filter size={18} />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#FF9F1C] hover:bg-[#ffaa33] text-[#111] font-semibold rounded-lg transition-colors w-full sm:w-auto justify-center">
                        <Plus size={18} />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Top Toolbar */}
            <div className="bg-[#1A1A1A] border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF9F1C]/50 focus:ring-1 focus:ring-[#FF9F1C]/50 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400 whitespace-nowrap">
                    <span>Sort by:</span>
                    <select className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FF9F1C] appearance-none">
                        <option>Newest Added</option>
                        <option>Price (High to Low)</option>
                        <option>Stock (Low to High)</option>
                        <option>Top Selling</option>
                    </select>
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
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-500">Loading products...</td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
                                        <Archive size={48} className="mb-4 text-white/10" />
                                        <p>No products found matching your search.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => {
                                    const imgUrl = (product.image && typeof product.image === 'object')
                                        ? (product.image.secure_url || product.image.url)
                                        : product.image;

                                    return (
                                        <tr key={product._id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-4">
                                                <input type="checkbox" className="rounded border-gray-600 bg-[#111] text-[#FF9F1C] focus:ring-[#FF9F1C]/20" />
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                                                        {imgUrl ? (
                                                            <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Archive size={20} className="text-gray-500" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{product.name}</p>
                                                        <p className="text-xs text-gray-500 font-mono mt-0.5">SKU: {product._id.substring(0, 8).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white/5 text-gray-300">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {product.countInStock > 0 ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Out of Stock
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-medium ${product.countInStock <= 5 && product.countInStock > 0 ? 'text-[#FF9F1C]' : 'text-gray-300'}`}>
                                                        {product.countInStock} in stock
                                                    </span>
                                                    {product.countInStock <= 5 && product.countInStock > 0 && (
                                                        <span className="text-[10px] text-[#FF9F1C]">Low inventory</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm font-medium text-white">${product.price.toFixed(2)}</span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors" title="View details">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors" title="Edit product">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors" title="Delete product">
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors">
                                                        <MoreHorizontal size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-400">
                    <div>Showing <span className="text-white font-medium">{filteredProducts.length}</span> products</div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50">Previous</button>
                        <button className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsManager;
