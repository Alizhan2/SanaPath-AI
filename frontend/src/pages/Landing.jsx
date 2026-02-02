import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Rocket, 
  Users, 
  BrainCircuit, 
  ArrowRight,
  GraduationCap,
  Target,
  Zap,
  Globe,
  Code2,
  Lightbulb
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Landing = () => {
  const features = [
    {
      icon: BrainCircuit,
      title: 'AI-Powered Matching',
      description: 'Advanced algorithms analyze your skills and interests to find perfect project matches.'
    },
    {
      icon: Target,
      title: 'Personalized Roadmaps',
      description: '4-week implementation plans tailored to your learning style and availability.'
    },
    {
      icon: Users,
      title: 'Community Collaboration',
      description: 'Connect with 60,000+ students and build together in the AI-Sana ecosystem.'
    },
    {
      icon: Rocket,
      title: 'Career Acceleration',
      description: 'Build portfolio-worthy projects that align with your dream career path.'
    }
  ];

  const stats = [
    { value: '60,000+', label: 'Active Students' },
    { value: '5,000+', label: 'Projects Launched' },
    { value: '150+', label: 'Partner Companies' },
    { value: '95%', label: 'Success Rate' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb w-96 h-96 bg-neon-purple-600 -top-48 -left-48" />
        <div className="floating-orb w-[600px] h-[600px] bg-cyber-blue -bottom-96 -right-48" style={{ animationDelay: '2s' }} />
        <div className="floating-orb w-64 h-64 bg-cyber-pink top-1/2 left-1/3" style={{ animationDelay: '4s' }} />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-deep-blue-800/50 border border-neon-purple-500/30 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-4 h-4 text-neon-purple-400" />
              <span className="text-sm font-medium text-neon-purple-300">AI-Sana Ecosystem</span>
              <span className="px-2 py-0.5 bg-neon-purple-500/20 rounded-full text-xs text-cyber-blue">60K+ Students</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="text-white">Your AI Career</span>
              <br />
              <span className="gradient-text animate-gradient-x bg-[length:200%_auto]">Starts Here</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-xl md:text-2xl text-deep-blue-200 max-w-3xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Discover personalized AI project ideas matched to your skills, interests, and career goals. 
              Join 60,000+ students building the future with <span className="text-cyber-blue font-semibold">SanaPath AI</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link to="/survey">
                <motion.button 
                  className="btn-primary group flex items-center gap-2 text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Find My Projects</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link to="/community">
                <motion.button 
                  className="btn-secondary flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Users className="w-5 h-5" />
                  <span>Explore Community</span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            className="mt-16 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="relative mx-auto max-w-4xl">
              <div className="card-glass p-8 md:p-12">
                <div className="grid grid-cols-3 gap-4">
                  {[Code2, Lightbulb, Globe].map((Icon, i) => (
                    <motion.div 
                      key={i}
                      className="flex flex-col items-center p-4 rounded-xl bg-deep-blue-700/30"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 + i * 0.1 }}
                    >
                      <Icon className="w-8 h-8 text-neon-purple-400 mb-2" />
                      <div className="h-2 w-full bg-deep-blue-600 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-neon-purple-500 to-cyber-blue"
                          initial={{ width: 0 }}
                          animate={{ width: `${70 + i * 10}%` }}
                          transition={{ delay: 1.5 + i * 0.2, duration: 1 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between text-sm text-deep-blue-300">
                  <span>Analyzing your profile...</span>
                  <span className="text-cyber-blue">5 projects matched</span>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-neon-purple-500/20 via-cyber-blue/20 to-neon-purple-500/20 blur-3xl -z-10 rounded-3xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                variants={itemVariants}
              >
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-deep-blue-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Supercharge</span> Your AI Journey
            </h2>
            <p className="text-xl text-deep-blue-300 max-w-2xl mx-auto">
              Everything you need to find, build, and showcase AI projects that matter.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="card-glass p-8 group hover:border-neon-purple-500/50 transition-all duration-300"
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-neon-purple-500/20 group-hover:bg-neon-purple-500/30 transition-colors">
                    <feature.icon className="w-6 h-6 text-neon-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                    <p className="text-deep-blue-300">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-deep-blue-300">Three simple steps to your perfect AI project</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Take the Survey', desc: 'Answer 15 questions about your skills, interests, and goals', icon: GraduationCap },
              { step: '02', title: 'Get Matched', desc: 'Our AI analyzes your profile and recommends 5 perfect projects', icon: Zap },
              { step: '03', title: 'Build & Share', desc: 'Follow your roadmap and publish to the community', icon: Rocket }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="card-glass p-8 text-center relative overflow-hidden group">
                  <div className="absolute top-4 left-4 text-6xl font-bold text-deep-blue-700/50 group-hover:text-neon-purple-500/20 transition-colors">
                    {item.step}
                  </div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neon-purple-500 to-cyber-blue flex items-center justify-center">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-deep-blue-300">{item.desc}</p>
                  </div>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-neon-purple-500">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="card-glass p-12 text-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple-500/10 via-transparent to-cyber-blue/10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Find Your <span className="gradient-text">Perfect Project</span>?
              </h2>
              <p className="text-xl text-deep-blue-300 mb-8 max-w-2xl mx-auto">
                Join thousands of students who have already discovered their AI career path through SanaPath AI.
              </p>
              <Link to="/survey">
                <motion.button 
                  className="btn-primary text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Your Journey
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
