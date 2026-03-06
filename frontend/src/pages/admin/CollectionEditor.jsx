import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/api';
import AuthContext from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const CollectionEditor = () => {
    const { id } = useParams();
    const isNew = !id || id === 'new';
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [allProducts, setAllProducts] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        type: 'manual',
        isActive: true,
        bannerImage: '',
        featuredProduct: '',
        productIds: [],
        rules: {
            tags: [], // We'll map this to category strings
            priceRange: { min: '', max: '' },
            discountOnly: false,
            inStockOnly: false
        },
        seo: {
            metaTitle: '',
            metaDescription: ''
        }
    });

    const categories = ['Aromatherapy', 'Soy Wax', 'Pillar Candles', 'Scented Votives', 'Seasonal', 'Decorative'];

    useEffect(() => {
        fetchProducts();
        if (!isNew) {
            fetchCollection();
        }
    }, [id, isNew]);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/products?showAll=true`);
            const data = await res.json();
            setAllProducts(data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    const fetchCollection = async () => {
        try {
            // Note: Our API routes collection by slug, but here we might want an admin route by ID.
            // Let's assume we can fetch all admin collections and find by ID for simplicity if we don't have getById.
            const res = await fetch(`${API_BASE_URL}/api/collections/admin`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const data = await res.json();
            const collection = data.find(c => c._id === id);

            if (collection) {
                setFormData({
                    name: collection.name || '',
                    slug: collection.slug || '',
                    description: collection.description || '',
                    type: collection.type || 'manual',
                    isActive: collection.isActive ?? true,
                    bannerImage: collection.bannerImage || '',
                    featuredProduct: collection.featuredProduct || '',
                    productIds: collection.productIds || [],
                    rules: {
                        tags: collection.rules?.tags || [],
                        priceRange: {
                            min: collection.rules?.priceRange?.min ?? '',
                            max: collection.rules?.priceRange?.max ?? ''
                        },
                        discountOnly: collection.rules?.discountOnly || false,
                        inStockOnly: collection.rules?.inStockOnly || false,
                    },
                    seo: {
                        metaTitle: collection.seo?.metaTitle || '',
                        metaDescription: collection.seo?.metaDescription || ''
                    }
                });
            } else {
                addToast("Collection not found", "error");
                navigate('/admin');
            }
        } catch (error) {
            addToast("Failed to load collection", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({ ...prev, [name]: finalValue }));

        // Auto-generate slug from name if new
        if (isNew && name === 'name') {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }));
        }
    };

    const handleRuleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;

        if (name === 'minPrice' || name === 'maxPrice') {
            setFormData(prev => ({
                ...prev,
                rules: {
                    ...prev.rules,
                    priceRange: {
                        ...prev.rules.priceRange,
                        [name === 'minPrice' ? 'min' : 'max']: finalValue
                    }
                }
            }));
        } else if (name === 'tags') {
            // value is from select multiple, handled separately
        } else {
            setFormData(prev => ({
                ...prev,
                rules: { ...prev.rules, [name]: finalValue }
            }));
        }
    };

    const handleTagToggle = (tag) => {
        setFormData(prev => {
            const tags = prev.rules.tags.includes(tag)
                ? prev.rules.tags.filter(t => t !== tag)
                : [...prev.rules.tags, tag];
            return { ...prev, rules: { ...prev.rules, tags } };
        });
    };

    const handleProductSelect = (productId) => {
        setFormData(prev => {
            const productIds = prev.productIds.includes(productId)
                ? prev.productIds.filter(id => id !== productId)
                : [...prev.productIds, productId];
            return { ...prev, productIds };
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('image', file);
        try {
            setSaving(true);
            const res = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${user.token}` },
                body: fd,
            });
            if (!res.ok) throw new Error('Upload Failed');
            const data = await res.json();
            setFormData({ ...formData, bannerImage: data.url });
            addToast('Image Uploaded', 'success');
        } catch (error) {
            addToast('Upload Failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const method = isNew ? 'POST' : 'PUT';
            const url = isNew ? `${API_BASE_URL}/api/collections` : `${API_BASE_URL}/api/collections/${id}`;

            // Cleanup empty price rules to avoid DB casting errors
            const payload = { ...formData };
            if (payload.rules && payload.rules.priceRange) {
                if (payload.rules.priceRange.min === '') delete payload.rules.priceRange.min;
                if (payload.rules.priceRange.max === '') delete payload.rules.priceRange.max;
            }

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to save collection');

            addToast(`Collection ${isNew ? 'created' : 'updated'} successfully!`, 'success');
            navigate('/admin'); // Assuming going back to admin dash
        } catch (error) {
            console.error(error);
            addToast(error.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/admin')} className="text-gray-500 hover:text-brown">&larr; Back</button>
                <h2 className="text-3xl font-bold text-brown">{isNew ? 'Create New Collection' : 'Edit Collection'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Basic Info */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="text-xl font-bold text-charcoal mb-4">1. Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Collection Name</label>
                            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flame" placeholder="e.g. Winter Warmth" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug</label>
                            <input type="text" name="slug" required value={formData.slug} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flame" placeholder="e.g. winter-warmth" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Short Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flame h-24" placeholder="Brief and evocative description..."></textarea>
                        </div>
                    </div>
                </div>

                {/* Section 2: Type Selection & Products */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="text-xl font-bold text-charcoal mb-4">2. Collection Type & Products</h3>

                    <div className="flex gap-6 mb-8">
                        <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition ${formData.type === 'manual' ? 'border-flame bg-flame/5 ring-2 ring-flame/20' : 'border-gray-200 hover:border-flame/50'}`}>
                            <input type="radio" name="type" value="manual" checked={formData.type === 'manual'} onChange={handleChange} className="hidden" />
                            <div className="font-bold text-charcoal">Handpicked (Manual)</div>
                            <p className="text-sm text-gray-500 mt-1">Select exact products one by one.</p>
                        </label>
                        <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition ${formData.type === 'automated' ? 'border-flame bg-flame/5 ring-2 ring-flame/20' : 'border-gray-200 hover:border-flame/50'}`}>
                            <input type="radio" name="type" value="automated" checked={formData.type === 'automated'} onChange={handleChange} className="hidden" />
                            <div className="font-bold text-charcoal">Rule-based (Automated)</div>
                            <p className="text-sm text-gray-500 mt-1">Products are grouped dynamically by rules.</p>
                        </label>
                    </div>

                    {formData.type === 'manual' ? (
                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-700">Select Products ({formData.productIds.length} selected)</h4>
                            <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                                {allProducts.map(p => (
                                    <label key={p._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                        <input type="checkbox" checked={formData.productIds.includes(p._id)} onChange={() => handleProductSelect(p._id)} className="w-5 h-5 text-flame rounded focus:ring-flame" />
                                        <img src={p.image && typeof p.image === 'object' ? (p.image.secure_url || p.image.url) : p.image} alt="" className="w-10 h-10 object-cover rounded" />
                                        <span className="font-medium text-sm">{p.name} <span className="text-gray-400">(${p.price})</span></span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <div>
                                <h4 className="font-bold text-gray-700 mb-3">Include by Categories (Tags)</h4>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(cat => (
                                        <button key={cat} type="button" onClick={() => handleTagToggle(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${formData.rules.tags.includes(cat) ? 'bg-flame text-white shadow-md' : 'bg-white border text-gray-600 hover:border-flame hover:text-flame'}`}>
                                            {cat} {formData.rules.tags.includes(cat) && '✓'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Min Price ($)</label>
                                    <input type="number" name="minPrice" value={formData.rules.priceRange.min} onChange={handleRuleChange} className="w-full p-3 border rounded-lg focus:ring-flame" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Max Price ($)</label>
                                    <input type="number" name="maxPrice" value={formData.rules.priceRange.max} onChange={handleRuleChange} className="w-full p-3 border rounded-lg focus:ring-flame" placeholder="Unlimited" />
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="inStockOnly" checked={formData.rules.inStockOnly} onChange={handleRuleChange} className="w-5 h-5 text-flame rounded focus:ring-flame" />
                                    <span className="font-medium text-gray-700">Must be in stock</span>
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 3: Visuals & SEO */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="text-xl font-bold text-charcoal mb-4">3. Display & SEO Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Banner Image</label>
                            {formData.bannerImage && <img src={formData.bannerImage} className="w-full h-32 object-cover rounded-lg mb-3 shadow" alt="Banner Preview" />}
                            <input type="file" onChange={handleImageUpload} className="w-full p-2 border border-gray-300 rounded-lg" accept="image/*" />
                            <input type="text" name="bannerImage" value={formData.bannerImage} onChange={handleChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg text-sm" placeholder="Or enter image URL..." />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Featured Product (Optional)</label>
                                <select name="featuredProduct" value={formData.featuredProduct} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg">
                                    <option value="">None</option>
                                    {allProducts.map(p => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <label className="flex items-center gap-2 mt-4 cursor-pointer p-3 border border-gray-200 rounded-lg bg-gray-50">
                                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 text-flame rounded focus:ring-flame" />
                                <span className="font-bold text-charcoal">Collection is Active</span>
                            </label>
                        </div>

                        <div className="md:col-span-2 pt-4 border-t border-gray-100">
                            <h4 className="font-bold text-gray-700 mb-4">SEO Metadata</h4>
                            <div className="space-y-4">
                                <input type="text" value={formData.seo.metaTitle} onChange={(e) => setFormData(p => ({ ...p, seo: { ...p.seo, metaTitle: e.target.value } }))} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Meta Title (Max 60 chars)" />
                                <textarea value={formData.seo.metaDescription} onChange={(e) => setFormData(p => ({ ...p, seo: { ...p.seo, metaDescription: e.target.value } }))} className="w-full p-3 border border-gray-300 rounded-lg h-20" placeholder="Meta Description (Max 160 chars)"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/admin')} className="px-6 py-3 font-bold text-gray-600 hover:text-charcoal bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                    <button type="submit" disabled={saving} className="px-8 py-3 font-bold text-white bg-flame rounded-lg hover:bg-brown shadow-lg transition">
                        {saving ? 'Saving...' : (isNew ? 'Create Collection' : 'Save Changes')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CollectionEditor;
