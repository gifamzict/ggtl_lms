import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Clock, 
  Star, 
  TrendingUp,
  Play,
  Calendar,
  Award
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface EnrolledCourse {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  thumbnail: string | null;
  totalLessons: number;
  completedLessons: number;
  lastAccessed: string;
  price: number;
}

interface DashboardStats {
  enrolledCourses: number;
  completedCourses: number;
  totalHoursLearned: number;
  certificatesEarned: number;
  currentStreak: number;
}

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    enrolledCourses: 0,
    completedCourses: 0,
    totalHoursLearned: 0,
    certificatesEarned: 0,
    currentStreak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch enrollments with course data
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select(`
            *,
            courses (
              id,
              title,
              thumbnail_url,
              total_lessons,
              total_duration,
              price,
              profiles!courses_instructor_id_fkey(full_name)
            )
          `)
          .eq('user_id', user.id);

        if (enrollmentsError) {
          console.error('Error fetching enrollments:', enrollmentsError);
          toast.error('Failed to fetch enrolled courses');
          return;
        }

        if (enrollments) {
          const transformedCourses: EnrolledCourse[] = enrollments.map(enrollment => ({
            id: enrollment.courses.id,
            title: enrollment.courses.title,
            instructor: enrollment.courses.profiles?.full_name || 'Unknown',
            progress: enrollment.progress_percentage || 0,
            thumbnail: enrollment.courses.thumbnail_url,
            totalLessons: enrollment.courses.total_lessons || 0,
            completedLessons: Math.floor((enrollment.progress_percentage || 0) / 100 * (enrollment.courses.total_lessons || 0)),
            lastAccessed: enrollment.enrolled_at,
            price: enrollment.courses.price || 0,
          }));

          setEnrolledCourses(transformedCourses);

          // Calculate stats
          const completedCourses = transformedCourses.filter(course => course.progress >= 100).length;
          const totalHours = transformedCourses.reduce((acc, course) => acc + (course.progress / 100 * 2), 0); // Estimate

          setStats({
            enrolledCourses: transformedCourses.length,
            completedCourses,
            totalHoursLearned: Math.round(totalHours),
            certificatesEarned: completedCourses,
            currentStreak: 7, // Mock data
          });
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {getUserDisplayName()}! 👋
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey and track your progress.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.enrolledCourses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedCourses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHoursLearned}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.certificatesEarned}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentStreak} days</div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Continue Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enrolledCourses.length > 0 ? (
                  <div className="space-y-4">
                    {enrolledCourses.slice(0, 3).map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <BookOpen className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Progress value={course.progress} className="flex-1" />
                            <span className="text-sm text-muted-foreground">
                              {course.progress}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {course.completedLessons} of {course.totalLessons} lessons completed
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Continue
                        </Button>
                      </div>
                    ))}
                    {enrolledCourses.length > 3 && (
                      <div className="text-center pt-4">
                        <Button variant="ghost" asChild>
                          <Link to="/student/courses">View All Courses</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No enrolled courses yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start your learning journey by enrolling in a course.
                    </p>
                    <Button asChild>
                      <Link to="/courses">Browse Courses</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/courses">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse All Courses
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/student/profile">
                    <div className="h-4 w-4 mr-2 rounded-full bg-primary" />
                    Update Profile
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/student/certificates">
                    <Award className="h-4 w-4 mr-2" />
                    View Certificates
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/student/settings">
                    <Calendar className="h-4 w-4 mr-2" />
                    Learning Schedule
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Learning Streak */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Learning Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stats.currentStreak}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    days in a row
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    Keep it up! 🔥
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}