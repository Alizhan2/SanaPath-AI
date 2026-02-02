import { Link } from 'react-router-dom';
import { BrainCircuit, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: 'Features', href: '#' },
      { name: 'Survey', href: '/survey' },
      { name: 'Community', href: '/community' },
      { name: 'Roadmap', href: '#' },
    ],
    Resources: [
      { name: 'Documentation', href: '#' },
      { name: 'API Reference', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Support', href: '#' },
    ],
    Company: [
      { name: 'About AI-Sana', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Partners', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
    ],
  };

  return (
    <footer className="relative border-t border-deep-blue-800/50 bg-deep-blue-950/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-neon-purple-500 to-cyber-blue">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-white">Sana</span>
                <span className="gradient-text">Path</span>
              </span>
            </Link>
            <p className="text-deep-blue-400 text-sm mb-4">
              Empowering 60,000+ students to discover their perfect AI career path.
            </p>
            <div className="flex items-center gap-4">
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
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-deep-blue-400 hover:text-neon-purple-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-deep-blue-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-deep-blue-400 text-sm">
              © 2026 SanaPath AI. All rights reserved.
            </p>
            <p className="text-deep-blue-400 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-cyber-pink" /> for the AI-Sana community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
