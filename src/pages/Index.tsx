import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Users, Award, TrendingUp, Target, Zap, Play, Star, Clock, CheckCircle, ArrowRight, Globe, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/hero-learning.jpg';
import codingImage from '@/assets/coding-workspace.jpg';
import studentImage from '@/assets/student-success.jpg';

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
}
const Index = () => {
  const { user, loading } = useAuth();
  const { openAuthModal } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name')
          .limit(4);
        
        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
        } else {
          setCategories(categoriesData || []);
        }

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
        
        if (coursesError) {
          console.error('Error fetching courses:', coursesError);
        } else {
          setCourses(coursesData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>;
  }

  const features = [{
    icon: <BookOpen className="h-8 w-8" />,
    title: "Expert-Led Courses",
    description: "Learn from industry professionals with real-world experience"
  }, {
    icon: <Users className="h-8 w-8" />,
    title: "Community Learning",
    description: "Connect with fellow learners and build your professional network"
  }, {
    icon: <Award className="h-8 w-8" />,
    title: "Certificates",
    description: "Earn recognized certificates to showcase your new skills"
  }, {
    icon: <Zap className="h-8 w-8" />,
    title: "Fast Track Learning",
    description: "Accelerated courses designed for busy professionals"
  }];

  // Always show the public home page regardless of authentication status

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Modern Glassmorphism Design */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative section-padding overflow-hidden bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent-400/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-primary-300/20 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-accent-300/30 rounded-full blur-lg animate-float" style={{animationDelay: '2s'}}></div>

        <div className="container-wide px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 glass rounded-full px-6 py-3 mb-8 border border-white/30">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-semibold">Transform Your Career Today</span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-display mb-8 leading-tight">
                Master In-Demand
                <span className="block text-gradient-accent bg-gradient-to-r from-accent-300 to-accent-100 bg-clip-text text-transparent">
                  Tech Skills
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-body-large mb-12 text-white/90 leading-relaxed max-w-2xl">
                Join thousands of professionals learning from industry experts. 
                Build the skills that matter most in today's digital economy.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6">
                <Button 
                  size="xl" 
                  variant="accent"
                  onClick={openAuthModal} 
                  className="group shadow-2xl"
                >
                  Start Learning Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="xl" 
                  variant="glass"
                  className="backdrop-blur-md"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Preview
                </Button>
              </div>
            </motion.div>
            
            {/* Right Column - Course Preview Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="card-glass p-8 rounded-3xl shadow-glass border border-white/20 backdrop-blur-xl">
                {/* Browser Mockup Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-2 bg-primary-500/20 rounded-xl px-4 py-2 backdrop-blur-sm">
                    <Clock className="h-4 w-4 text-white" />
                    <span className="text-sm font-semibold text-white">45h Total</span>
                  </div>
                </div>
                
                {/* Course Content */}
                <div className="mb-6">
                  <div className="inline-block bg-accent-500/20 text-accent-300 text-xs font-bold px-4 py-2 rounded-full mb-4 backdrop-blur-sm">
                    BESTSELLER
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Complete Web Development Bootcamp
                  </h3>
                  <div className="flex items-center gap-6 text-sm text-white/80">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>32 Lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>2.4k Students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-accent-400" />
                      <span>4.9</span>
                    </div>
                  </div>
                </div>
                
                {/* Course Image */}
                <div className="relative mb-6 rounded-2xl overflow-hidden">
                  <img 
                    src={codingImage} 
                    alt="Coding workspace" 
                    className="w-full h-40 object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                {/* Instructor & Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={studentImage} 
                      alt="Instructor" 
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30" 
                    />
                    <span className="text-sm font-semibold text-white">Sarah Chen</span>
                  </div>
                  <span className="text-3xl font-bold text-accent-300">$89</span>
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-4 card-glass p-4 rounded-2xl border border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">98%</div>
                  <div className="text-xs text-white/70">Success Rate</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Trust Bar - Modern Design */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="py-20 bg-background-secondary/30"
      >
        <div className="container-wide px-4">
          <p className="text-center text-muted-foreground mb-12 text-lg font-medium">
            Trusted by professionals from leading companies worldwide
          </p>
          <div className="flex justify-center items-center gap-16 flex-wrap">
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'].map((company, index) => (
              <motion.span
                key={company}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="text-2xl font-bold text-foreground/60 hover:text-primary transition-colors cursor-default"
              >
                {company}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section - Modern Card Design */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="section-padding bg-background"
      >
        <div className="container-wide px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 rounded-full px-6 py-3 mb-6 shadow-sm">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">Why Choose GGTL</span>
            </div>
            <h2 className="text-headline text-foreground mb-6">
              Learn with Confidence
            </h2>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our platform combines expert instruction with cutting-edge technology 
              to deliver an unparalleled learning experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BookOpen className="h-8 w-8" />,
                title: "Expert Instructors",
                description: "Learn from industry veterans with real-world experience and proven track records.",
                gradient: "from-primary-500 to-primary-600",
                bg: "bg-primary-50",
                iconColor: "text-primary-600"
              },
              {
                icon: <CheckCircle className="h-8 w-8" />,
                title: "Lifetime Access",
                description: "Get unlimited access to all course materials and future updates forever.",
                gradient: "from-success to-success/80",
                bg: "bg-green-50",
                iconColor: "text-green-600"
              },
              {
                icon: <Award className="h-8 w-8" />,
                title: "Certificates",
                description: "Earn industry-recognized certificates to showcase your achievements.",
                gradient: "from-accent-500 to-accent-600",
                bg: "bg-accent-50",
                iconColor: "text-accent-600"
              },
              {
                icon: <Globe className="h-8 w-8" />,
                title: "Global Community",
                description: "Connect with learners worldwide and build your professional network.",
                gradient: "from-indigo-500 to-indigo-600",
                bg: "bg-indigo-50",
                iconColor: "text-indigo-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="group"
              >
                <div className="card-premium p-8 h-full rounded-3xl interactive-hover border-0 bg-card">
                  <div className={`w-20 h-20 ${feature.bg} rounded-3xl flex items-center justify-center mb-6 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Courses Section */}
      <motion.section initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.8,
      delay: 0.6
    }} className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Popular Courses
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover our most-loved courses that have helped thousands of students advance their careers.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Button variant="default" size="sm" asChild>
                <Link to="/courses">All Courses</Link>
              </Button>
              {categories.map(category => <Button key={category.id} variant="outline" size="sm" asChild>
                  <Link to={`/courses?category=${category.id}`}>{category.name}</Link>
                </Button>)}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coursesLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                >
                  <Card className="overflow-hidden border-0 bg-background shadow-lg">
                    <Skeleton className="w-full h-48" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <div className="flex gap-4 mb-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-12" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : courses.length > 0 ? (
              // Real course data
              courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <Link to={`/courses/${course.slug}`}>
                    <Card className="overflow-hidden border-0 bg-background shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                      <div className="relative">
                        <img 
                          src={course.thumbnail_url || codingImage} 
                          alt={course.title} 
                          className="w-full h-48 object-cover" 
                        />
                        <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                          {course.categories?.name || 'General'}
                        </div>
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {Math.floor((course.total_duration || 0) / 60)}h
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{course.total_lessons || 0} lessons</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>0 students</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <img 
                            src={studentImage} 
                            alt={course.profiles?.full_name || 'Instructor'} 
                            className="w-8 h-8 rounded-full object-cover" 
                          />
                          <span className="text-sm font-medium text-foreground">
                            {course.profiles?.full_name || 'Instructor'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-foreground">4.8</span>
                          </div>
                          <span className="text-2xl font-bold text-primary">
                            {course.price === 0 ? 'Free' : `$${course.price}`}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))
            ) : (
              // No courses found
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">No courses available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.8,
      delay: 0.8
    }} className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              What Our Students Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied learners who have transformed their careers with GGTL.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[{
            name: "Sarah Johnson",
            role: "Frontend Developer at Google",
            content: "GGTL's courses helped me transition from marketing to tech. The instructors are amazing and the content is always up-to-date.",
            rating: 5
          }, {
            name: "Michael Chen",
            role: "Data Scientist at Microsoft",
            content: "The Python course was exactly what I needed to advance my career. Clear explanations and practical projects made all the difference.",
            rating: 5
          }, {
            name: "Emily Rodriguez",
            role: "UX Designer at Spotify",
            content: "As someone with no design background, GGTL made it possible for me to become a professional designer. Highly recommended!",
            rating: 5
          }].map((testimonial, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.9 + index * 0.1
          }}>
                <Card className="p-8 h-full border-0 bg-background shadow-lg">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img src={studentImage} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.8,
      delay: 1.0
    }} className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 1.2
        }}>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Ready to Transform
              <span className="block">Your Career?</span>
            </h2>
            <p className="text-xl mb-12 text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Join over 50,000 students who are already building the skills they need 
              to succeed in the digital economy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={openAuthModal} className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-12 py-6 text-lg h-auto">
                Start Learning for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-white hover:text-primary-foreground px-12 py-6 text-lg h-auto bg-slate-500 hover:bg-slate-400">
                View All Courses
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>;
};
export default Index;