import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, LayoutGrid, List, ChevronDown, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import API_BASE_URL from '../config/api';

const CollectionPage = () => {
    const { slug } = useParams();
    const [collection, setCollection] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // UI State
    const [viewMode, setViewMode] = useState('grid');
    const [sortOption, setSortOption] = useState('Popular');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false); // Default hidden to keep it minimal as requested

    useEffect(() => {
        fetchCollection();
    }, [slug]);

    const fetchCollection = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/collections/${slug}`);
            if (!res.ok) throw new Error('Collection not found');
            const data = await res.json();
            setCollection(data);
            setProducts(data.products || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Derived sorted products
    const sortedProducts = [...products].sort((a, b) => {
        if (sortOption === 'Price: Low to High') return a.price - b.price;
        if (sortOption === 'Price: High to Low') return b.price - a.price;
        if (sortOption === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
        return 0; // Popular (default)
    });

    const renderFilters = () => (
        <div className="space-y-8 pr-2">
            <div className="flex items-center justify-between md:hidden mb-6 cursor-pointer" onClick={() => setMobileFilterOpen(false)}>
                <h2 className="text-xl font-serif text-gray-900">Filters</h2>
                <button className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-full">
                    <X size={20} />
                </button>
            </div>
            {/* Very minimal filter UI reflecting the collection context */}
            <div className="p-5">
                <h3 className="text-[13px] font-semibold text-gray-900 mb-4 tracking-wide uppercase">Fragrance Notes</h3>
                <div className="flex flex-col gap-3">
                    {['Woody & Earthy', 'Floral', 'Fresh & Citrus', 'Spiced'].map(note => (
                        <label key={note} className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center group-hover:border-amber-500 transition-colors relative overflow-hidden bg-white">
                                <div className="absolute inset-0 bg-amber-500 scale-0 group-hover:scale-100 transition-transform opacity-10"></div>
                            </div>
                            <span className="text-[14px] text-gray-600 group-hover:text-gray-900 transition-colors">{note}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="p-5 pt-0">
                <h3 className="text-[13px] font-semibold text-gray-900 mb-4 tracking-wide uppercase">Price</h3>
                <div className="flex flex-col gap-3">
                    {['Under ₹499', '₹500 - ₹999', '₹1000+'].map((price) => (
                        <label key={price} className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-amber-500 transition-colors bg-white">
                                <div className="w-2 h-2 rounded-full bg-amber-500 scale-0 group-hover:scale-100 transition-transform"></div>
                            </div>
                            <span className="text-[14px] text-gray-600 group-hover:text-gray-900 transition-colors">{price}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    if (loading) return (
        <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-[#FAFAFA]">
            <div className="w-10 h-10 flex items-center justify-center border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-gray-400 text-[15px] font-medium tracking-wide animate-pulse">Preparing Collection...</p>
        </div>
    );

    if (error || !collection) return (
        <div className="min-h-screen pt-40 pb-20 text-center bg-[#FAFAFA]">
            <h1 className="text-4xl font-serif text-gray-900 mb-4">Collection Unavailable</h1>
            <p className="text-gray-500 mb-8">{error || "This collection has been removed or doesn't exist."}</p>
            <Link to="/shop" className="bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition">Return to Shop</Link>
        </div>
    );

    return (
        <div className="bg-[#FAFAFA] min-h-screen pb-20 font-sans">
            <SEO
                title={`${collection.seo?.metaTitle || collection.name} | KindleLight`}
                description={collection.seo?.metaDescription || collection.description}
            />

            {/* 1. Compact & Elegant Hero Section */}
            <div className="bg-white border-b border-gray-100 pt-32 pb-16 px-4 md:px-8 relative overflow-hidden">
                {collection.bannerImage && (
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <img src={collection.bannerImage} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
                    </div>
                )}

                <div className="container mx-auto max-w-[1400px] text-center relative z-10 flex flex-col items-center">
                    <span className="text-amber-600 font-medium text-[12px] tracking-widest uppercase mb-4 block">Curated Collection</span>
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4 tracking-tight">{collection.name}</h1>
                    {collection.description && (
                        <p className="text-gray-500 max-w-2xl mx-auto text-[15px] leading-relaxed">
                            {collection.description}
                        </p>
                    )}
                    {collection.promotionalText && (
                        <div className="mt-6 bg-amber-50 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold inline-block border border-amber-100">
                            {collection.promotionalText}
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Main Content Area */}
            <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1400px] pt-12">

                {/* Mobile Controls */}
                <div className="flex md:hidden items-center justify-between mb-8 pb-4 border-b border-gray-200">
                    <button
                        onClick={() => setMobileFilterOpen(true)}
                        className="flex items-center gap-2 text-[14px] font-medium text-gray-900 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100"
                    >
                        <SlidersHorizontal size={18} /> Filters
                    </button>
                    <div className="relative bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                        <select
                            className="appearance-none bg-transparent border-none text-[14px] font-medium text-gray-900 pr-6 focus:ring-0 cursor-pointer"
                            value={sortOption} onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option>Popular</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Newest</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">

                    {/* Desktop Sidebar Filters */}
                    {showFilters && (
                        <aside className="hidden md:block w-[260px] shrink-0 sticky top-28 bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-gray-100/50">
                            {renderFilters()}
                        </aside>
                    )}

                    {/* Mobile Slide-over */}
                    <AnimatePresence>
                        {mobileFilterOpen && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-gray-900/40 z-[100] md:hidden backdrop-blur-sm"
                                    onClick={() => setMobileFilterOpen(false)}
                                />
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '-100%' }}
                                    transition={{ type: 'tween', duration: 0.3 }}
                                    className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[110] p-6 pt-10 overflow-y-auto shadow-2xl md:hidden custom-scrollbar"
                                >
                                    {renderFilters()}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Product Grid Area */}
                    <main className="flex-1 w-full min-w-0">

                        {/* Featured Product Block (Optional Enhancement) */}
                        {collection.featuredProduct && (
                            <div className="mb-10 bg-amber-50/50 border border-amber-100 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-8">
                                <div className="w-full sm:w-1/3 aspect-square rounded-xl overflow-hidden bg-white shrink-0">
                                    <img src={collection.featuredProduct.image} alt={collection.featuredProduct.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <span className="text-amber-600 font-bold uppercase tracking-widest text-[10px] mb-2 block">Featured Highlight</span>
                                    <h3 className="text-2xl font-serif text-gray-900 mb-3">{collection.featuredProduct.name}</h3>
                                    <p className="text-gray-600 mb-6 text-sm">{collection.featuredProduct.description || "A centerpiece of this collection."}</p>
                                    <Link to={`/product/${collection.featuredProduct._id}`} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition">View Product</Link>
                                </div>
                            </div>
                        )}

                        {/* Desktop Toolbar */}
                        <div className="hidden md:flex justify-between items-center mb-8 bg-white/80 backdrop-blur-md z-10 sticky top-[72px] py-4 px-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center gap-2 text-[14px] font-medium transition-all px-4 py-2 rounded-xl ${showFilters ? 'bg-amber-50 text-amber-900 border border-amber-100' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'}`}
                                >
                                    <SlidersHorizontal size={18} />
                                    {showFilters ? 'Hide Filters' : 'Filter Collection'}
                                </button>
                                <div className="h-6 w-[1px] bg-gray-200"></div>
                                <p className="text-[14px] text-gray-500 font-medium">
                                    <span className="text-gray-900 font-semibold">{products.length}</span> items
                                </p>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center bg-gray-100/50 p-1 rounded-xl">
                                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><LayoutGrid size={18} /></button>
                                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><List size={18} /></button>
                                </div>
                                <div className="h-6 w-[1px] bg-gray-200"></div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[13px] text-gray-500 uppercase tracking-widest font-medium">Sort by:</span>
                                    <div className="relative group">
                                        <select
                                            className="appearance-none bg-transparent border-none text-[14px] font-semibold text-gray-900 pr-6 py-1 focus:ring-0 cursor-pointer group-hover:text-amber-600 transition-colors"
                                            value={sortOption} onChange={(e) => setSortOption(e.target.value)}
                                        >
                                            <option>Popular</option>
                                            <option>Price: Low to High</option>
                                            <option>Price: High to Low</option>
                                            <option>Newest</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-amber-500 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <motion.div layout className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12" : "flex flex-col gap-6"}>
                            <AnimatePresence mode="popLayout">
                                {sortedProducts.length > 0 ? sortedProducts.map((product, i) => (
                                    <motion.div
                                        key={product._id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4, delay: i * 0.05 }}
                                    >
                                        <Link to={`/product/${product._id}`} className="block h-full">
                                            <ProductCard product={product} view={viewMode} />
                                        </Link>
                                    </motion.div>
                                )) : (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-24 text-center bg-white rounded-3xl border border-gray-100">
                                        <p className="text-gray-500 text-[16px]">No products are currently available in this collection.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CollectionPage;
