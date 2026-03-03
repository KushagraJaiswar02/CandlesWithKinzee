import React, { useState, useEffect, useContext } from 'react';
import {
    Save,
    Image as ImageIcon,
    Type,
    ToggleRight,
    CalendarDays,
    CreditCard,
    LayoutTemplate,
    CheckCircle2,
    RefreshCw
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import AuthContext from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';

const STORAGE_KEY = 'cwk_landing_config'; // fallback only

const DEFAULT_CONFIG = {
    heroTitle: 'CANDLES WITH KINZEE',
    heroSubtitle: 'Hand-poured perfection for your sacred spaces.',
    heroImage: '',
    festiveModeActive: false,
    discountBannerActive: true,
    discountBannerText: 'FREE SHIPPING ON ORDERS OVER ₹999',
    featuredCollection: 'Aromatherapy',
};

const LandingPageManager = () => {
    const { addToast } = useToast();
    const { user } = useContext(AuthContext);
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Load from backend on mount
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/landing-config`);
                if (res.ok) {
                    const data = await res.json();
                    setConfig({
                        heroTitle: data.heroTitle ?? DEFAULT_CONFIG.heroTitle,
                        heroSubtitle: data.heroSubtitle ?? DEFAULT_CONFIG.heroSubtitle,
                        heroImage: data.heroImage ?? DEFAULT_CONFIG.heroImage,
                        festiveModeActive: data.festiveModeActive ?? DEFAULT_CONFIG.festiveModeActive,
                        discountBannerActive: data.discountBannerActive ?? DEFAULT_CONFIG.discountBannerActive,
                        discountBannerText: data.discountBannerText ?? DEFAULT_CONFIG.discountBannerText,
                        featuredCollection: data.featuredCollection ?? DEFAULT_CONFIG.featuredCollection,
                    });
                } else {
                    throw new Error('API error');
                }
            } catch {
                // Fallback: load from localStorage
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    try { setConfig(JSON.parse(stored)); } catch (_) { }
                }
                addToast('Could not load config from server — showing cached version.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/landing-config`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(config),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Save failed');
            }

            // Also mirror to localStorage as a quick-read cache
            localStorage.setItem(STORAGE_KEY, JSON.stringify(config));

            setSaved(true);
            addToast('Landing page config saved!', 'success');
            setTimeout(() => setSaved(false), 3000);
        } catch (e) {
            addToast(e.message || 'Failed to save config', 'error');
        } finally {
            setSaving(false);
        }
    };

    const set = (key, value) => setConfig(prev => ({ ...prev, [key]: value }));

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <RefreshCw size={24} className="text-flame animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                    <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight">Landing Page Configuration</h1>
                    <p className="text-gray-500 text-[14px] mt-1">Changes are saved to the database and take effect immediately across all devices.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-5 py-2.5 font-medium text-[13px] rounded-lg shadow-sm transition-all duration-150 disabled:opacity-50 ${saved ? 'bg-green-600 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'}`}
                >
                    {saved ? <CheckCircle2 size={18} /> : saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                    {saved ? 'Saved!' : saving ? 'Saving...' : 'Publish Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Editor */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Hero Section */}
                    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-7">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                            <LayoutTemplate className="text-amber-500" size={20} />
                            <h2 className="text-[18px] font-semibold text-gray-900">Hero Section</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 mb-2">
                                    <Type size={14} /> Main Headline
                                </label>
                                <input
                                    type="text"
                                    value={config.heroTitle}
                                    onChange={e => set('heroTitle', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors duration-150 text-[14px]"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 mb-2">
                                    <Type size={14} /> Subtitle / Tagline
                                </label>
                                <textarea
                                    value={config.heroSubtitle}
                                    onChange={e => set('heroSubtitle', e.target.value)}
                                    rows="3"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors duration-150 text-[14px]"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 mb-2">
                                    <ImageIcon size={14} /> Background Image URL
                                </label>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={config.heroImage}
                                    onChange={e => set('heroImage', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors duration-150 text-[14px]"
                                />
                                {config.heroImage && (
                                    <img
                                        src={config.heroImage}
                                        alt="Hero preview"
                                        className="mt-4 w-full h-32 object-cover rounded-lg border border-gray-200 opacity-90"
                                        onError={e => { e.target.style.display = 'none'; }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Announcement Banner */}
                    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-7">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                            <CreditCard className="text-blue-600" size={20} />
                            <h2 className="text-[18px] font-semibold text-gray-900">Announcement Banner</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-5 bg-gray-50 border border-gray-200 rounded-lg">
                                <div>
                                    <h3 className="text-gray-900 font-medium text-[14px]">Enable Top Banner</h3>
                                    <p className="text-[13px] text-gray-500 mt-1">Displays a full-width announcement above the navigation.</p>
                                </div>
                                <button
                                    onClick={() => set('discountBannerActive', !config.discountBannerActive)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-150 ${config.discountBannerActive ? 'bg-amber-500' : 'bg-gray-300'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-150 ${config.discountBannerActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className={`transition-opacity duration-150 ${config.discountBannerActive ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                                <label className="block text-[13px] font-medium text-gray-600 mb-2">Banner Text</label>
                                <input
                                    type="text"
                                    value={config.discountBannerText}
                                    onChange={e => set('discountBannerText', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors duration-150 text-[14px]"
                                />
                                {config.discountBannerActive && (
                                    <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg text-center text-[13px] text-amber-700 font-medium">
                                        Preview: {config.discountBannerText}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">

                    {/* Festive Mode */}
                    <div className="bg-white shadow-sm border border-amber-200 rounded-xl p-7 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/50 rounded-bl-full blur-xl" />
                        <div className="flex items-center gap-2 mb-4">
                            <ToggleRight className="text-amber-500" size={20} />
                            <h2 className="text-[18px] font-semibold text-gray-900">Festive Overlay</h2>
                        </div>
                        <p className="text-[13px] text-gray-600 mb-6 relative z-10">
                            Enables holiday-themed styling and premium gold accents across the storefront.
                        </p>
                        <button
                            onClick={() => set('festiveModeActive', !config.festiveModeActive)}
                            className={`w-full py-2.5 rounded-lg font-medium text-[14px] transition-all duration-150 relative z-10 ${config.festiveModeActive ? 'bg-amber-500 text-white shadow-sm' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-amber-300 hover:bg-white'}`}
                        >
                            {config.festiveModeActive ? '🎄 FESTIVE MODE: ACTIVE' : 'Enable Festive Mode'}
                        </button>
                    </div>

                    {/* Featured Collection */}
                    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-7">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                            <CalendarDays className="text-blue-600" size={20} />
                            <h2 className="text-[18px] font-semibold text-gray-900">Storefront Display</h2>
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-600 mb-2">Featured Collection</label>
                            <select
                                value={config.featuredCollection}
                                onChange={e => set('featuredCollection', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors duration-150 appearance-none text-[14px]"
                            >
                                <option value="Aromatherapy">Aromatherapy</option>
                                <option value="Best Sellers">Best Sellers</option>
                                <option value="Seasonal">Seasonal Specials</option>
                                <option value="New Arrivals">New Arrivals</option>
                            </select>
                        </div>
                    </div>

                    {/* Live DB snapshot */}
                    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-7">
                        <h2 className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-4">Current Config (DB)</h2>
                        <pre className="text-[11px] font-mono text-gray-500 overflow-auto max-h-48 whitespace-pre-wrap break-all p-4 bg-gray-50 rounded-lg border border-gray-100">
                            {JSON.stringify(config, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPageManager;
