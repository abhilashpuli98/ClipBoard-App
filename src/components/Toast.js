import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiInfo, FiAlertCircle } from 'react-icons/fi';

export const toastEvent = {
    listeners: [],
    notify: (message, type = 'success') => {
        toastEvent.listeners.forEach(listener => listener({ id: Date.now(), message, type }));
    },
    subscribe: (listener) => {
        toastEvent.listeners.push(listener);
        return () => {
            toastEvent.listeners = toastEvent.listeners.filter(l => l !== listener);
        };
    }
};

export const toast = {
    success: (msg) => toastEvent.notify(msg, 'success'),
    error: (msg) => toastEvent.notify(msg, 'error'),
    info: (msg) => toastEvent.notify(msg, 'info')
};

function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const handleToast = (newToast) => {
            setToasts(prev => [...prev, newToast]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== newToast.id));
            }, 3000);
        };

        return toastEvent.subscribe(handleToast);
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: 9999
        }}>
            {toasts.map(t => (
                <div key={t.id} className="animate-slide-in-right glass" style={{
                    padding: '12px 20px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: 'var(--shadow-lg)',
                    minWidth: '250px',
                    borderLeft: `4px solid ${t.type === 'success' ? 'var(--success)' :
                            t.type === 'error' ? 'var(--danger)' : 'var(--info)'
                        }`
                }}>
                    {t.type === 'success' && <FiCheckCircle color="var(--success)" size={20} />}
                    {t.type === 'error' && <FiAlertCircle color="var(--danger)" size={20} />}
                    {t.type === 'info' && <FiInfo color="var(--info)" size={20} />}
                    <span style={{ fontWeight: 500 }}>{t.message}</span>
                </div>
            ))}
        </div>
    );
}

export default ToastContainer;
