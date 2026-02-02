import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BrainCircuit, 
  Menu, 
  X, 
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Survey', href: '/survey' },
    { name: 'Community', href: '/community' },
  ];

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

          {/* Desktop CTA */}
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
            <Link to="/survey">
              <button className="px-4 py-2 bg-gradient-to-r from-neon-purple-500 to-cyber-blue text-white font-medium rounded-lg hover:shadow-lg hover:shadow-neon-purple-500/25 transition-all">
                Get Started
              </button>
            </Link>
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
              <Link to="/survey" onClick={() => setIsOpen(false)}>
                <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-neon-purple-500 to-cyber-blue text-white font-medium rounded-lg">
                  Get Started
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
