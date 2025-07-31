import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, ShoppingCart, User, MessageSquare, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
interface EnrolledCourse {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  thumbnail: string;
  totalLessons: number;
  completedLessons: number;
  price: number;
  isFree: boolean;
}
interface DashboardStats {
  enrolledCourses: number;
  totalReviews: number;
  totalOrders: number;
}
export default function StudentDashboard() {
  const {
    user,
    userProfile,
    loading
  } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    enrolledCourses: 0,
    totalReviews: 0,
    totalOrders: 0
  });
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch enrolled courses and stats
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user) return;
      try {
        setDataLoading(true);

        // Fetch enrollments with course data
        const {
          data: enrollments,
          error: enrollmentsError
        } = await supabase.from('enrollments').select(`
            id,
            progress_percentage,
            enrolled_at,
            completed_at,
            courses (
              id,
              title,
              thumbnail_url,
              total_lessons,
              price,
              status
            )
          `).eq('user_id', user.id);
        if (enrollmentsError) {
          console.error('Error fetching enrollments:', enrollmentsError);
          toast.error('Failed to load your courses');
          return;
        }

        // Transform enrollments data
        const coursesData: EnrolledCourse[] = (enrollments || []).map((enrollment: any) => ({
          id: enrollment.courses.id,
          title: enrollment.courses.title,
          instructor: "Admin",
          // Since admin creates all courses
          progress: enrollment.progress_percentage || 0,
          thumbnail: enrollment.courses.thumbnail_url || "/lovable-uploads/bd0b0eb0-6cfd-4fc4-81b8-d4b8002811c9.png",
          totalLessons: enrollment.courses.total_lessons || 0,
          completedLessons: Math.floor((enrollment.progress_percentage || 0) * (enrollment.courses.total_lessons || 0) / 100),
          price: enrollment.courses.price || 0,
          isFree: (enrollment.courses.price || 0) === 0
        }));
        setEnrolledCourses(coursesData);

        // Update stats
        setStats({
          enrolledCourses: coursesData.length,
          totalReviews: 0,
          // To be implemented when reviews are added
          totalOrders: coursesData.filter(course => !course.isFree).length
        });
      } catch (error) {
        console.error('Error fetching student data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setDataLoading(false);
      }
    };
    fetchStudentData();
  }, [user]);
  const getUserDisplayName = () => {
    if (userProfile?.full_name) return userProfile.full_name;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'Testing';
  };
  if (loading || dataLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>;
  }
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <StudentSidebar />
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Hero Header Section */}
          <div className="relative h-64 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-800 overflow-hidden">
            <div className="relative z-10 flex items-center justify-between p-8 h-full">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="md:hidden text-white hover:bg-white/10" />
                <BookOpen className="h-8 w-8 text-white" />
                <span className="text-2xl font-bold text-white">GGTL</span>
              </div>
              
              <nav className="hidden md:flex items-center space-x-8 text-white">
                <a href="/" className="hover:text-blue-200">Home</a>
                <a href="/courses" className="hover:text-blue-200">Courses</a>
                <a href="/about-us" className="hover:text-blue-200">About</a>
                
                <a href="/contact-us" className="hover:text-blue-200">Contact Us</a>
              </nav>

              <div className="flex items-center space-x-4">
                
              </div>
            </div>

            {/* Title Section */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/50 to-transparent">
              <h1 className="text-4xl font-bold text-white mb-2">Student Dashboard</h1>
              <div className="flex items-center space-x-2 text-blue-200">
                <span>🏠 HOME</span>
                <span>•</span>
                <span>STUDENT DASHBOARD</span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-8">
            {/* Welcome Section with Profile */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 p-1">
                    <div className="w-full h-full rounded-lg bg-white flex items-center justify-center">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={userProfile?.avatar_url} />
                        <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                          {getUserDisplayName().charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">{getUserDisplayName()}</h2>
                  <p className="text-gray-500">Student</p>
                </div>
              </div>
              
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stats.enrolledCourses}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">ENROLLED COURSES</div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalReviews}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">TOTAL REVIEWS</div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalOrders}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">TOTAL ORDERS</div>
                </CardContent>
              </Card>
            </div>

            {/* Orders Table */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">No.</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">Invoice</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">Amount</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">Status</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrolledCourses.filter(course => !course.isFree).length > 0 ? enrolledCourses.filter(course => !course.isFree).map((course, index) => <tr key={course.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-6">{index + 1}</td>
                            <td className="py-4 px-6">INV-{course.id.slice(0, 8)}</td>
                            <td className="py-4 px-6">${course.price}</td>
                            <td className="py-4 px-6">
                              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Completed
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </td>
                          </tr>) : <tr>
                          <td colSpan={5} className="text-center py-12 text-gray-500">
                            No Data Found
                          </td>
                        </tr>}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>;
}