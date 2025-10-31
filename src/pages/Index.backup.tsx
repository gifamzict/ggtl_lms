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
      role: "Senior Developer at Google",
      content: "GGTL transformed my career completely. The courses are comprehensive, practical, and taught by industry experts. Best investment I've ever made!",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=1"
    },
    {
      name: "Michael Chen",
      role: "Data Scientist at Microsoft",
      content: "The quality of instruction is phenomenal. I went from zero coding knowledge to landing my dream job in just 8 months. Absolutely life-changing!",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=3"
    },
    {
      name: "Emily Rodriguez",
      role: "Lead Designer at Spotify",
      content: "As a career changer, GGTL gave me everything I needed. The community support and hands-on projects made all the difference. Highly recommended!",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=5"
    }
  ];

  return (
    <div className= "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50" >
    {/* Animated Background Elements */ }
    < div className = "fixed inset-0 overflow-hidden pointer-events-none" >
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" > </div>
        < div className = "absolute top-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" > </div>
          < div className = "absolute bottom-0 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" > </div>
            </div>

  {/* Hero Section */ }
  <section className="relative pt-20 pb-32 px-4 overflow-hidden" >
    <div className="max-w-7xl mx-auto relative z-10" >
      <div className="grid lg:grid-cols-2 gap-16 items-center" >
        {/* Left Content */ }
        < div className = "space-y-8" >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-full px-5 py-2.5 border border-purple-200" >
            <Sparkles className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" >
                  #1 Learning Platform in Nigeria
    </span>
    </div>

    < h1 className = "text-6xl lg:text-7xl font-black leading-tight" >
      <span className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent" >
        Master the Skills
          </span>
          < br />
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent" >
            That Matter Most
              </span>
              </h1>

              < p className = "text-xl text-slate-600 leading-relaxed max-w-xl" >
                Join 50,000 + professionals transforming their careers with expert - led courses in tech, design, and business.Learn at your own pace, build real projects, and get hired.
              </p>

                  < div className = "flex flex-col sm:flex-row gap-4" >
                    <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105" >
                      <span className="flex items-center justify-center gap-2" >
                        Start Learning Free
                          < ArrowRight className = "h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            < div className = "absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400 to-blue-400 blur-xl opacity-0 group-hover:opacity-50 transition-opacity -z-10" > </div>
                              </button>

                              < button className = "group px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-900 rounded-2xl font-bold text-lg border-2 border-slate-200 hover:border-purple-300 transition-all duration-300 hover:scale-105 shadow-lg" >
                                <span className="flex items-center justify-center gap-2" >
                                  <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                    Watch Demo
                                      </span>
                                      </button>
                                      </div>

  {/* Stats Row */ }
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8" >
  {
    stats.map((stat, index) => (
      <div key= { index } className = "text-center" >
      <div className="flex justify-center mb-2 text-purple-600" >
      { stat.icon }
      </div>
    < div className = "text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" >
    { stat.number }
    </div>
    < div className = "text-sm text-slate-600 font-medium" > { stat.label } </div>
    </div>
    ))
  }
    </div>
    </div>

  {/* Right Content - Featured Course Card */ }
  <div className="relative" >
    <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-2xl opacity-20" > </div>
      < div className = "relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden" >
      {
        loadingCourses?(
                    <div className = "h-96 flex items-center justify-center" >
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"> </div>
        </div>
                  ) : courses.length > 0 ? (
  <>
  {/* Image */ }
  < div className = "relative h-56 overflow-hidden" >
    <img 
                          src={ courses[0].thumbnail_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop" }
alt = { courses[0].title }
className = "w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" > </div>
    < div className = "absolute top-4 left-4" >
      <span className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg" >
                            🔥 { courses[0].status === 'PUBLISHED' ? 'LIVE' : 'NEW' }
</span>
  </div>
  < div className = "absolute top-4 right-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full" >
    <Clock className="h-4 w-4 text-white" />
      <span className="text-white text-sm font-semibold" > { courses[0].total_duration || 0 }h </span>
        </div>
        </div>

{/* Content */ }
<div className="p-8" >
  <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight" >
    { courses[0].title }
    </h3>

    < div className = "flex items-center gap-6 mb-6 text-sm text-slate-600" >
      <div className="flex items-center gap-2" >
        <BookOpen className="h-4 w-4 text-purple-600" />
          <span className="font-medium" > { courses[0].total_lessons || 0 } Lessons </span>
            </div>
            < div className = "flex items-center gap-2" >
              <Users className="h-4 w-4 text-blue-600" />
                <span className="font-medium" > { courses[0].enrollment_count || 0 } Students </span>
                  </div>
                  < div className = "flex items-center gap-1" >
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-slate-900" > { courses[0].average_rating || 'N/A' } </span>
                        </div>
                        </div>

                        < div className = "flex items-center justify-between pt-4 border-t border-slate-200" >
                          <div className="flex items-center gap-3" >
                            <img 
                              src="https://i.pravatar.cc/150?img=2"
alt = { courses[0].instructor?.full_name || 'Instructor' }
className = "w-12 h-12 rounded-full ring-2 ring-purple-500/20"
  />
  <div>
  <div className="text-sm font-semibold text-slate-900" > { courses[0].instructor?.full_name || 'Instructor' } </div>
    < div className = "text-xs text-slate-500" > Expert Instructor </div>
      </div>
      </div>
      < div className = "text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" >
                            ₦{ parseFloat(courses[0].price).toLocaleString() }
</div>
  </div>
  </div>
  </>
                  ) : (
  <div className= "h-96 flex items-center justify-center text-slate-500" >
  No courses available
    </div>
                  )}
</div>
  </div>
  </div>
  </div>
  </section>

{/* Trust Badges */ }
<section className="py-12 bg-white/50 backdrop-blur-sm border-y border-slate-200" >
  <div className="max-w-7xl mx-auto px-4" >
    <p className="text-center text-slate-500 mb-8 font-medium" > Trusted by learners from </p>
      < div className = "flex justify-center items-center gap-16 flex-wrap" >
      {
        ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix'].map((company) => (
          <span key= { company } className = "text-2xl font-bold text-slate-400 hover:text-slate-900 transition-colors" >
          { company }
          </span>
        ))
      }
        </div>
        </div>
        </section>

