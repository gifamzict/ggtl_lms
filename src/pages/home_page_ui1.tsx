import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    BookOpen,
    Users,
    Award,
    Star,
    Clock,
    ArrowRight,
    Play,
    CheckCircle2,
    TrendingUp,
    Globe2,
    Zap,
    Shield,
    Sparkles,
    Code,
    Palette,
    BarChart3,
    Rocket,
    Heart,
    Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Mock data
const mockCategories = [
    { id: '1', name: 'Web Development', slug: 'web-dev', icon: <Code className="h-5 w-5" />, count: 45 },
    { id: '2', name: 'Data Science', slug: 'data-science', icon: <BarChart3 className="h-5 w-5" />, count: 32 },
    { id: '3', name: 'Design', slug: 'design', icon: <Palette className="h-5 w-5" />, count: 28 },
    { id: '4', name: 'Business', slug: 'business', icon: <TrendingUp className="h-5 w-5" />, count: 38 }
];

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail_url: string;
    price: number;
    total_lessons: number;
    total_duration: number;
    categories: { name: string };
    profiles: { full_name: string };
    // These fields are for the new UI, we'll mock them for now
    originalPrice?: number;
    students?: number;
    rating?: number;
    bestseller?: boolean;
    hot?: boolean;
    new?: boolean;
}


const mockCourses = [
    {
        id: '1',
        title: 'Complete React Development Bootcamp',
        slug: 'react-bootcamp',
        description: 'Master React from basics to advanced concepts with real projects',
        thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
        price: 89,
        originalPrice: 199,
        total_lessons: 45,
        total_duration: 2700,
        categories: { name: 'Web Development' },
        profiles: { full_name: 'Sarah Johnson' },
        students: 12500,
        rating: 4.9,
        bestseller: true
    },
    {
        id: '2',
        title: 'Python for Data Science & Machine Learning',
        slug: 'python-data-science',
        description: 'Complete guide to Python programming for data analysis and ML',
        thumbnail_url: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400',
        price: 79,
        originalPrice: 149,
        total_lessons: 38,
        total_duration: 2280,
        categories: { name: 'Data Science' },
        profiles: { full_name: 'Dr. Michael Chen' },
        students: 8900,
        rating: 4.8,
        hot: true
    },
    {
        id: '3',
        title: 'UI/UX Design Masterclass 2024',
        slug: 'ui-ux-masterclass',
        description: 'Design beautiful and functional user experiences from scratch',
        thumbnail_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
        price: 69,
        originalPrice: 129,
        total_lessons: 32,
        total_duration: 1920,
        categories: { name: 'Design' },
        profiles: { full_name: 'Emily Rodriguez' },
        students: 6700,
        rating: 4.9,
        new: true
    }
];

const FloatingElement = ({ children, delay = 0, duration = 6 }) => (
    <motion.div
        animate={{
            y: [-20, 20, -20],
            rotate: [-2, 2, -2],
        }}
        transition={{
            duration,
            repeat: Infinity,
            delay,
            ease: "easeInOut"
        }}
    >
        {children}
    </motion.div>
);

