import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/api';
import AuthContext from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// Simple SVG Icons
const EditIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const TrashIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

const CollectionsManager = () => {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/collections/admin`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch collections');
            const data = await res.json();
            setCollections(data);
        } catch (error) {
            console.error(error);
            addToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this collection?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/collections/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch collections');
            addToast('Collection deleted successfully', 'success');
            fetchCollections();
        } catch (error) {
            console.error(error);
            addToast(error.message, 'error');
        }
    };

    if (loading) return <div>Loading Collections...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-brown">Collections Management</h2>
                <button
                    onClick={() => navigate('/admin/collections/new')}
                    className="bg-flame text-white px-6 py-2 rounded-lg font-bold hover:bg-brown transition"
                >
                    + Create Collection
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
                <p className="mb-4 text-charcoal/70">Group products strategically with manual curation or automated rules.</p>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-shadow/30 text-charcoal/70 text-sm">
                            <th className="p-3">Name</th>
                            <th className="p-3">Slug</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {collections.length === 0 ? (
                            <tr><td colSpan="5" className="p-4 text-center text-gray-500">No collections found.</td></tr>
                        ) : collections.map(col => (
                            <tr key={col._id} className="border-b border-shadow/10 hover:bg-beige/30 transition">
                                <td className="p-3 font-semibold text-charcoal flex items-center gap-3">
                                    {col.bannerImage ? (
                                        <img src={col.bannerImage} className="w-10 h-10 object-cover rounded shadow" alt={col.name} />
                                    ) : (
                                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center shadow">N/A</div>
                                    )}
                                    {col.name}
                                </td>
                                <td className="p-3 text-sm text-gray-500">{col.slug}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${col.type === 'automated' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {col.type}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${col.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {col.isActive ? "Active" : "Hidden"}
                                    </span>
                                </td>
                                <td className="p-3 flex items-center space-x-3 mt-1 text-gray-600">
                                    <Link to={`/admin/collections/${col._id}/edit`} className="hover:text-blue-600"><EditIcon /></Link>
                                    <button onClick={() => handleDelete(col._id)} className="hover:text-red-600"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CollectionsManager;
