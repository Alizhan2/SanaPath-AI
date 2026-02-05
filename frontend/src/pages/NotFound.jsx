import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-hero-pattern">
            <Navbar />

            <main className="flex items-center justify-center min-h-screen px-4">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* 404 Number */}
                    <motion.div
                        className="text-[150px] md:text-[200px] font-bold leading-none gradient-text"
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 100 }}
                    >
                        404
                    </motion.div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Page Not Found
                    </h1>

                    <p className="text-deep-blue-300 mb-8 max-w-md mx-auto">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/">
                            <motion.button
                                className="btn-primary flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Home className="w-5 h-5" />
                                Go Home
                            </motion.button>
                        </Link>

                        <motion.button
                            onClick={() => window.history.back()}
                            className="btn-secondary flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Go Back
                        </motion.button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default NotFound;
