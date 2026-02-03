import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Github, Mail, Sparkles, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

const Login = () => {
  const navigate = useNavigate();
  const { loginWithGitHub, loginWithGoogle, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/survey');
    }
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-pattern">
        <div className="w-12 h-12 border-4 border-neon-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-pattern px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-orb w-96 h-96 bg-neon-purple-600/30 -top-48 -left-48" />
        <div className="floating-orb w-64 h-64 bg-cyber-blue/30 bottom-20 -right-32" />
      </div>

      <motion.div
        className="card-glass p-8 md:p-12 max-w-md w-full relative z-10"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-deep-blue-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple-500 to-cyber-blue mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-deep-blue-300">
            Sign in to continue your AI journey
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-4">
          <motion.button
            onClick={loginWithGitHub}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#24292e] hover:bg-[#2f363d] text-white font-medium rounded-xl transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Github className="w-5 h-5" />
            <span>Continue with GitHub</span>
          </motion.button>

          <motion.button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-xl transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </motion.button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-deep-blue-700" />
          <span className="text-deep-blue-500 text-sm">or</span>
          <div className="flex-1 h-px bg-deep-blue-700" />
        </div>

        {/* Info */}
        <p className="text-center text-deep-blue-400 text-sm">
          By signing in, you agree to our{' '}
          <a href="#" className="text-neon-purple-400 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-neon-purple-400 hover:underline">Privacy Policy</a>
        </p>

        {/* Stats */}
        <div className="mt-8 pt-6 border-t border-deep-blue-700/50 text-center">
          <p className="text-deep-blue-400 text-sm">
            Join <span className="text-cyber-blue font-semibold">60,000+</span> students in the AI-Sana ecosystem
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
