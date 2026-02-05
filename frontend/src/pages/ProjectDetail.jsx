import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Code2,
  Target,
  Rocket,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  BookOpen,
  ExternalLink,
  Share2
} from 'lucide-react';
import Navbar from '../components/Navbar';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [project, setProject] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState(0);
  const [completedTasks, setCompletedTasks] = useState({});

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load project from localStorage
    const savedProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
    const found = savedProjects.find(p => p.id === projectId);
    
    if (found) {
      setProject(found);
      setCompletedTasks(found.completedTasks || {});
      setExpandedWeek((found.currentWeek || 1) - 1);
    } else {
      navigate('/dashboard');
    }
  }, [projectId, isAuthenticated, loading, navigate]);

  const handleTaskToggle = (weekIndex, taskIndex) => {
    const key = `${weekIndex}-${taskIndex}`;
    const updated = { ...completedTasks, [key]: !completedTasks[key] };
    setCompletedTasks(updated);

    // Save to localStorage
    const savedProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
    const updatedProjects = savedProjects.map(p => {
      if (p.id === projectId) {
        // Calculate current week based on completed tasks
        const completedCount = Object.values(updated).filter(Boolean).length;
        const totalTasks = project.roadmap.reduce((acc, week) => acc + week.tasks.length, 0);
        const progress = completedCount / totalTasks;
        const currentWeek = Math.min(4, Math.floor(progress * 4) + 1);
        
        return { ...p, completedTasks: updated, currentWeek };
      }
      return p;
    });
    localStorage.setItem('userProjects', JSON.stringify(updatedProjects));
  };

  const getWeekProgress = (weekIndex) => {
    if (!project?.roadmap[weekIndex]) return 0;
    const tasks = project.roadmap[weekIndex].tasks;
    const completed = tasks.filter((_, i) => completedTasks[`${weekIndex}-${i}`]).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const getTotalProgress = () => {
    if (!project?.roadmap) return 0;
    const totalTasks = project.roadmap.reduce((acc, week) => acc + week.tasks.length, 0);
    const completed = Object.values(completedTasks).filter(Boolean).length;
    return Math.round((completed / totalTasks) * 100);
  };

  if (loading || !project) {
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
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-deep-blue-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          {/* Project Header */}
          <motion.div
            className="card-glass p-6 md:p-8 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.difficulty_level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    project.difficulty_level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    project.difficulty_level === 'Advanced' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {project.difficulty_level}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-deep-blue-700/50 text-deep-blue-200">
                    {project.estimated_duration}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{project.title}</h1>
                <p className="text-deep-blue-300">{project.description}</p>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech_stack?.map((tech, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-deep-blue-800/50 text-sm text-cyber-blue border border-cyber-blue/20">
                  {tech}
                </span>
              ))}
            </div>

            {/* Overall Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-deep-blue-400">Overall Progress</span>
                <span className="text-white font-medium">{getTotalProgress()}%</span>
              </div>
              <div className="h-3 bg-deep-blue-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-purple-500 to-cyber-blue rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getTotalProgress()}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Learning Outcomes */}
          {project.learning_outcomes && (
            <motion.div
              className="card-glass p-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-neon-purple-400" />
                Learning Outcomes
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {project.learning_outcomes.map((outcome, i) => (
                  <div key={i} className="flex items-start gap-2 text-deep-blue-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Roadmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyber-blue" />
              4-Week Implementation Roadmap
            </h2>

            <div className="space-y-4">
              {project.roadmap?.map((week, weekIndex) => (
                <div key={weekIndex} className="card-glass overflow-hidden">
                  <button
                    onClick={() => setExpandedWeek(expandedWeek === weekIndex ? -1 : weekIndex)}
                    className="w-full p-4 flex items-center justify-between hover:bg-deep-blue-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        getWeekProgress(weekIndex) === 100
                          ? 'bg-green-500/20 text-green-400'
                          : getWeekProgress(weekIndex) > 0
                          ? 'bg-neon-purple-500/20 text-neon-purple-400'
                          : 'bg-deep-blue-700/50 text-deep-blue-400'
                      }`}>
                        W{weekIndex + 1}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-white">{week.title}</h3>
                        <p className="text-sm text-deep-blue-400">{getWeekProgress(weekIndex)}% complete</p>
                      </div>
                    </div>
                    {expandedWeek === weekIndex ? (
                      <ChevronUp className="w-5 h-5 text-deep-blue-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-deep-blue-400" />
                    )}
                  </button>

                  {expandedWeek === weekIndex && (
                    <motion.div
                      className="px-4 pb-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      {/* Tasks */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-deep-blue-400 mb-2">Tasks:</h4>
                        <div className="space-y-2">
                          {week.tasks?.map((task, taskIndex) => (
                            <button
                              key={taskIndex}
                              onClick={() => handleTaskToggle(weekIndex, taskIndex)}
                              className="w-full flex items-center gap-3 p-3 rounded-lg bg-deep-blue-800/30 hover:bg-deep-blue-800/50 transition-colors text-left"
                            >
                              {completedTasks[`${weekIndex}-${taskIndex}`] ? (
                                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                              ) : (
                                <Circle className="w-5 h-5 text-deep-blue-500 flex-shrink-0" />
                              )}
                              <span className={completedTasks[`${weekIndex}-${taskIndex}`] 
                                ? 'text-deep-blue-400 line-through' 
                                : 'text-white'
                              }>
                                {task}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Deliverables */}
                      {week.deliverables && (
                        <div>
                          <h4 className="text-sm font-medium text-deep-blue-400 mb-2">Deliverables:</h4>
                          <div className="flex flex-wrap gap-2">
                            {week.deliverables.map((deliverable, i) => (
                              <span key={i} className="px-3 py-1 rounded-lg bg-green-500/10 text-green-400 text-sm border border-green-500/20">
                                ✓ {deliverable}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
