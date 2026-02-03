import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleAuthCallback } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      console.error('Auth error:', error);
      navigate('/login?error=' + error);
      return;
    }

    if (token) {
      handleAuthCallback(token);
      navigate('/survey');
    } else {
      navigate('/login');
    }
  }, [searchParams, handleAuthCallback, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-pattern">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-neon-purple-400 animate-spin mx-auto mb-4" />
        <p className="text-deep-blue-300">Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
