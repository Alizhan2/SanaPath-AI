import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * ErrorBoundary fallback component for displaying errors
 */
export const ErrorDisplay = ({
    title = "Something went wrong",
    message = "An unexpected error occurred. Please try again.",
    onRetry,
    showHomeLink = true
}) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-hero-pattern px-4">
            <motion.div
                className="card-glass p-8 max-w-md text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                <p className="text-deep-blue-300 mb-6">{message}</p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    {onRetry && (
                        <motion.button
                            onClick={onRetry}
                            className="btn-primary flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </motion.button>
                    )}

                    {showHomeLink && (
                        <Link to="/">
                            <motion.button
                                className="btn-secondary flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Home className="w-4 h-4" />
                                Go Home
                            </motion.button>
                        </Link>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

/**
 * Loading spinner component
 */
export const LoadingSpinner = ({
    size = 'md',
    text = 'Loading...',
    fullScreen = false
}) => {
    const sizeClasses = {
        sm: 'w-6 h-6 border-2',
        md: 'w-10 h-10 border-3',
        lg: 'w-16 h-16 border-4'
    };

    const spinner = (
        <div className="flex flex-col items-center gap-3">
            <div className={`${sizeClasses[size]} border-neon-purple-500 border-t-transparent rounded-full animate-spin`} />
            {text && <p className="text-deep-blue-300 text-sm">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-hero-pattern">
                {spinner}
            </div>
        );
    }

    return spinner;
};

/**
 * Empty state component
 */
export const EmptyState = ({
    icon: Icon,
    title = "Nothing here yet",
    message = "Get started by creating something new.",
    action,
    actionLabel = "Get Started"
}) => {
    return (
        <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {Icon && (
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-deep-blue-700/50 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-deep-blue-400" />
                </div>
            )}
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-deep-blue-300 mb-6 max-w-md mx-auto">{message}</p>

            {action && (
                <motion.button
                    onClick={action}
                    className="btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {actionLabel}
                </motion.button>
            )}
        </motion.div>
    );
};

export default ErrorDisplay;
