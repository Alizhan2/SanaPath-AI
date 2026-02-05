import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_TYPES = {
    success: {
        icon: CheckCircle,
        className: 'bg-green-500/20 border-green-500/50 text-green-400'
    },
    error: {
        icon: AlertCircle,
        className: 'bg-red-500/20 border-red-500/50 text-red-400'
    },
    warning: {
        icon: AlertTriangle,
        className: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
    },
    info: {
        icon: Info,
        className: 'bg-blue-500/20 border-blue-500/50 text-blue-400'
    }
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
    const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
    const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
    const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

    return (
        <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
                <AnimatePresence>
                    {toasts.map(toast => {
                        const config = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={toast.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 100, scale: 0.95 }}
                                className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-lg ${config.className}`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p className="flex-1 text-sm text-white">{toast.message}</p>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default ToastProvider;