{/* Features Section */ }
<section id="section-features" className = "py-32 px-4 relative" >
  <div className="max-w-7xl mx-auto" >
    <div className="text-center mb-20" >
      <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-5 py-2 mb-6" >
        <Shield className="h-5 w-5 text-purple-600" />
          <span className="text-purple-700 font-bold text-sm" > WHY CHOOSE GGTL </span>
            </div>
            < h2 className = "text-5xl lg:text-6xl font-black mb-6" >
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent" >
                Everything You Need to
                  </span>
                  < br />
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" >
                    Excel in Your Career
                      </span>
                      </h2>
                      < p className = "text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed" >
                        World - class education platform with cutting - edge technology and industry - recognized certifications
                          </p>
                          </div>

                          < div className = "grid md:grid-cols-2 lg:grid-cols-4 gap-8" >
                          {
                            features.map((feature, index) => (
                              <div
                key= { index }
                className = "group relative"
                style = {{ animationDelay: `${feature.delay}s` }}
                            >
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" > </div>
                              < div className = "relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100" >
                                <div className={ `w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 text-white shadow-lg` }>
                                  { feature.icon }
                                  </div>
                                  < h3 className = "text-xl font-bold text-slate-900 mb-3" >
                                    { feature.title }
                                    </h3>
                                    < p className = "text-slate-600 leading-relaxed" >
                                      { feature.description }
                                      </p>
                                      </div>
                                      </div>
            ))}
</div>
  </div>
  </section>

