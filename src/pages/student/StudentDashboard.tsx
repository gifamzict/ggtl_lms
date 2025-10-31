import { useState, useEffect } from "react";
import { useLaravelAuth } from "@/store/laravelAuthStore";
import { studentDashboardApi } from "@/services/api/studentDashboardApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Star,
  TrendingUp,
  Award,
  Calendar,
  Play,
  CheckCircle,
  Target,
  BarChart3,
  Sparkles,
  Trophy,
  Zap,
  BookOpenCheck,
  GraduationCap,
  Timer,
  Users
} from "lucide-react";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface EnrolledCourse {
  id: number;
  title: string;
  slug: string;
  thumbnail_url?: string;
  instructor?: {
    full_name: string;
  };
  total_lessons: number;
  completed_lessons?: number;
  progress_percentage?: number;
  last_accessed?: string;
}

interface DashboardStats {
  total_courses: number;
  completed_courses: number;
  total_hours: number;
  certificates_earned: number;
  current_streak: number;
  total_progress: number;
}

export default function StudentDashboard() {
  const { user, isAuthenticated } = useLaravelAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_courses: 0,
    completed_courses: 0,
    total_hours: 0,
    certificates_earned: 0,
    current_streak: 0,
    total_progress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const coursesData = await studentDashboardApi.getEnrolledCourses();
      setEnrolledCourses(coursesData.slice(0, 4)); // Show only first 4 courses on dashboard

      // Calculate stats from courses data
      const totalCourses = coursesData.length;
      const completedCourses = coursesData.filter(c => c.progress_percentage === 100).length;
      const avgProgress = coursesData.reduce((acc, course) => acc + (course.progress_percentage || 0), 0) / totalCourses || 0;

      setStats({
        total_courses: totalCourses,
        completed_courses: completedCourses,
        total_hours: Math.floor(totalCourses * 2.5), // Estimate
        certificates_earned: completedCourses,
        current_streak: 7, // Mock data
        total_progress: Math.round(avgProgress)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getUserDisplayName = () => {
    if (user?.full_name) return user.full_name;
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'Student';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const statCards = [
    {
      title: "Total Courses",
      value: stats.total_courses,
      icon: BookOpen,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Completed",
      value: stats.completed_courses,
      icon: CheckCircle,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Learning Hours",
      value: `${stats.total_hours}h`,
      icon: Clock,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "Certificates",
      value: stats.certificates_earned,
      icon: Award,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    }
  ];

  if (loading) {
    return (
      <SidebarProvider>
      <div className= "min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50" >
      <StudentSidebar />
      < div className = "flex-1 flex items-center justify-center" >
        <motion.div 
              initial={ { opacity: 0, scale: 0.9 } }
    animate = {{ opacity: 1, scale: 1 }
  }
  className = "text-center space-y-4"
    >
    <div className="relative" >
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" > </div>
        < Sparkles className = "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
          </div>
          < p className = "text-gray-600 font-medium" > Loading your dashboard...</p>
            </motion.div>
            </div>
            </div>
            </SidebarProvider>
    );
}

return (
  <SidebarProvider>
  <div className= "min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50" >
  <StudentSidebar />
  < div className = "flex-1" >
    {/* Hero Header */ }
    < div className = "relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700" >
      <div className="absolute inset-0 bg-black/10" > </div>
        < div className = "absolute inset-0 bg-gradient-to-r from-blue-600/80 via-purple-600/80 to-indigo-700/80" > </div>

{/* Decorative shapes */ }
<div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" > </div>
  < div className = "absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" > </div>

    < div className = "relative z-10 p-8 pb-12" >
      <div className="flex items-center justify-between mb-8" >
        <div className="flex items-center space-x-4" >
          <SidebarTrigger className="md:hidden text-white hover:bg-white/10 rounded-lg p-2" />
            <div className="flex items-center space-x-3" >
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm" >
                <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  < div >
                  <h1 className="text-2xl font-bold text-white" > GGTL Student Portal </h1>
                    < p className = "text-blue-100" > Your learning journey continues </p>
                      </div>
                      </div>
                      </div>

                      < div className = "flex items-center space-x-4" >
                        <div className="text-right" >
                          <p className="text-blue-100 text-sm" > { getGreeting() }, </p>
                            < p className = "text-white font-semibold text-lg" > { getUserDisplayName() } </p>
                              </div>
                              < Avatar className = "h-12 w-12 ring-4 ring-white/30" >
                                <AvatarImage src={ user?.avatar_url } />
                                  < AvatarFallback className = "bg-white/20 text-white font-bold" >
                                    { getUserInitials() }
                                    </AvatarFallback>
                                    </Avatar>
                                    </div>
                                    </div>

{/* Quick Stats */ }
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" >
{
  statCards.map((stat, index) => (
    <motion.div
                    key= { stat.title }
                    initial = {{ opacity: 0, y: 20 }}
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: index * 0.1 }}
                  >
  <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300" >
    <CardContent className="p-6" >
      <div className="flex items-center justify-between" >
        <div>
        <p className="text-sm text-gray-600 mb-1" > { stat.title } </p>
          < p className = "text-2xl font-bold text-gray-900" > { stat.value } </p>
            </div>
            < div className = {`p-3 ${stat.bgColor} rounded-xl`}>
              <stat.icon className={ `h-6 w-6 ${stat.textColor}` } />
                </div>
                </div>
                </CardContent>
                </Card>
                </motion.div>
                ))}
</div>
  </div>
  </div>

{/* Main Content */ }
<div className="p-8 space-y-8" >
  {/* Progress Overview */ }
  < motion.div
initial = {{ opacity: 0, y: 20 }}
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: 0.5 }}
            >
  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg" >
    <CardHeader className="pb-4" >
      <div className="flex items-center justify-between" >
        <div className="flex items-center space-x-3" >
          <div className="p-2 bg-green-100 rounded-lg" >
            <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              < div >
              <CardTitle className="text-xl text-green-800" > Learning Progress </CardTitle>
                < p className = "text-green-600 text-sm" > Keep up the great work! </p>
                  </div>
                  </div>
                  < Badge variant = "secondary" className = "bg-green-100 text-green-700 hover:bg-green-200" >
                    <Trophy className="w-4 h-4 mr-1" />
                      { stats.current_streak } day streak
                        </Badge>
                        </div>
                        </CardHeader>
                        < CardContent >
                        <div className="space-y-4" >
                          <div className="flex items-center justify-between" >
                            <span className="text-sm font-medium text-green-700" > Overall Progress </span>
                              < span className = "text-sm font-bold text-green-800" > { stats.total_progress } % </span>
                                </div>
                                < Progress value = { stats.total_progress } className = "h-3 bg-green-100" />
                                  <div className="grid grid-cols-2 gap-4 mt-6" >
                                    <div className="text-center p-4 bg-white/50 rounded-lg" >
                                      <div className="text-2xl font-bold text-green-600" > { stats.completed_courses } </div>
                                        < div className = "text-sm text-green-700" > Courses Completed </div>
                                          </div>
                                          < div className = "text-center p-4 bg-white/50 rounded-lg" >
                                            <div className="text-2xl font-bold text-green-600" > { stats.total_courses - stats.completed_courses } </div>
                                              < div className = "text-sm text-green-700" > In Progress </div>
                                                </div>
                                                </div>
                                                </div>
                                                </CardContent>
                                                </Card>
                                                </motion.div>

{/* Continue Learning Section */ }
<motion.div
              initial={ { opacity: 0, y: 20 } }
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: 0.6 }}
            >
  <div className="flex items-center justify-between mb-6" >
    <div className="flex items-center space-x-3" >
      <div className="p-2 bg-blue-100 rounded-lg" >
        <Play className="h-6 w-6 text-blue-600" />
          </div>
          < div >
          <h2 className="text-2xl font-bold text-gray-900" > Continue Learning </h2>
            < p className = "text-gray-600" > Pick up where you left off </p>
              </div>
              </div>
              < Button
