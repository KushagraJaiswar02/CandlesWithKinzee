import React, { useState, useEffect, useContext } from 'react';
import {
    Save, Hash, Mail, Phone, MessageCircle, Clock, CheckSquare, XSquare, Plus, Trash2, Link as LinkIcon, CheckCircle2, RefreshCw
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import AuthContext from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';

const DEFAULT_CONFIG = {
    hero: { title: '', description: '', instagramCTAtext: '', instagramLink: '' },
    instagramSection: { handle: '', link: '', description: '' },
    contactOptions: { email: '', phone: '', whatsapp: '', businessHours: '' },
    contactForm: { enabled: true, recipientEmail: '' },
    socialLinks: { instagram: '', pinterest: '', facebook: '', youtube: '' },
    faq: []
};

const ContactPageManager = () => {
    const { addToast } = useToast();
    const { user } = useContext(AuthContext);
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/contact`);
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
            const res = await fetch(`${API_BASE_URL}/api/contact`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(config),
            });

            if (!res.ok) throw new Error('Save failed');

            setSaved(true);
            addToast('Contact page config saved!', 'success');
            setTimeout(() => setSaved(false), 3000);
        } catch (e) {
            addToast(e.message || 'Failed to save config', 'error');
        } finally {
            setSaving(false);
        }
    };

    const setNested = (section, field, value) => {
        setConfig(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const addFaq = () => {
        setConfig(prev => ({
            ...prev,
            faq: [...prev.faq, { question: '', answer: '' }]
        }));
    };

    const removeFaq = (index) => {
        setConfig(prev => ({
            ...prev,
            faq: prev.faq.filter((_, i) => i !== index)
        }));
    };

    const updateFaq = (index, field, value) => {
        setConfig(prev => {
            const newFaq = [...prev.faq];
            newFaq[index] = { ...newFaq[index], [field]: value };
            return { ...prev, faq: newFaq };
        });
    };

    if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><RefreshCw size={24} className="text-flame animate-spin" /></div>;

    const inputClasses = "w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors";
    const labelClasses = "block text-[13px] font-medium text-gray-600 mb-2";

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                    <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight">Contact Page Editor</h1>
                    <p className="text-gray-500 text-[14px] mt-1">Manage exactly how customers reach out to your brand.</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Main Setup */}
                <div className="lg:col-span-2 space-y-6">

                    {/* 1. Hero Setup */}
                    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-7">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                            <MessageCircle className="text-amber-500" size={20} />
                            <h2 className="text-[18px] font-semibold text-gray-900">1. Hero Section</h2>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className={labelClasses}>Main Title</label>
                                <input type="text" value={config.hero.title} onChange={e => setNested('hero', 'title', e.target.value)} className={inputClasses} placeholder="e.g. Let's Connect" />
                            </div>
                            <div>
                                <label className={labelClasses}>Hero Description</label>
                                <textarea value={config.hero.description} onChange={e => setNested('hero', 'description', e.target.value)} rows="2" className={inputClasses} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClasses}>Primary Button Text</label>
                                    <input type="text" value={config.hero.instagramCTAtext} onChange={e => setNested('hero', 'instagramCTAtext', e.target.value)} className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>Primary Button Link</label>
                                    <input type="text" value={config.hero.instagramLink} onChange={e => setNested('hero', 'instagramLink', e.target.value)} className={inputClasses} placeholder="https://instagram.com/..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Instagram Prime Focus */}
                    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-7 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-0 blur-2xl opacity-60"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                                <Hash className="text-pink-500" size={20} />
                                <h2 className="text-[18px] font-semibold text-gray-900">2. Primary Channel (Instagram)</h2>
                            </div>
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClasses}>Instagram Handle</label>
                                        <input type="text" value={config.instagramSection.handle} onChange={e => setNested('instagramSection', 'handle', e.target.value)} className={inputClasses} placeholder="@yourhandle" />
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Direct Profile Link</label>
                                        <input type="text" value={config.instagramSection.link} onChange={e => setNested('instagramSection', 'link', e.target.value)} className={inputClasses} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>Why DM you?</label>
                                    <textarea value={config.instagramSection.description} onChange={e => setNested('instagramSection', 'description', e.target.value)} rows="2" className={inputClasses} placeholder="e.g. DM us on Instagram for quick replies..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. FAQ Section */}
                    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-7">
                        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-2">
                                <MessageCircle className="text-blue-500" size={20} />
                                <h2 className="text-[18px] font-semibold text-gray-900">3. Quick FAQs</h2>
                            </div>
                            <button onClick={addFaq} className="flex items-center gap-1 text-[13px] font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100">
                                <Plus size={16} /> Add FAQ
                            </button>
                        </div>
                        <div className="space-y-4">
                            {config.faq.map((item, idx) => (
                                <div key={idx} className="bg-gray-50 border border-gray-200 p-4 rounded-lg relative group">
                                    <button onClick={() => removeFaq(idx)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 bg-white rounded-md border border-gray-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                                    <input type="text" placeholder="Question?" value={item.question} onChange={e => updateFaq(idx, 'question', e.target.value)} className={`${inputClasses} mb-3 font-medium bg-white`} />
                                    <textarea placeholder="Answer..." value={item.answer} onChange={e => updateFaq(idx, 'answer', e.target.value)} rows="2" className={`${inputClasses} bg-white`} />
                                </div>
                            ))}
                            {config.faq.length === 0 && <p className="text-sm text-gray-400 py-6 text-center border-2 border-dashed rounded-lg">No FAQs added. Add some to reduce simple inquiries.</p>}
                        </div>
                    </div>

                </div>

                {/* Right Column: Secondary Methods */}
                <div className="space-y-6">

                    {/* 4. Secondary Contact Details */}
                    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-7">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                            <Phone className="text-gray-700" size={20} />
                            <h2 className="text-[18px] font-semibold text-gray-900">Alternative Contact</h2>
                        </div>
                        <p className="text-[12px] text-gray-500 mb-5">Leave fields blank to hide them on the storefront.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 mb-2"><Mail size={14} /> Support Email</label>
                                <input type="email" value={config.contactOptions.email} onChange={e => setNested('contactOptions', 'email', e.target.value)} className={inputClasses} />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 mb-2"><MessageCircle size={14} /> WhatsApp Number</label>
                                <input type="text" value={config.contactOptions.whatsapp} onChange={e => setNested('contactOptions', 'whatsapp', e.target.value)} className={inputClasses} placeholder="+1 234 567 890" />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 mb-2"><Phone size={14} /> Phone (Voice)</label>
                                <input type="text" value={config.contactOptions.phone} onChange={e => setNested('contactOptions', 'phone', e.target.value)} className={inputClasses} />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 mb-2"><Clock size={14} /> Business Hours</label>
                                <input type="text" value={config.contactOptions.businessHours} onChange={e => setNested('contactOptions', 'businessHours', e.target.value)} className={inputClasses} placeholder="Mon-Fri: 9AM - 5PM" />
                            </div>
                        </div>
                    </div>

                    {/* 5. Direct Email Form Toggle */}
                    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-7">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                            <Mail className="text-gray-700" size={20} />
                            <h2 className="text-[18px] font-semibold text-gray-900">Quick Inquiry Form</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer" onClick={() => setNested('contactForm', 'enabled', !config.contactForm.enabled)}>
                                <div>
                                    <div className="font-medium text-gray-900 text-[14px]">Enable Contact Form</div>
                                    <div className="text-[12px] text-gray-500">Render form on page</div>
                                </div>
                                {config.contactForm.enabled ? <CheckSquare className="text-amber-500" size={20} /> : <XSquare className="text-gray-400" size={20} />}
                            </div>
                            <div className={`transition-opacity ${config.contactForm.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                                <label className={labelClasses}>Forward submissions to:</label>
                                <input type="email" value={config.contactForm.recipientEmail} onChange={e => setNested('contactForm', 'recipientEmail', e.target.value)} className={inputClasses} placeholder="hello@yourbrand.com" />
                            </div>
                        </div>
                    </div>

                    {/* 6. Social Media Links */}
                    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-7">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                            <LinkIcon className="text-gray-700" size={20} />
                            <h2 className="text-[18px] font-semibold text-gray-900">Social Links</h2>
                        </div>
                        <div className="space-y-3">
                            {Object.keys(config.socialLinks).map(platform => (
                                <div key={platform} className="flex flex-col">
                                    <label className="text-[12px] font-medium text-gray-500 mb-1 capitalize pl-1">{platform}</label>
                                    <input type="text" placeholder="https://" value={config.socialLinks[platform]} onChange={e => setNested('socialLinks', platform, e.target.value)} className={`${inputClasses} py-2`} />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactPageManager;
