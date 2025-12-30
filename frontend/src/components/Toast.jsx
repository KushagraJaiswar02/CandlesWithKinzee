import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = type === 'success';

    return (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-2xl border border-white/20
                ${isSuccess ? 'bg-charcoal text-white' : 'bg-red-500 text-white'}
            `}
        >
            <div className={`mr-3 p-1 rounded-full ${isSuccess ? 'bg-flame' : 'bg-white/20'}`}>
                {isSuccess ? '✓' : '✗'}
            </div>
            <div>
                <h4 className="font-bold text-sm tracking-wide">{isSuccess ? 'Success' : 'Error'}</h4>
                <p className="text-xs opacity-90">{message}</p>
            </div>
            <button onClick={onClose} className="ml-4 text-white/50 hover:text-white transition">
                ✕
            </button>
        </div>
    );
};

export default Toast;
