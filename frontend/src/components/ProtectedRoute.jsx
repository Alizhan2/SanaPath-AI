import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - redirects to login if user is not authenticated
 */
export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-hero-pattern">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-neon-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-deep-blue-300">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        // Save the attempted URL for redirecting after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

/**
 * PublicOnlyRoute - redirects to dashboard if already logged in
 */
export const PublicOnlyRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-hero-pattern">
                <div className="w-12 h-12 border-4 border-neon-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (user) {
        // Redirect to the page they came from, or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        return <Navigate to={from} replace />;
    }

    return children;
};

export default ProtectedRoute;
