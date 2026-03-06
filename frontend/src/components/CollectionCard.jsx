import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CollectionCard = ({ collection }) => {
    return (
        <Link
            to={`/collection/${collection.slug}`}
            className="group block relative overflow-hidden rounded-2xl aspect-[4/5] bg-gray-100"
        >
            <img
                src={collection.bannerImage || 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?q=80&w=2670&auto=format&fit=crop'}
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent"></div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 text-white transform transition-transform duration-300">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-2xl font-serif font-bold mb-1">{collection.name}</h3>
                        <p className="text-white/80 text-sm font-medium tracking-wide">Explore Collection</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        <ArrowRight size={18} className="text-white" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CollectionCard;
