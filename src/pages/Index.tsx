import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Award, TrendingUp, Target, Zap, Play, Star, Clock, CheckCircle, ArrowRight, Globe, Shield, Sparkles } from 'lucide-react';
import heroImage from '@/assets/hero-learning.jpg';
import codingImage from '@/assets/coding-workspace.jpg';
import studentImage from '@/assets/student-success.jpg';

const Index = () => {
  const { user, openAuthModal, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Expert-Led Courses",
      description: "Learn from industry professionals with real-world experience"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Learning",
      description: "Connect with fellow learners and build your professional network"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Certificates",
      description: "Earn recognized certificates to showcase your new skills"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Fast Track Learning",
      description: "Accelerated courses designed for busy professionals"
    }
  ];

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {user.user_metadata?.full_name || user.email}!
            </h1>
            <p className="text-xl text-gray-600">Continue your learning journey</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    My Learning
                  </CardTitle>
                  <CardDescription>Continue where you left off</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">View Courses</Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Browse Catalog
                  </CardTitle>
                  <CardDescription>Discover new courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">Explore</Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Achievements
                  </CardTitle>
                  <CardDescription>Track your progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">View Progress</Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative py-20 lg:py-32 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(29, 78, 216, 0.95)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Transform Your Career</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Master In-Demand
                <span className="block text-accent"> Tech Skills</span>
              </h1>
              <p className="text-xl mb-8 text-white/90 leading-relaxed max-w-lg">
                Join thousands of professionals learning from industry experts. 
                Build the skills that matter most in today's digital economy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={openAuthModal}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 text-lg h-auto"
                >
                  Start Learning Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg h-auto backdrop-blur-sm"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Preview
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-2 bg-primary/10 rounded-lg px-3 py-1">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">45h Total</span>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="inline-block bg-accent/10 text-accent text-xs font-medium px-3 py-1 rounded-full mb-3">
                    BESTSELLER
                  </span>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Complete Web Development Bootcamp
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>32 Lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>2.4k Students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>4.9</span>
                    </div>
                  </div>
                </div>
                <img 
                  src={codingImage} 
                  alt="Coding workspace" 
                  className="w-full h-32 object-cover rounded-xl mb-4"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img 
                      src={studentImage} 
                      alt="Instructor" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-foreground">Sarah Chen</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">$89</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Trust Bar */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="py-16 bg-background"
      >
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Trusted by professionals from leading companies worldwide
          </p>
          <div className="flex justify-center items-center gap-12 flex-wrap opacity-70">
            <span className="text-2xl font-bold text-foreground">Google</span>
            <span className="text-2xl font-bold text-foreground">Microsoft</span>
            <span className="text-2xl font-bold text-foreground">Amazon</span>
            <span className="text-2xl font-bold text-foreground">Meta</span>
            <span className="text-2xl font-bold text-foreground">Netflix</span>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="py-24 bg-muted/30"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-primary font-medium">Why Choose GGTL</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Learn with Confidence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
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
                color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
              },
              {
                icon: <CheckCircle className="h-8 w-8" />,
                title: "Lifetime Access",
                description: "Get unlimited access to all course materials and future updates forever.",
                color: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
              },
              {
                icon: <Award className="h-8 w-8" />,
                title: "Certificates",
                description: "Earn industry-recognized certificates to showcase your achievements.",
                color: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
              },
              {
                icon: <Globe className="h-8 w-8" />,
                title: "Global Community",
                description: "Connect with learners worldwide and build your professional network.",
                color: "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="group"
              >
                <Card className="h-full p-8 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 border-0 bg-background">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Courses Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="py-24 bg-background"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Popular Courses
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover our most-loved courses that have helped thousands of students advance their careers.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Button variant="default" size="sm">All Courses</Button>
              <Button variant="outline" size="sm">Web Development</Button>
              <Button variant="outline" size="sm">Data Science</Button>
              <Button variant="outline" size="sm">Design</Button>
              <Button variant="outline" size="sm">Business</Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Complete React Developer Bootcamp",
                duration: "42h",
                lessons: 156,
                students: "12.5k",
                price: "$89",
                rating: 4.9,
                instructor: "Alex Johnson",
                image: codingImage,
                level: "Beginner to Advanced"
              },
              {
                title: "Python for Data Science & AI",
                duration: "38h",
                lessons: 124,
                students: "8.2k",
                price: "$79",
                rating: 4.8,
                instructor: "Dr. Maria Rodriguez",
                image: studentImage,
                level: "Intermediate"
              },
              {
                title: "UX/UI Design Masterclass",
                duration: "35h",
                lessons: 98,
                students: "6.7k",
                price: "$94",
                rating: 4.9,
                instructor: "David Kim",
                image: heroImage,
                level: "All Levels"
              }
            ].map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden border-0 bg-background shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <div className="relative">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {course.level}
                    </div>
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.duration}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students} students</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <img 
                        src={studentImage} 
                        alt={course.instructor}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-foreground">{course.instructor}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-foreground">{course.rating}</span>
                      </div>
                      <span className="text-2xl font-bold text-primary">{course.price}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="py-24 bg-muted/30"
      >
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
            {[
              {
                name: "Sarah Johnson",
                role: "Frontend Developer at Google",
                content: "GGTL's courses helped me transition from marketing to tech. The instructors are amazing and the content is always up-to-date.",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Data Scientist at Microsoft",
                content: "The Python course was exactly what I needed to advance my career. Clear explanations and practical projects made all the difference.",
                rating: 5
              },
              {
                name: "Emily Rodriguez",
                role: "UX Designer at Spotify",
                content: "As someone with no design background, GGTL made it possible for me to become a professional designer. Highly recommended!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              >
                <Card className="p-8 h-full border-0 bg-background shadow-lg">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img 
                      src={studentImage} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="py-24 bg-primary text-primary-foreground relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Ready to Transform
              <span className="block">Your Career?</span>
            </h2>
            <p className="text-xl mb-12 text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Join over 50,000 students who are already building the skills they need 
              to succeed in the digital economy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={openAuthModal}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-12 py-6 text-lg h-auto"
              >
                Start Learning for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-12 py-6 text-lg h-auto"
              >
                View All Courses
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Index;
