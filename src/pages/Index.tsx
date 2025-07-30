import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Award, TrendingUp, Target, Zap } from 'lucide-react';

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-br from-primary to-primary/80 text-white py-20 lg:py-32 overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="h-6 w-6" />
                <span className="text-sm font-medium uppercase tracking-wider">Show Up For Learning</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Unlock Your Potential with{" "}
                <span className="text-yellow-400">In-Demand Tech Skills</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Choose from 100+ online video courses with new additions published every month. 
                Learn from industry experts and advance your career.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={openAuthModal}
                  className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold px-8 py-4 text-lg"
                >
                  Start Free Trial
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg"
                >
                  See Our Lesson Showcase
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative z-10">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">WORLDWIDE BEST ONLINE COURSE</span>
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold">50h</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Advanced Excel Techniques for Financial</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span>📚 24 Lessons</span>
                    <span>👥 38 Students</span>
                  </div>
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
        className="py-12 bg-white border-b"
      >
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600 mb-8">Trusted by professionals from leading companies</p>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            <span className="text-2xl font-bold">Google</span>
            <span className="text-2xl font-bold">Microsoft</span>
            <span className="text-2xl font-bold">Amazon</span>
            <span className="text-2xl font-bold">Netflix</span>
            <span className="text-2xl font-bold">Apple</span>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-primary font-medium uppercase tracking-wider">Why Choose GGTL</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Learn From Experts</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform offers world-class learning experiences designed to help you succeed in your career
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-green-50 p-8 rounded-2xl"
            >
              <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Learn From Experts</h3>
              <p className="text-gray-600">Get guidance from industry professionals with years of real-world experience.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-pink-50 p-8 rounded-2xl"
            >
              <div className="w-16 h-16 bg-pink-500 rounded-xl flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Earn a Certificate</h3>
              <p className="text-gray-600">Receive industry-recognized certificates to showcase your new skills.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-blue-50 p-8 rounded-2xl"
            >
              <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">5400+ Courses</h3>
              <p className="text-gray-600">Access thousands of courses across multiple disciplines and skill levels.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Courses Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Latest Bundle Courses</h2>
            <div className="flex justify-center space-x-4 mb-8">
              <Button className="bg-primary text-white">HTML & CSS</Button>
              <Button variant="outline">Python</Button>
              <Button variant="outline">Data Analysis</Button>
              <Button variant="outline">Machine Learning</Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "E-commerce Strategies for Small Businesses",
                duration: "50h 00m",
                lessons: 24,
                students: 38,
                price: "₦141",
                color: "from-red-400 to-orange-400"
              },
              {
                title: "Product Essentials: From Idea to Market", 
                duration: "50h 00m",
                lessons: 24,
                students: 38,
                price: "₦140",
                color: "from-blue-400 to-cyan-400"
              },
              {
                title: "Mindful Leadership: Leading with Compassion",
                duration: "50h 00m", 
                lessons: 24,
                students: 38,
                price: "₦156",
                color: "from-green-400 to-emerald-400"
              },
              {
                title: "Advanced Excel Techniques for Financial",
                duration: "50h 00m",
                lessons: 24, 
                students: 38,
                price: "₦64",
                color: "from-purple-400 to-pink-400"
              }
            ].map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`h-48 bg-gradient-to-br ${course.color} relative`}>
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    🕒 {course.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-4 line-clamp-2">{course.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span>📚 {course.lessons} Lessons</span>
                    <span>👥 {course.students} Students</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Instructor</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm">Add To Cart →</Button>
                    <span className="font-bold text-lg">{course.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="py-20 bg-gradient-to-r from-green-400 to-green-600 text-white"
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Eager to Receive Special Offers & Updates on Courses?
              </h2>
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Your email address..."
                  className="flex-1 px-6 py-4 rounded-xl text-gray-900"
                />
                <Button className="bg-primary hover:bg-primary/90 px-8 py-4 rounded-xl">
                  Subscribe
                </Button>
              </div>
            </div>
            <div className="text-center">
              <div className="w-64 h-64 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="py-20 bg-primary text-white"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of students who are already advancing their careers with GGTL
          </p>
          <Button 
            size="lg" 
            onClick={openAuthModal}
            className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold px-12 py-4 text-lg"
          >
            Sign Up for Free
          </Button>
        </div>
      </motion.section>
    </div>
  );
};

export default Index;
