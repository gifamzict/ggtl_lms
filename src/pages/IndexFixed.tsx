import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Award, TrendingUp, Target, Zap, Play, Star, Clock, CheckCircle, ArrowRight, Globe, Shield, Sparkles, GraduationCap, Rocket, Brain, Code, Palette, BarChart, ChevronRight, Trophy, Infinity, Video, FileText, MessageSquare } from 'lucide-react';
import { publicApi, Course } from '@/services/api/publicApi';
import { toast } from 'sonner';

const EnhancedLandingPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [isVisible, setIsVisible] = useState({});
    const [courses, setCourses] = useState<Course[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible((prev) => ({
                        ...prev,
                        [entry.target.id]: entry.isIntersecting,
                    }));
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('[id^="section-"]').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Fetch courses from API
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoadingCourses(true);
                const response = await publicApi.getCourses({ limit: 6 });
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
                toast.error('Failed to load courses');
            } finally {
                setLoadingCourses(false);
            }
        };

        fetchCourses();
    }, []);

    // Handle course click to navigate to course details
    const handleCourseClick = (courseSlug: string) => {
        navigate(`/courses/${courseSlug}`);
    };

    const features = [
        {
            icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Learning",
            description: "Personalized learning paths adapted to your pace and style with cutting-edge AI technology.",
            color: "from-purple-500 to-pink-500",
            delay: 0
        },
        {
            icon: <Infinity className="h-8 w-8" />,
      title: "Lifetime Access",
            description: "Learn at your own pace with unlimited access to all course materials and future updates.",
            color: "from-blue-500 to-cyan-500",
            delay: 0.1
        },
        {
            icon: <Trophy className="h-8 w-8" />,
      title: "Industry Certificates",
            description: "Earn recognized certificates that showcase your expertise to employers worldwide.",
            color: "from-orange-500 to-yellow-500",
            delay: 0.2
        },
        {
            icon: <Globe className="h-8 w-8" />,
      title: "Global Community",
            description: "Connect with 50k+ learners worldwide and build lasting professional relationships.",
            color: "from-green-500 to-emerald-500",
            delay: 0.3
        }
    ];

    const stats = [
        { number: "50K+", label: "Active Students", icon: <Users className="h-6 w-6" /> },
        { number: "200+", label: "Expert Courses", icon: <BookOpen className="h-6 w-6" /> },
        { number: "98%", label: "Success Rate", icon: <Award className="h-6 w-6" /> },
        { number: "4.9/5", label: "Average Rating", icon: <Star className="h-6 w-6" /> }
    ];

    const categories = [
        { name: "Web Development", icon: <Code />, courses: 45, color: "bg-blue-500" },
        { name: "Data Science", icon: <BarChart />, courses: 32, color: "bg-purple-500" },
        { name: "UI/UX Design", icon: <Palette />, courses: 28, color: "bg-pink-500" },
        { name: "Mobile Dev", icon: <Rocket />, courses: 24, color: "bg-green-500" }
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Software Engineer at Google",
            image: "/api/placeholder/64/64",
            content: "GGTL's courses completely transformed my career. The practical approach and real-world projects gave me the skills I needed to land my dream job at Google.",
            rating: 5
        },
        {
            name: "Michael Chen",
            role: "Full Stack Developer",
            image: "/api/placeholder/64/64",
            content: "The AI-powered learning path adapted perfectly to my learning style. I went from beginner to confident developer in just 6 months.",
            rating: 5
        },
        {
            name: "Emily Rodriguez",
            role: "UX Designer at Spotify",
            image: "/api/placeholder/64/64",
            content: "The design courses here are unmatched. The instructors are industry experts and the projects are real-world applicable.",
            rating: 5
        }
    ];

    return (
        <div className= "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50" >
        {/* Animated Background */ }
        < div className = "fixed inset-0 overflow-hidden pointer-events-none" >
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" > </div>
                < div className = "absolute top-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" > </div>
                    < div className = "absolute bottom-0 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" > </div>
                        </div>

    {/* Hero Section */ }
    <section className="relative pt-20 pb-32 px-4 overflow-hidden" >
        <div className="max-w-7xl mx-auto relative z-10" >
            <div className="grid lg:grid-cols-2 gap-16 items-center" >
                {/* Left Column */ }
                < div className = "space-y-8" >
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-6 py-3 shadow-lg" >
                        <Sparkles className="h-5 w-5 text-purple-600 animate-pulse" />
                            <span className="text-purple-700 font-bold text-sm tracking-wide" >🎯 TRANSFORM YOUR CAREER TODAY </span>
                                </div>

                                < h1 className = "text-6xl lg:text-7xl font-black bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 bg-clip-text text-transparent leading-tight" >
                                    Learn from the < span className = "bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" > Best </span>
                                        </h1>

                                        < p className = "text-2xl text-slate-600 leading-relaxed max-w-2xl" >
                                            Join over < span className = "font-bold text-purple-600" > 50,000 + </span> students mastering
    cutting - edge skills with our AI - powered learning platform.
              </p>

        < div className = "flex flex-col sm:flex-row gap-4" >
            <button 
                  onClick={ () => navigate('/courses') }
    className = "group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
        >
        <span className="flex items-center justify-center gap-2" >
            Start Learning Free
                < ArrowRight className = "h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    </button>

                    < button
    onClick = {() => navigate('/courses')}
className = "px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-900 rounded-2xl font-bold border border-slate-200 hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg"
    >
    Browse Courses
        </button>
        </div>

        < div className = "flex items-center gap-8 pt-8" >
            <div className="flex items-center gap-2" >
                <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-slate-600" > No credit card required </span>
                        </div>
                        < div className = "flex items-center gap-2" >
                            <CheckCircle className="h-5 w-5 text-green-500" />
                                <span className="text-slate-600" > Cancel anytime </span>
                                    </div>
                                    </div>
                                    </div>

{/* Right Column - Course Showcase */ }
<div className="relative" >
    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-3xl rotate-6 opacity-20" > </div>
        < div className = "relative bg-white rounded-3xl p-8 shadow-2xl" >
            <div className="flex items-center gap-4 mb-6" >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center" >
                    <Play className="h-6 w-6 text-white" />
                        </div>
                        < div >
                        <h3 className="font-bold text-slate-900" > Featured Course </h3>
                            < p className = "text-slate-600" > Full Stack Development </p>
                                </div>
                                </div>

                                < div className = "bg-gradient-to-r from-slate-100 to-blue-50 rounded-2xl p-6 mb-6" >
                                    <div className="flex items-center justify-between mb-4" >
                                        <span className="text-slate-700 font-medium" > Course Progress </span>
                                            < span className = "text-purple-600 font-bold" > 73 % </span>
                                                </div>
                                                < div className = "w-full bg-slate-200 rounded-full h-3" >
                                                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full w-3/4 transition-all duration-500" > </div>
                                                        </div>
                                                        </div>

                                                        < div className = "grid grid-cols-2 gap-4" >
                                                            <div className="text-center" >
                                                                <div className="font-bold text-2xl text-slate-900" > 24 </div>
                                                                    < div className = "text-slate-600 text-sm" > Lessons </div>
                                                                        </div>
                                                                        < div className = "text-center" >
                                                                            <div className="font-bold text-2xl text-slate-900" > 4.9 </div>
                                                                                < div className = "text-slate-600 text-sm" > Rating </div>
                                                                                    </div>
                                                                                    </div>
                                                                                    </div>
                                                                                    </div>
                                                                                    </div>
                                                                                    </div>
                                                                                    </section>

{/* Stats Section */ }
<section className="py-20 px-4 bg-white/50 backdrop-blur-sm" >
    <div className="max-w-7xl mx-auto" >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8" >
        {
            stats.map((stat, index) => (
                <div key= { index } className = "text-center group" >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform" >
            <div className="text-white" > { stat.icon } </div>
            </div>
            < div className = "text-3xl font-black text-slate-900 mb-2" > { stat.number } </div>
            < div className = "text-slate-600" > { stat.label } </div>
            </div>
            ))
        }
            </div>
            </div>
            </section>

{/* Features Section */ }
<section id="section-features" className = "py-32 px-4" >
    <div className="max-w-7xl mx-auto" >
        <div className="text-center mb-20" >
            <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-5 py-2 mb-6" >
                <Target className="h-5 w-5 text-purple-600" />
                    <span className="text-purple-700 font-bold text-sm" > WHY CHOOSE GGTL </span>
                        </div>
                        < h2 className = "text-5xl font-black text-slate-900 mb-6" >
                            Features that make us < span className = "bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" > Different </span>
                                </h2>
                                < p className = "text-xl text-slate-600 max-w-3xl mx-auto" >
                                    Discover the powerful features that have helped over 50,000 students achieve their career goals
                                        </p>
                                        </div>

                                        < div className = "grid md:grid-cols-2 lg:grid-cols-4 gap-8" >
                                        {
                                            features.map((feature, index) => (
                                                <div
                key= { index }
                className = "group p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                                                >
                                                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform`} >
                                            <div className="text-white" > { feature.icon } </div>
                                                </div>
                                                < h3 className = "text-xl font-bold text-slate-900 mb-4" > { feature.title } </h3>
                                                    < p className = "text-slate-600 leading-relaxed" > { feature.description } </p>
                                                        </div>
            ))}
</div>
    </div>
    </section>

{/* Courses Section */ }
<section id="section-courses" className = "py-32 px-4 bg-gradient-to-br from-slate-50 to-purple-50" >
    <div className="max-w-7xl mx-auto" >
        <div className="text-center mb-20" >
            <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-5 py-2 mb-6" >
                <BookOpen className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-700 font-bold text-sm" > FEATURED COURSES </span>
                        </div>
                        < h2 className = "text-5xl font-black text-slate-900 mb-6" >
                            Popular < span className = "bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" > Courses </span>
                                </h2>
                                < p className = "text-xl text-slate-600 max-w-3xl mx-auto" >
                                    Start your learning journey with our most popular and highly - rated courses
                                        </p>
                                        </div>

{
    loadingCourses ? (
        <div className= "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" >
        {
            [...Array(6)].map((_, i) => (
                <div key= { i } className = "bg-white rounded-3xl p-6 shadow-lg animate-pulse" >
                <div className="h-48 bg-slate-200 rounded-2xl mb-6" > </div>
            < div className = "h-4 bg-slate-200 rounded mb-4" > </div>
            < div className = "h-4 bg-slate-200 rounded w-2/3 mb-4" > </div>
            < div className = "h-8 bg-slate-200 rounded" > </div>
            </div>
            ))
        }
        </div>
          ) : (
        <>
        <div className= "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" >
        {
            courses.map((course, index) => (
                <div
                    key= { course.id }
                    onClick = {() => handleCourseClick(course.slug)}
    className = "group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
        >
        <div className="relative mb-6 overflow-hidden rounded-2xl" >
            <img
                        src={ course.thumbnail_url || '/api/placeholder/400/240' }
    alt = { course.title }
    className = "w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white/90 rounded-full px-3 py-1" >
            <span className="text-sm font-bold text-slate-900" >₦{ course.price } </span>
                </div>
                </div>

                < div className = "space-y-4" >
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors" >
                        { course.title }
                        </h3>

                        < p className = "text-slate-600 text-sm leading-relaxed line-clamp-2" >
                            { course.description }
                            </p>

                            < div className = "flex items-center justify-between pt-4 border-t border-slate-100" >
                                <div className="flex items-center gap-2" >
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                        <span className="text-sm font-medium text-slate-900" > { course.rating || 4.9 } </span>
                                            </div>
                                            < span className = "text-sm text-slate-500" > { course.instructor } </span>
                                                </div>
                                                </div>
                                                </div>
                ))
}
</div>

{
    courses.length === 0 && (
        <div className="text-center py-16 text-slate-500" >
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-xl" > No courses available at the moment </p>
                    </div>
              )
}

<div className="text-center mt-12" >
    <button 
                  onClick={ () => navigate('/courses') }
className = "px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
    >
    View All Courses
        < ArrowRight className = "inline-block ml-2 h-5 w-5" />
            </button>
            </div>
            </>
          )}
</div>
    </section>

{/* Testimonials */ }
<section id="section-testimonials" className = "py-32 px-4 bg-gradient-to-br from-purple-50 to-blue-50" >
    <div className="max-w-7xl mx-auto" >
        <div className="text-center mb-16" >
            <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-5 py-2 mb-6" >
                <MessageSquare className="h-5 w-5 text-purple-600" />
                    <span className="text-purple-700 font-bold text-sm" > SUCCESS STORIES </span>
                        </div>
                        < h2 className = "text-5xl font-black text-slate-900 mb-6" >
                            What our < span className = "bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" > Students </span> say
                                </h2>
                                < p className = "text-xl text-slate-600 max-w-3xl mx-auto" >
                                    Read success stories from our students who transformed their careers with GGTL
                                    </p>
                                    </div>

                                    < div className = "grid md:grid-cols-3 gap-8" >
                                    {
                                        testimonials.map((testimonial, index) => (
                                            <div key= { index } className = "bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300" >
                                            <div className="flex items-center gap-1 mb-6" >
                                        {
                                            [...Array(testimonial.rating)].map((_, i) => (
                                                <Star key= { i } className = "h-5 w-5 text-yellow-500 fill-current" />
                  ))
                                    }
                                        </div>

                                        < p className = "text-slate-600 leading-relaxed mb-6" > "{testimonial.content}" </p>

                                            < div className = "flex items-center gap-4" >
                                                <img
                    src={ testimonial.image }
alt = { testimonial.name }
className = "w-12 h-12 rounded-full object-cover"
    />
    <div>
    <div className="font-bold text-slate-900" > { testimonial.name } </div>
        < div className = "text-slate-600 text-sm" > { testimonial.role } </div>
            </div>
            </div>
            </div>
            ))}
</div>
    </div>
    </section>

{/* CTA Section */ }
<section className="py-32 px-4 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden" >
    <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] opacity-10" > </div>
        < div className = "max-w-4xl mx-auto text-center relative z-10" >
            <div className="mb-8" >
                <GraduationCap className="h-16 w-16 text-white mx-auto mb-6" />
                    <h2 className="text-5xl font-black text-white mb-6 leading-tight" >
                        Ready to < span className = "bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent" > Transform </span> Your Career?
                            </h2>
                            < p className = "text-xl text-purple-100 leading-relaxed max-w-2xl mx-auto" >
                                Start learning today with our expert - led courses.Join thousands of successful students who transformed their careers with GGTL.
            </p>
                                </div>

                                < div className = "flex flex-col sm:flex-row gap-4 justify-center" >
                                    <button 
              onClick={ () => navigate('/courses') }
className = "group relative px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-lg shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
    >
    <span className="flex items-center justify-center gap-2" >
        Start Learning Free
            < ArrowRight className = "h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                </button>

                < button
onClick = {() => navigate('/courses')}
className = "px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105"
    >
    Browse Courses
        </button>
        </div>

        < div className = "mt-16 flex justify-center gap-12 flex-wrap text-white/60 text-sm" >
            <div className="flex items-center gap-2" >
                <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>No credit card required </span>
                        </div>
                        < div className = "flex items-center gap-2" >
                            <CheckCircle className="h-5 w-5 text-green-400" />
                                <span>Cancel anytime </span>
                                    </div>
                                    < div className = "flex items-center gap-2" >
                                        <CheckCircle className="h-5 w-5 text-green-400" />
                                            <span>24 / 7 Support </span>
                                                </div>
                                                </div>
                                                </div>
                                                </section>
                                                </div>
  );
};

export default EnhancedLandingPage;