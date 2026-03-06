import React, { useState, useEffect, useContext } from 'react';
import {
    Save, ImageIcon, Type, Link as LinkIcon, Users, Heart, CheckCircle2, RefreshCw, Plus, Trash2, User
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import AuthContext from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';

const DEFAULT_CONFIG = {
    hero: { title: '', subtitle: '', image: '', ctaText: '', ctaLink: '' },
    story: { title: '', content: '', image: '' },
    craftFeatures: [],
    values: [],
    founder: { name: '', image: '', description: '' },
    socialLinks: { instagram: '', facebook: '', pinterest: '', twitter: '', youtube: '', whatsapp: '' },
    ctaSection: { title: '', buttonText: '', buttonLink: '' }
};

const AboutPageManager = () => {
    const { addToast } = useToast();
    const { user } = useContext(AuthContext);
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/about`);
                if (res.ok) {
                    const data = await res.json();
                    setConfig({ ...DEFAULT_CONFIG, ...data });
                }
            } catch (error) {
                addToast('Could not load config from server.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/about`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(config),
            });

            if (!res.ok) throw new Error('Save failed');

            setSaved(true);
            addToast('About page config saved!', 'success');
            setTimeout(() => setSaved(false), 3000);
        } catch (e) {
            addToast(e.message || 'Failed to save config', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e, sectionPath) => {
        const file = e.target.files[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('image', file);

        setUploadingImage(sectionPath);
        try {
            const res = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${user.token}` },
                body: fd,
            });
            if (!res.ok) throw new Error('Upload Failed');
            const data = await res.json();

            // set config depending on path e.g. 'hero.image'
            if (sectionPath.includes('.')) {
                const [section, field] = sectionPath.split('.');
                setConfig(prev => ({
                    ...prev,
                    [section]: { ...prev[section], [field]: data.url }
                }));
            } else {
                setConfig(prev => ({ ...prev, [sectionPath]: data.url }));
            }

            addToast('Image Uploaded', 'success');
        } catch (error) {
            addToast('Upload Failed', 'error');
        } finally {
            setUploadingImage(null);
        }
    };

    // Generic set function for nested objects
    const setNested = (section, field, value) => {
        setConfig(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    // Arrays: Add, Remove, Update
    const addArrayItem = (section) => {
        setConfig(prev => ({
            ...prev,
            [section]: [...prev[section], { title: '', description: '', icon: '' }]
        }));
    };

    const removeArrayItem = (section, index) => {
        setConfig(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const updateArrayItem = (section, index, field, value) => {
        setConfig(prev => {
            const newArray = [...prev[section]];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [section]: newArray };
        });
    };

    if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><RefreshCw size={24} className="text-flame animate-spin" /></div>;

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                    <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight">About Page Editor</h1>
                    <p className="text-gray-500 text-[14px] mt-1">Design the narrative, values, and trust elements of your brand.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-5 py-2.5 font-medium text-[13px] rounded-lg shadow-sm transition-all disabled:opacity-50 ${saved ? 'bg-green-600 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'}`}
                >
                    {saved ? <CheckCircle2 size={18} /> : saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                    {saved ? 'Saved!' : saving ? 'Saving...' : 'Publish Changes'}
                </button>
            </div>

            <div className="space-y-6">

                {/* 1. Hero Section */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-7">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                        <Type className="text-amber-500" size={20} />
                        <h2 className="text-[18px] font-semibold text-gray-900">1. Hero Section</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-[13px] font-medium text-gray-600 mb-2">Main Title</label>
                            <input type="text" value={config.hero.title} onChange={e => setNested('hero', 'title', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[13px] font-medium text-gray-600 mb-2">Subtitle / Tagline</label>
                            <textarea value={config.hero.subtitle} onChange={e => setNested('hero', 'subtitle', e.target.value)} rows="2" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:border-amber-500" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-600 mb-2">CTA Button Text</label>
                            <input type="text" value={config.hero.ctaText} onChange={e => setNested('hero', 'ctaText', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:border-amber-500" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-600 mb-2">CTA Button Link</label>
                            <input type="text" value={config.hero.ctaLink} onChange={e => setNested('hero', 'ctaLink', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:border-amber-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[13px] font-medium text-gray-600 mb-2 flex items-center gap-2"><ImageIcon size={14} /> Background Image (Optional)</label>
                            {config.hero.image && <img src={config.hero.image} alt="Hero" className="w-full h-32 object-cover rounded-lg mb-3 shadow-sm border border-gray-100" />}
                            <div className="flex gap-4">
                                <input type="file" onChange={(e) => handleImageUpload(e, 'hero.image')} className="flex-1 text-sm border border-gray-200 rounded-lg p-2" accept="image/*" />
                                <span className="text-xs text-gray-400 self-center">{uploadingImage === 'hero.image' ? 'Uploading...' : ''}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Our Story */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-7">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                        <Heart className="text-amber-500" size={20} />
                        <h2 className="text-[18px] font-semibold text-gray-900">2. Our Story</h2>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[13px] font-medium text-gray-600 mb-2">Section Title</label>
                            <input type="text" value={config.story.title} onChange={e => setNested('story', 'title', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:border-amber-500" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-600 mb-2">Story Content</label>
                            <textarea value={config.story.content} onChange={e => setNested('story', 'content', e.target.value)} rows="5" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:border-amber-500" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-600 mb-2 flex items-center gap-2"><ImageIcon size={14} /> Story Image</label>
                            {config.story.image && <img src={config.story.image} alt="Story" className="w-24 h-24 object-cover rounded-lg mb-3 shadow-sm border border-gray-100" />}
                            <div className="flex gap-4">
                                <input type="file" onChange={(e) => handleImageUpload(e, 'story.image')} className="w-full text-sm border border-gray-200 rounded-lg p-2" accept="image/*" />
                                <span className="text-xs text-gray-400 self-center">{uploadingImage === 'story.image' ? 'Uploading...' : ''}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Craftsmanship Features */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-7">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="text-amber-500" size={20} />
                            <h2 className="text-[18px] font-semibold text-gray-900">3. Craftsmanship / Process</h2>
                        </div>
                        <button onClick={() => addArrayItem('craftFeatures')} className="flex items-center gap-1 text-[13px] font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100">
                            <Plus size={16} /> Add Feature
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {config.craftFeatures.map((feature, idx) => (
                            <div key={idx} className="bg-gray-50 border border-gray-200 p-4 rounded-lg relative group">
                                <button onClick={() => removeArrayItem('craftFeatures', idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                <input type="text" placeholder="Title (e.g. Hand Poured)" value={feature.title} onChange={(e) => updateArrayItem('craftFeatures', idx, 'title', e.target.value)} className="w-full mb-2 bg-white border border-gray-200 rounded px-3 py-1.5 text-[14px]" />
                                <textarea placeholder="Description" value={feature.description} onChange={(e) => updateArrayItem('craftFeatures', idx, 'description', e.target.value)} rows="2" className="w-full mb-2 bg-white border border-gray-200 rounded px-3 py-1.5 text-[14px]" />
                                <input type="text" placeholder="Lucide Icon name (e.g. Leaf, Flame)" value={feature.icon} onChange={(e) => updateArrayItem('craftFeatures', idx, 'icon', e.target.value)} className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-[14px]" />
                            </div>
                        ))}
                        {config.craftFeatures.length === 0 && <p className="text-sm text-gray-400 py-4 col-span-full text-center border-2 border-dashed rounded-lg">No features added.</p>}
                    </div>
                </div>

                {/* 4. Brand Values */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-7">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-2">
                            <Heart className="text-amber-500" size={20} />
                            <h2 className="text-[18px] font-semibold text-gray-900">4. Brand Values</h2>
                        </div>
                        <button onClick={() => addArrayItem('values')} className="flex items-center gap-1 text-[13px] font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100">
                            <Plus size={16} /> Add Value
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {config.values.map((val, idx) => (
                            <div key={idx} className="bg-gray-50 border border-gray-200 p-4 rounded-lg relative group">
                                <button onClick={() => removeArrayItem('values', idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                <input type="text" placeholder="Value Title" value={val.title} onChange={(e) => updateArrayItem('values', idx, 'title', e.target.value)} className="w-full mb-2 bg-white border border-gray-200 rounded px-3 py-1.5 text-[14px]" />
                                <textarea placeholder="Description" value={val.description} onChange={(e) => updateArrayItem('values', idx, 'description', e.target.value)} rows="2" className="w-full mb-2 bg-white border border-gray-200 rounded px-3 py-1.5 text-[14px]" />
                                <input type="text" placeholder="Lucide Icon name (e.g. Shield, Globe)" value={val.icon} onChange={(e) => updateArrayItem('values', idx, 'icon', e.target.value)} className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-[14px]" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Founder Section */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-7">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                        <User className="text-amber-500" size={20} />
                        <h2 className="text-[18px] font-semibold text-gray-900">5. Founder & Team</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[13px] font-medium text-gray-600 mb-2">Founder Name</label>
                            <input type="text" value={config.founder.name} onChange={e => setNested('founder', 'name', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-[14px]" />
                        </div>
                        <div className="md:row-span-2">
                            <label className="block text-[13px] font-medium text-gray-600 mb-2 flex items-center gap-2"><ImageIcon size={14} /> Photo</label>
                            {config.founder.image && <img src={config.founder.image} alt="Founder" className="w-24 h-24 object-cover rounded-full mb-3 shadow-sm border border-gray-100" />}
                            <input type="file" onChange={(e) => handleImageUpload(e, 'founder.image')} className="w-full text-sm border border-gray-200 rounded-lg p-2" accept="image/*" />
                            <span className="text-xs text-gray-400 mt-1 block">{uploadingImage === 'founder.image' ? 'Uploading...' : ''}</span>
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-600 mb-2">Short Bio</label>
                            <textarea value={config.founder.description} onChange={e => setNested('founder', 'description', e.target.value)} rows="3" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-[14px]" />
                        </div>
                    </div>
                </div>

                {/* 6. Social Links */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-7">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                        <LinkIcon className="text-amber-500" size={20} />
                        <h2 className="text-[18px] font-semibold text-gray-900">6. Social Links</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.keys(config.socialLinks).map(platform => (
                            <div key={platform} className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                                <span className="bg-gray-100 px-4 py-2 text-[13px] font-semibold text-gray-600 capitalize w-28 border-r border-gray-200">{platform}</span>
                                <input type="text" placeholder="https://" value={config.socialLinks[platform]} onChange={e => setNested('socialLinks', platform, e.target.value)} className="flex-1 bg-transparent px-3 py-2 text-[14px] focus:outline-none" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 7. Footer CTA */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-7">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                        <Type className="text-amber-500" size={20} />
                        <h2 className="text-[18px] font-semibold text-gray-900">7. Final CTA Banner</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-3">
                            <label className="block text-[13px] font-medium text-gray-600 mb-2">CTA Title</label>
                            <input type="text" value={config.ctaSection.title} onChange={e => setNested('ctaSection', 'title', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-[14px]" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-600 mb-2">Button Text</label>
                            <input type="text" value={config.ctaSection.buttonText} onChange={e => setNested('ctaSection', 'buttonText', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-[14px]" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-600 mb-2">Button Link</label>
                            <input type="text" value={config.ctaSection.buttonLink} onChange={e => setNested('ctaSection', 'buttonLink', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-[14px]" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutPageManager;
