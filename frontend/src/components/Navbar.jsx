import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BrainCircuit, 
  Menu, 
  X, 
  Github,
  Twitter,
  Linkedin,
  LogOut,
  User,
  LayoutDashboard
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation links - Dashboard shown only for authenticated users
  const navLinks = isAuthenticated 
    ? [
        { name: 'Home', href: '/' },
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Survey', href: '/survey' },
        { name: 'Community', href: '/community' },
      ]
    : [
        { name: 'Home', href: '/' },
        { name: 'Survey', href: '/survey' },
        { name: 'Community', href: '/community' },
      ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-deep-blue-950/80 backdrop-blur-xl border-b border-deep-blue-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-neon-purple-500 to-cyber-blue group-hover:shadow-lg group-hover:shadow-neon-purple-500/25 transition-all">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-white">Sana</span>
              <span className="gradient-text">Path</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-deep-blue-200 hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-purple-500 to-cyber-blue group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA / User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3 mr-4">
              <a href="#" className="text-deep-blue-400 hover:text-neon-purple-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-deep-blue-400 hover:text-neon-purple-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-deep-blue-400 hover:text-neon-purple-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-deep-blue-800/50 transition-colors"
                >
                  {user?.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full border-2 border-neon-purple-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple-500 to-cyber-blue flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-white font-medium">{user?.name || 'User'}</span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 card-glass rounded-xl overflow-hidden"
                    >
                      <div className="p-3 border-b border-deep-blue-700">
                        <p className="text-sm text-deep-blue-400">Signed in as</p>
                        <p className="text-white font-medium truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-2 px-4 py-3 text-left text-deep-blue-200 hover:text-white hover:bg-deep-blue-800/50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-left text-deep-blue-200 hover:text-white hover:bg-deep-blue-800/50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login">
                <button className="px-4 py-2 bg-gradient-to-r from-neon-purple-500 to-cyber-blue text-white font-medium rounded-lg hover:shadow-lg hover:shadow-neon-purple-500/25 transition-all">
                  Sign In
                </button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-deep-blue-200 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-deep-blue-900/95 backdrop-blur-xl border-b border-deep-blue-800"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block py-2 text-deep-blue-200 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 py-2 border-t border-deep-blue-700 mt-2 pt-4">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple-500 to-cyber-blue flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="text-white">{user?.name}</span>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center gap-2 py-2 text-deep-blue-200 hover:text-white"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full flex items-center gap-2 py-2 text-deep-blue-200 hover:text-white"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-neon-purple-500 to-cyber-blue text-white font-medium rounded-lg">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