variant = "outline"
onClick = {() => navigate('/student/courses')}
className = "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
  >
  View All Courses
    </Button>
    </div>

{
  enrolledCourses.length > 0 ? (
    <div className= "grid grid-cols-1 md:grid-cols-2 gap-6" >
    {
      enrolledCourses.map((course, index) => (
        <motion.div
                      key= { course.id }
                      initial = {{ opacity: 0, y: 20 }}
                      animate = {{ opacity: 1, y: 0 }
}
transition = {{ delay: 0.7 + index * 0.1 }}
                    >
  <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white" >
    <CardContent className="p-0" >
      {/* Course Thumbnail */ }
      < div className = "relative h-48 overflow-hidden rounded-t-lg" >
        {
          course.thumbnail_url ? (
            <img 
                                src= { course.thumbnail_url } 
                                alt={ course.title }
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
                            ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center" >
          <BookOpenCheck className="h-16 w-16 text-white/80" />
          </div>
          )}
<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" > </div>
  < div className = "absolute bottom-4 left-4 right-4" >
    <Badge className="bg-white/90 text-gray-900 mb-2" >
      <Users className="w-3 h-3 mr-1" />
        { course.instructor?.full_name || 'Instructor' }
        </Badge>
        < h3 className = "text-white font-bold text-lg leading-tight" > { course.title } </h3>
          </div>

{/* Progress Badge */ }
{
  course.progress_percentage !== undefined && (
    <div className="absolute top-4 right-4" >
      <Badge variant="secondary" className = "bg-white/90 text-gray-900 font-bold" >
        { Math.round(course.progress_percentage) } %
        </Badge>
        </div>
                            )
}
</div>

{/* Course Info */ }
<div className="p-6" >
  <div className="flex items-center justify-between mb-4" >
    <div className="flex items-center space-x-4 text-sm text-gray-600" >
      <div className="flex items-center space-x-1" >
        <BookOpen className="h-4 w-4" />
          <span>{ course.total_lessons } lessons </span>
            </div>
{
  course.completed_lessons !== undefined && (
    <div className="flex items-center space-x-1" >
      <CheckCircle className="h-4 w-4 text-green-500" />
        <span>{ course.completed_lessons } completed </span>
          </div>
                                )
}
</div>
  </div>

{
  course.progress_percentage !== undefined && (
    <div className="mb-4" >
      <div className="flex items-center justify-between mb-2" >
        <span className="text-sm font-medium text-gray-700" > Progress </span>
          < span className = "text-sm font-bold text-gray-900" > { Math.round(course.progress_percentage) } % </span>
            </div>
            < Progress value = { course.progress_percentage } className = "h-2" />
              </div>
                            )
}

<div className="flex items-center justify-between" >
  <Button 
                                onClick={ () => navigate(`/learn/${course.slug}`) }
className = "flex-1 mr-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
  >
  <Play className="w-4 h-4 mr-2" />
    Continue Learning
      </Button>
{
  course.progress_percentage === 100 && (
    <Button variant="outline" size = "sm" className = "ml-2" >
      <Award className="w-4 h-4" />
        </Button>
                              )
}
</div>
  </div>
  </CardContent>
  </Card>
  </motion.div>
                  ))}
</div>
              ) : (
  <motion.div
                  initial= {{ opacity: 0, y: 20 }}
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: 0.7 }}
                >
  <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-dashed border-2 border-gray-200" >
    <CardContent className="p-12 text-center" >
      <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6" >
        <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
          < h3 className = "text-xl font-semibold text-gray-900 mb-2" > Start Your Learning Journey </h3>
            < p className = "text-gray-600 mb-6" > You haven't enrolled in any courses yet. Explore our course catalog to get started!</p>
              < Button
