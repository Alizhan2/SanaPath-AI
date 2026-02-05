import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Rocket,
  Target,
  Calendar,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  Trash2,
  ExternalLink,
  Plus,
  BookOpen,
  TrendingUp,
  Award,
  Settings,
  ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [activeProjects, setActiveProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedTasks: 0,
    currentWeek: 1,
    streak: 0
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load user's projects from localStorage
    const savedProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
    const active = savedProjects.filter(p => p.status !== 'completed');
    const completed = savedProjects.filter(p => p.status === 'completed');
    
    setActiveProjects(active);
    setCompletedProjects(completed);
    
    // Calculate stats
    const totalTasks = savedProjects.reduce((acc, p) => acc + (p.completedTasks?.length || 0), 0);
    setStats({
      totalProjects: savedProjects.length,
      completedTasks: totalTasks,
      currentWeek: active[0]?.currentWeek || 1,
      streak: Math.floor(Math.random() * 7) + 1 // Demo streak
    });
  }, [isAuthenticated, loading, navigate]);

  const handleDeleteProject = (projectId) => {
    const savedProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
    const updated = savedProjects.filter(p => p.id !== projectId);
    localStorage.setItem('userProjects', JSON.stringify(updated));
    
    setActiveProjects(updated.filter(p => p.status !== 'completed'));
    setCompletedProjects(updated.filter(p => p.status === 'completed'));
  };

  const handleToggleStatus = (projectId) => {
    const savedProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
    const updated = savedProjects.map(p => {
      if (p.id === projectId) {
        return { ...p, status: p.status === 'paused' ? 'active' : 'paused' };
      }
      return p;
    });
    localStorage.setItem('userProjects', JSON.stringify(updated));
    setActiveProjects(updated.filter(p => p.status !== 'completed'));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-pattern">
        <div className="w-12 h-12 border-4 border-neon-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-pattern">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple-500 to-cyber-blue flex items-center justify-center">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
                  </h1>
                  <p className="text-deep-blue-400">{user?.email}</p>
                </div>
              </div>

              <Link to="/survey">
                <motion.button
                  className="btn-primary flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5" />
                  New Project
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="card-glass p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-neon-purple-500/20 flex items-center justify-center mx-auto mb-2">
                <Rocket className="w-6 h-6 text-neon-purple-400" />
              </div>
              <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
              <p className="text-sm text-deep-blue-400">Projects</p>
            </div>

            <div className="card-glass p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-cyber-blue/20 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6 text-cyber-blue" />
              </div>
              <p className="text-2xl font-bold text-white">{stats.completedTasks}</p>
              <p className="text-sm text-deep-blue-400">Tasks Done</p>
            </div>

            <div className="card-glass p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-white">Week {stats.currentWeek}</p>
              <p className="text-sm text-deep-blue-400">Current</p>
            </div>

            <div className="card-glass p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
              <p className="text-2xl font-bold text-white">{stats.streak} 🔥</p>
              <p className="text-sm text-deep-blue-400">Day Streak</p>
            </div>
          </motion.div>

          {/* Active Projects */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-neon-purple-400" />
              Active Projects
            </h2>

            {activeProjects.length === 0 ? (
              <div className="card-glass p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-deep-blue-800/50 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-deep-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No active projects</h3>
                <p className="text-deep-blue-400 mb-4">Start a new AI project to begin your journey!</p>
                <Link to="/survey">
                  <button className="btn-secondary">
                    Get AI Project Recommendations
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {activeProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    className="card-glass p-6 hover:border-neon-purple-500/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === 'active' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {project.status === 'active' ? '🚀 In Progress' : '⏸️ Paused'}
                          </span>
                          <span className="text-deep-blue-500 text-sm">
                            Week {project.currentWeek || 1} of 4
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
                        <p className="text-deep-blue-400 text-sm mb-3">{project.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech_stack?.slice(0, 4).map((tech, i) => (
                            <span key={i} className="px-2 py-1 rounded-lg bg-deep-blue-800/50 text-xs text-cyber-blue">
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-deep-blue-400 mb-1">
                            <span>Progress</span>
                            <span>{Math.round(((project.currentWeek || 1) / 4) * 100)}%</span>
                          </div>
                          <div className="h-2 bg-deep-blue-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-neon-purple-500 to-cyber-blue rounded-full transition-all"
                              style={{ width: `${((project.currentWeek || 1) / 4) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Link to={`/project/${project.id}`}>
                          <button className="p-2 rounded-lg bg-neon-purple-500/20 hover:bg-neon-purple-500/30 text-neon-purple-400 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleToggleStatus(project.id)}
                          className="p-2 rounded-lg bg-deep-blue-700/50 hover:bg-deep-blue-700 text-deep-blue-300 transition-colors"
                        >
                          {project.status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                        <button 
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="grid md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/survey" className="card-glass p-6 hover:border-neon-purple-500/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-neon-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-neon-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">New AI Project</h3>
                  <p className="text-sm text-deep-blue-400">Get personalized recommendations</p>
                </div>
              </div>
            </Link>

            <Link to="/community" className="card-glass p-6 hover:border-cyber-blue/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyber-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-cyber-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Community</h3>
                  <p className="text-sm text-deep-blue-400">Explore projects & find teams</p>
                </div>
              </div>
            </Link>

            <div className="card-glass p-6 hover:border-green-500/50 transition-colors group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Achievements</h3>
                  <p className="text-sm text-deep-blue-400">Track your AI journey</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