const ParallaxCard = ({ children, offset = 50 }) => (
    <motion.div
        initial={{ opacity: 0, y: offset }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        whileHover={{ y: -10, scale: 1.02 }}
    >
        {children}
    </motion.div>
);

const Index = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const openAuthModal = () => {
        console.log('Open auth modal');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const { data: categoriesData, error: categoriesError } = await supabase
                    .from('categories')
                    .select('id, name, slug')
                    .order('name')
                    .limit(4);

                if (categoriesError) throw categoriesError;
                setCategories(categoriesData || []);

                // Fetch featured courses
                const { data: coursesData, error: coursesError } = await supabase
                    .from('courses')
                    .select(`
            *,
            categories(name),
            profiles(full_name)
          `)
                    .eq('status', 'PUBLISHED')
                    .limit(6);

                if (coursesError) throw coursesError;

                // Add mock data for new UI elements
                const enhancedCourses = (coursesData || []).map((course, index) => ({
                    ...course,
                    originalPrice: course.price * 1.5,
                    students: 5000 + Math.floor(Math.random() * 5000),
                    rating: 4.7 + Math.random() * 0.2,
                    bestseller: index === 0,
                    hot: index === 1,
                    new: index === 2,
                }));
                setCourses(enhancedCourses);
            } catch (error) {
                console.error('Error fetching home page data:', error);
            } finally {
                setLoading(false);
            }
        };

        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);


    const testimonials = [
        {
            name: "Sarah Mitchell",
            role: "Senior Developer at Tesla",
            content: "GGTL transformed my career completely. The interactive learning and real projects made all the difference.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1494790108755-2616b332446c?w=150",
            company: "Tesla"
        },
        {
            name: "Marcus Johnson",
            role: "Data Scientist at Netflix",
            content: "The most comprehensive learning platform I've used. Amazing instructors and cutting-edge content.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            company: "Netflix"
        },
        {
            name: "Lisa Chen",
            role: "UX Designer at Airbnb",
            content: "From beginner to expert in 6 months. The design courses here are absolutely world-class.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
            company: "Airbnb"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-r from-pink-600/30 to-orange-600/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-r from-green-600/30 to-teal-600/30 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>

                {/* Animated Cursor Trail */}
                <motion.div
                    className="absolute w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full pointer-events-none z-50 mix-blend-difference"
                    animate={{
                        x: mousePosition.x - 12,
                        y: mousePosition.y - 12,
                    }}
                    transition={{ type: "spring", damping: 30, stiffness: 200 }}
                />
            </div>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Floating Elements */}
                <FloatingElement delay={0}>
                    <div className="absolute top-20 left-20 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl rotate-12 opacity-80"></div>
                </FloatingElement>
                <FloatingElement delay={2}>
                    <div className="absolute top-40 right-32 w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full opacity-70"></div>
                </FloatingElement>
                <FloatingElement delay={4}>
                    <div className="absolute bottom-40 left-32 w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg rotate-45 opacity-60"></div>
                </FloatingElement>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30 px-6 py-3 rounded-full mb-8"
                            >
                                <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
                                    🔥 Join 100,000+ Global Learners
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.4 }}
                                className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight"
                            >
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200">
                                    Learn
                                </span>
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 animate-pulse">
                                    Beyond
                                </span>
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400">
                                    Limits
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                            >
                                Discover the future of education with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold">AI-powered learning</span>,
                                world-class instructors, and immersive experiences that transform careers.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={openAuthModal}
                                    className="relative group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-10 py-5 rounded-2xl text-xl font-bold overflow-hidden transition-all duration-300"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        <Rocket className="h-6 w-6" />
                                        Start Your Journey
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group backdrop-blur-xl bg-white/10 border border-white/20 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-white/20 transition-all duration-300"
                                >
                                    <span className="flex items-center gap-3">
                                        <Play className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                        Watch Magic Demo
                                    </span>
                                </motion.button>
                            </motion.div>

                            {/* Animated Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1 }}
                                className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
                            >
                                {[
                                    { number: "100K+", label: "Active Learners", icon: <Users className="h-6 w-6" /> },
                                    { number: "500+", label: "Expert Courses", icon: <BookOpen className="h-6 w-6" /> },
                                    { number: "98%", label: "Success Rate", icon: <TrendingUp className="h-6 w-6" /> },
                                    { number: "50+", label: "Countries", icon: <Globe2 className="h-6 w-6" /> }
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.1, y: -5 }}
                                        className="text-center group cursor-pointer"
                                    >
                                        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 mb-3 group-hover:from-purple-600/40 group-hover:to-pink-600/40 transition-all duration-300">
                                            <div className="text-purple-400 mb-2 flex justify-center group-hover:text-pink-400 transition-colors">
                                                {stat.icon}
                                            </div>
                                            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-1">
                                                {stat.number}
                                            </div>
                                            <div className="text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors">
                                                {stat.label}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Floating Category Cards */}
            <section className="py-32 relative">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
                            Explore Categories
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Dive into cutting-edge courses designed by industry experts
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {mockCategories.map((category, index) => (
                            <ParallaxCard key={category.id} offset={50 + index * 20}>
                                <motion.div
                                    whileHover={{
                                        scale: 1.05,
                                        rotateY: 5,
                                        boxShadow: "0 25px 50px rgba(139, 92, 246, 0.3)"
                                    }}
                                    className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 cursor-pointer overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                            {category.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                                            {category.name}
                                        </h3>
                                        <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">
                                            {category.count} Premium Courses
                                        </p>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileHover={{ width: "100%" }}
                                            className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                        ></motion.div>
                                    </div>
                                </motion.div>
                            </ParallaxCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Courses with 3D Effects */}
            <section className="py-32 relative">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-6">
                            Trending Courses
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Master the skills that top companies are hiring for right now
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {courses.length > 0 && courses.map((course, index) => (
                            <ParallaxCard key={course.id} offset={100 + index * 30}>
                                <motion.div
                                    whileHover={{
                                        rotateX: 5,
                                        rotateY: 5,
                                        scale: 1.02,
                                        boxShadow: "0 30px 60px rgba(0, 0, 0, 0.4)"
                                    }}
                                    className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden cursor-pointer"
                                    style={{ perspective: "1000px" }}
                                >
                                    <Link to={`/courses/${course.slug}`}>
                                        {/* Badge */}
                                        <div className="absolute top-4 left-4 z-20">
                                            {course.bestseller && (
                                                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                                                    🔥 BESTSELLER
                                                </span>
                                            )}
                                            {course.hot && (
                                                <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                                                    🚀 HOT
                                                </span>
                                            )}
                                            {course.new && (
                                                <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                    ✨ NEW
                                                </span>
                                            )}
                                        </div>

                                        <div className="relative overflow-hidden">
                                            <motion.img
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                                src={course.thumbnail_url}
                                                alt={course.title}
                                                className="w-full h-52 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                                <Clock className="h-3 w-3" />
                                                {Math.floor(course.total_duration / 60)}h
                                            </div>
                                        </div>

                                        <div className="p-8">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
                                                    {course.categories?.name}
                                                </span>
                                            </div>

                                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                                                {course.title}
                                            </h3>

                                            <p className="text-gray-400 mb-6 line-clamp-2 group-hover:text-gray-300 transition-colors">
                                                {course.description}
                                            </p>

                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-bold text-sm">
                                                            {course.profiles?.full_name?.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <span className="text-gray-300 font-medium">
                                                        {course.profiles?.full_name}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-1 text-gray-400">
                                                        <BookOpen className="h-4 w-4" />
                                                        <span>{course.total_lessons} lessons</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-gray-400">
                                                        <Users className="h-4 w-4" />
                                                        <span>{course.students?.toLocaleString() || '1,000+'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-white font-bold">{course.rating}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">
                                                        ₦{course.price}
                                                    </span>
                                                    <span className="text-gray-500 line-through text-lg">
                                                        ₦{course.originalPrice || course.price * 1.5}
                                                    </span>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 opacity-0 group-hover:opacity-100"
                                                >
                                                    Enroll Now
                                                </motion.button>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            </ParallaxCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Carousel */}
            <section className="py-32 relative">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400 mb-6">
                            Success Stories
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Real transformations from our amazing community
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTestimonial}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5 }}
                                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 text-center"
                            >
                                <div className="flex justify-center mb-8">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-2xl text-gray-300 mb-8 leading-relaxed italic">
                                    "{testimonials[currentTestimonial].content}"
                                </p>
                                <div className="flex items-center justify-center gap-4">
                                    <img
                                        src={testimonials[currentTestimonial].image}
                                        alt={testimonials[currentTestimonial].name}
                                        className="w-16 h-16 rounded-full object-cover border-4 border-purple-500"
                                    />
                                    <div>
                                        <h4 className="text-xl font-bold text-white">
                                            {testimonials[currentTestimonial].name}
                                        </h4>
                                        <p className="text-gray-400">
                                            {testimonials[currentTestimonial].role} at{' '}
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold">
                                                {testimonials[currentTestimonial].company}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-center gap-3 mt-8">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentTestimonial(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 w-8'
                                        : 'bg-gray-600 hover:bg-gray-500'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA with Particles */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-8 leading-tight">
                            Ready to
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                Transform
                            </span>
                            <br />
                            Everything?
                        </h2>
                        <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Join the learning revolution. Start your transformation today with
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold"> GGTL</span>.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 25px 50px rgba(139, 92, 246, 0.5)",
                                    y: -5
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={openAuthModal}
                                className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 text-white px-12 py-6 rounded-2xl text-2xl font-black overflow-hidden transition-all duration-300"
                            >
                                <span className="relative z-10 flex items-center gap-4">
                                    <Rocket className="h-7 w-7 group-hover:rotate-12 transition-transform" />
                                    Launch Your Future
                                    <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: '100%' }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                className="group backdrop-blur-xl bg-white/10 border-2 border-white/30 text-white px-12 py-6 rounded-2xl text-2xl font-black hover:bg-white/20 hover:border-purple-500/50 transition-all duration-300"
                            >
                                <span className="flex items-center gap-4">
                                    <Eye className="h-7 w-7 group-hover:scale-110 transition-transform" />
                                    Explore Courses
                                    <Sparkles className="h-6 w-6 group-hover:rotate-180 transition-transform" />
                                </span>
                            </motion.button>
                        </div>

                        {/* Floating Action Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
                        >
                            {[
                                {
                                    icon: <Heart className="h-8 w-8" />,
                                    title: "Forever Free",
                                    subtitle: "Always free courses",
                                    color: "from-red-500 to-pink-500"
                                },
                                {
                                    icon: <Shield className="h-8 w-8" />,
                                    title: "Lifetime Access",
                                    subtitle: "Learn at your pace",
                                    color: "from-blue-500 to-purple-500"
                                },
                                {
                                    icon: <Zap className="h-8 w-8" />,
                                    title: "Instant Start",
                                    subtitle: "Begin immediately",
                                    color: "from-yellow-500 to-orange-500"
                                }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{
                                        scale: 1.05,
                                        y: -10,
                                        boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
                                    }}
                                    className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 cursor-pointer"
                                >
                                    <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <span className="text-white">
                                            {item.icon}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                        {item.subtitle}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Scroll Indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2, duration: 1 }}
                            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                        >
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
                            >
                                <motion.div
                                    animate={{ y: [0, 12, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-1 h-3 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mt-2"
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Animated Particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-30"
                        animate={{
                            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            left: Math.random() * 100 + '%',
                            top: Math.random() * 100 + '%',
                        }}
                    />
                ))}
            </section>

            {/* Footer CTA Bar */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900/95 to-pink-900/95 backdrop-blur-xl border-t border-purple-500/30 p-4"
            >
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-white font-bold">Limited Time: Get 70% OFF!</p>
                            <p className="text-purple-200 text-sm">Join 100K+ learners today</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={openAuthModal}
                        className="bg-white text-purple-600 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors duration-300"
                    >
                        Claim Offer Now
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default Index;