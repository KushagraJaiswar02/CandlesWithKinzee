import React, { useState } from 'react';
import {
    Save,
    Image as ImageIcon,
    Type,
    ToggleRight,
    CalendarDays,
    CreditCard,
    LayoutTemplate
} from 'lucide-react';

const LandingPageManager = () => {
    const [config, setConfig] = useState({
        heroTitle: 'CANDLE WITH KINZEE',
        heroSubtitle: 'Hand-poured perfection for your sacred spaces.',
        heroImage: '',
        festiveModeActive: false,
        discountBannerActive: true,
        discountBannerText: 'FREE SHIPPING ON ORDERS OVER $50',
        featuredCollection: 'Aromatherapy'
    });

    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        // Simulate API call
        setTimeout(() => {
            setSaving(false);
        }, 1000);
    };

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Landing Page Configuration</h1>
                    <p className="text-gray-400 mt-1">Manage storefront content, banners, and featured components.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#FF9F1C] hover:bg-[#ffaa33] text-[#111] font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                    <Save size={18} />
                    {saving ? 'Publishing...' : 'Publish Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Editor */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Hero Section */}
                    <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                            <LayoutTemplate className="text-[#FF9F1C]" size={20} />
                            <h2 className="text-xl font-bold text-white">Hero Section</h2>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                    <Type size={14} /> Main Headline
                                </label>
                                <input
                                    type="text"
                                    value={config.heroTitle}
                                    onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF9F1C] transition-colors"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                    <Type size={14} /> Subtitle / Tagline
                                </label>
                                <textarea
                                    value={config.heroSubtitle}
                                    onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                                    rows="3"
                                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF9F1C] transition-colors"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                    <ImageIcon size={14} /> Background Image URL
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        value={config.heroImage}
                                        onChange={(e) => setConfig({ ...config, heroImage: e.target.value })}
                                        className="flex-1 bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF9F1C] transition-colors"
                                    />
                                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-colors whitespace-nowrap">
                                        Media Library
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Promotional Banners */}
                    <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                            <CreditCard className="text-[#A78BFA]" size={20} />
                            <h2 className="text-xl font-bold text-white">Announcement Banner</h2>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center justify-between p-4 bg-[#111] border border-white/5 rounded-lg">
                                <div>
                                    <h3 className="text-white font-medium">Enable Top Banner</h3>
                                    <p className="text-sm text-gray-500 mt-1">Displays a full-width alert above the navigation.</p>
                                </div>
                                <button
                                    onClick={() => setConfig({ ...config, discountBannerActive: !config.discountBannerActive })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.discountBannerActive ? 'bg-[#FF9F1C]' : 'bg-gray-600'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.discountBannerActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className={`transition-opacity ${config.discountBannerActive ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Banner Text</label>
                                <input
                                    type="text"
                                    value={config.discountBannerText}
                                    onChange={(e) => setConfig({ ...config, discountBannerText: e.target.value })}
                                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A78BFA] transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">

                    <div className="bg-[#1A1A1A] border border-[#FF9F1C]/20 rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF9F1C]/10 rounded-bl-full blur-xl" />
                        <div className="flex items-center gap-2 mb-4">
                            <ToggleRight className="text-[#FF9F1C]" size={20} />
                            <h2 className="text-lg font-bold text-white">Festive Overlay</h2>
                        </div>
                        <p className="text-sm text-gray-400 mb-6">
                            Enables special holiday-themed styling, falling snow effects, and premium gold accents across the storefront.
                        </p>
                        <button
                            onClick={() => setConfig({ ...config, festiveModeActive: !config.festiveModeActive })}
                            className={`w-full py-3 rounded-lg font-bold transition-all ${config.festiveModeActive ? 'bg-[#FF9F1C] text-[#111] shadow-[0_0_15px_rgba(255,159,28,0.4)]' : 'bg-[#111] text-gray-400 border border-white/10 hover:border-white/20'}`}
                        >
                            {config.festiveModeActive ? 'FESTIVE MODE: ACTIVE' : 'Enable Festive Mode'}
                        </button>
                    </div>

                    <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                            <CalendarDays className="text-blue-400" size={20} />
                            <h2 className="text-lg font-bold text-white">Storefront Display</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Featured Collection</label>
                                <select
                                    value={config.featuredCollection}
                                    onChange={(e) => setConfig({ ...config, featuredCollection: e.target.value })}
                                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors appearance-none"
                                >
                                    <option value="Aromatherapy">Aromatherapy</option>
                                    <option value="Best Sellers">Best Sellers</option>
                                    <option value="Seasonal">Seasonal Specials</option>
                                    <option value="New Arrivals">New Arrivals</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default LandingPageManager;
