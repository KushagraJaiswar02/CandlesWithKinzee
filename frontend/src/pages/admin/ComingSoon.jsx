import React from 'react';
import { Construction } from 'lucide-react';

const ComingSoon = ({ title = 'This Page' }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-full bg-[#FF9F1C]/10 flex items-center justify-center mb-6">
            <Construction size={36} className="text-[#FF9F1C]" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        <p className="text-gray-400 max-w-sm">
            This section is under development and will be available in a future update.
        </p>
    </div>
);

export default ComingSoon;