onClick = {() => navigate('/courses')}
className = "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
  >
  <Sparkles className="w-4 h-4 mr-2" />
    Explore Courses
      </Button>
      </CardContent>
      </Card>
      </motion.div>
              )}
</motion.div>

{/* Quick Actions */ }
<motion.div
              initial={ { opacity: 0, y: 20 } }
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: 0.8 }}
className = "grid grid-cols-1 md:grid-cols-3 gap-6"
  >
  <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 hover:shadow-lg transition-shadow" >
    <CardContent className="p-6 text-center" >
      <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4" >
        <BarChart3 className="h-6 w-6 text-purple-600" />
          </div>
          < h3 className = "font-semibold text-purple-900 mb-2" > Track Progress </h3>
            < p className = "text-sm text-purple-700 mb-4" > Monitor your learning achievements and milestones </p>
              < Button variant = "outline" size = "sm" className = "border-purple-300 text-purple-700 hover:bg-purple-100" >
                View Analytics
                  </Button>
                  </CardContent>
                  </Card>

                  < Card className = "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-shadow" >
                    <CardContent className="p-6 text-center" >
                      <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4" >
                        <Target className="h-6 w-6 text-green-600" />
                          </div>
                          < h3 className = "font-semibold text-green-900 mb-2" > Set Goals </h3>
                            < p className = "text-sm text-green-700 mb-4" > Define learning objectives and track your progress </p>
                              < Button variant = "outline" size = "sm" className = "border-green-300 text-green-700 hover:bg-green-100" >
                                Set Goals
                                  </Button>
                                  </CardContent>
                                  </Card>

                                  < Card className = "bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 hover:shadow-lg transition-shadow" >
                                    <CardContent className="p-6 text-center" >
                                      <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4" >
                                        <Award className="h-6 w-6 text-orange-600" />
                                          </div>
                                          < h3 className = "font-semibold text-orange-900 mb-2" > Certificates </h3>
                                            < p className = "text-sm text-orange-700 mb-4" > View and download your earned certificates </p>
                                              < Button variant = "outline" size = "sm" className = "border-orange-300 text-orange-700 hover:bg-orange-100" >
                                                View Certificates
                                                  </Button>
                                                  </CardContent>
                                                  </Card>
                                                  </motion.div>
                                                  </div>
                                                  </div>
                                                  </div>
                                                  </SidebarProvider>
  );
}