{/* Categories Section */ }
<section className="py-24 px-4 bg-gradient-to-br from-slate-900 to-purple-900 text-white relative overflow-hidden" >
  <div className="absolute inset-0 opacity-10" >
    <div className="absolute top-0 left-0 w-full h-full" style = {{
  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
    backgroundSize: '40px 40px'
}}> </div>
  </div>

  < div className = "max-w-7xl mx-auto relative z-10" >
    <div className="text-center mb-16" >
      <h2 className="text-5xl font-black mb-6" > Explore Popular Categories </h2>
        < p className = "text-xl text-white/80 max-w-2xl mx-auto" >
          Find the perfect course to achieve your career goals
            </p>
            </div>

            < div className = "grid md:grid-cols-2 lg:grid-cols-4 gap-6" >
            {
              categories.map((category, index) => (
                <div
                key= { index }
                className = "group relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/30 hover:-translate-y-2"
                >
                <div className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform`} >
              { category.icon }
              </div>
              < h3 className = "text-xl font-bold mb-2" > { category.name } </h3>
                < p className = "text-white/70 text-sm mb-4" > { category.courses } Courses Available </p>
                  < div className = "flex items-center text-sm font-semibold text-white/90 group-hover:text-white" >
                    Explore < ChevronRight className = "h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                      </div>
            ))}
</div>
  </div>
  </section>
{/* Featured Courses */ }
<section id="section-courses" className = "py-32 px-4" >
  <div className="max-w-7xl mx-auto" >
    <div className="text-center mb-16" >
      <h2 className="text-5xl lg:text-6xl font-black mb-6" >
        <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent" >
          Featured Courses
            </span>
            </h2>
            < p className = "text-xl text-slate-600 max-w-2xl mx-auto" >
              Hand - picked courses that helped thousands advance their careers
                </p>
                </div>

{
  loadingCourses ? (
    <div className= "flex justify-center items-center h-96" >
    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent" > </div>
      </div>
          ) : (
    <>
    <div className= "grid md:grid-cols-2 lg:grid-cols-3 gap-8" >
    {
      courses.map((course, index) => (
        <div
                    key= { course.id }
                    className = "group relative cursor-pointer"
                    onClick = {() => handleCourseClick(course.slug)}
    >
    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" > </div>
      < div className = "relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100" >
        <div className="relative h-52 overflow-hidden" >
          <img 
                          src={ course.thumbnail_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop" }
  alt = { course.title }
  className = "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" > </div>
      < div className = "absolute top-4 left-4" >
        <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold rounded-full" >
          { course.level }
          </span>
          </div>
          < div className = "absolute bottom-4 left-4 right-4 flex items-center justify-between" >
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full" >
              <Clock className="h-3 w-3 text-white" />
                <span className="text-white text-xs font-semibold" > { course.total_duration || 0 }h </span>
                  </div>
                  < div className = "flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full" >
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-white text-xs font-bold" > { course.average_rating || 'N/A' } </span>
                        </div>
                        </div>
                        </div>

                        < div className = "p-6" >
                          <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors" >
                            { course.title }
                            </h3>

                            < div className = "flex items-center gap-4 mb-4 text-sm text-slate-600" >
                              <div className="flex items-center gap-1" >
                                <BookOpen className="h-4 w-4" />
                                  <span>{ course.total_lessons || 0 } </span>
                                  </div>
                                  < div className = "flex items-center gap-1" >
                                    <Users className="h-4 w-4" />
                                      <span>{ course.enrollment_count || 0 } </span>
                                      </div>
                                      </div>

                                      < div className = "flex items-center justify-between pt-4 border-t border-slate-200" >
                                        <div className="flex items-center gap-2" >
                                          <img 
                              src={ `https://i.pravatar.cc/150?img=${index + 2}` }
  alt = { course.instructor?.full_name || 'Instructor' }
  className = "w-8 h-8 rounded-full"
    />
    <span className="text-sm font-semibold text-slate-700" > { course.instructor?.full_name || 'Instructor' } </span>
      </div>
      < span className = "text-2xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" >
                            ₦{ parseFloat(course.price).toLocaleString() }
  </span>
    </div>
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
          )
        }
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
            < h2 className = "text-5xl lg:text-6xl font-black mb-6" >
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent" >
                Loved by Students
                  </span>
                  < br />
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" >
                    Worldwide
                    </span>
                    </h2>
                    </div>

                    < div className = "grid md:grid-cols-2 lg:grid-cols-3 gap-8" >
                    {
                      testimonials.map((testimonial, index) => (
                        <div
                key= { index }
                className = "bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100"
                        >
                        <div className="flex items-center gap-1 mb-6" >
                      {
                        [...Array(testimonial.rating)].map((_, i) => (
                          <Star key= { i } className = "h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))
                    }
                      </div>
                      < p className = "text-slate-700 mb-6 leading-relaxed italic" >
                        "{testimonial.content}"
                        </p>
                        < div className = "flex items-center gap-4" >
                          <img 
                    src={ testimonial.image }
alt = { testimonial.name }
className = "w-14 h-14 rounded-full ring-4 ring-purple-100"
  />
  <div>
  <h4 className="font-bold text-slate-900" > { testimonial.name } </h4>
    < p className = "text-sm text-slate-600" > { testimonial.role } </p>
      </div>
      </div>
      </div>
            ))}
</div>
  </div>
  </section>

{/* Final CTA */ }
<section className="py-32 px-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900" >
  <div className="absolute inset-0 opacity-10" >
    <div className="absolute top-0 left-0 w-full h-full" style = {{
  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
    backgroundSize: '40px 40px'
}}> </div>
  </div>

  < div className = "max-w-4xl mx-auto text-center relative z-10" >
    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8" >
      <Rocket className="h-5 w-5 text-white" />
        <span className="text-white font-semibold" > JOIN 50,000 + STUDENTS TODAY </span>
          </div>

          < h2 className = "text-5xl lg:text-7xl font-black text-white mb-8 leading-tight" >
            Ready to Transform
              < br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent" >
                Your Future ?
                  </span>
                  </h2>

                  < p className = "text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed" >
                    Start learning today with our expert - led courses.Join thousands of successful students who transformed their careers with GGTL.
          </p>

                    < div className = "flex flex-col sm:flex-row gap-4 justify-center" >
                      <button 
                        onClick={ () => navigate('/courses') }
className = "group relative px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-lg shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105" >
  <span className="flex items-center justify-center gap-2" >
    Start Learning Free
      < ArrowRight className = "h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </span>
        </button>

        < button
onClick = {() => navigate('/courses')}
className = "px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105" >
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
                      <span>30 - day money back guarantee </span>
                        </div>
                        </div>
                        </div>
                        </section>
                        </div>
  );
};

export default EnhancedLandingPage;

// Add these styles to your global CSS or Tailwind config
const styles = `
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
`;