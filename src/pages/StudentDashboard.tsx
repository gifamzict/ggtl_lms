import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BookOpen, 
  ShoppingCart, 
  User, 
  MessageSquare,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

interface Enrollment {
  id: string;
  progress_percentage: number;
  enrolled_at: string;
  completed_at: string | null;
  courses: {
    id: string;
    title: string;
    thumbnail_url: string | null;
    total_lessons: number;
    price: number;
    status: string;
  } | null;
}

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    totalReviews: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch enrolled courses and stats
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch enrollments with course data
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select(`
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
          `)
          .eq('user_id', user.id);

        if (enrollmentsError) {
          console.error('Error fetching enrollments:', enrollmentsError);
          toast.error('Failed to load your courses');
          return;
        }

        // Transform enrollments data
        const coursesData: EnrolledCourse[] = (enrollments as Enrollment[] || []).map((enrollment) => ({
          id: enrollment.courses!.id,
          title: enrollment.courses!.title,
          instructor: "Admin", // Since admin creates all courses
          progress: enrollment.progress_percentage || 0,
          thumbnail: enrollment.courses!.thumbnail_url || "/lovable-uploads/bd0b0eb0-6cfd-4fc4-81b8-d4b8002811c9.png",
          totalLessons: enrollment.courses!.total_lessons || 0,
          completedLessons: Math.floor((enrollment.progress_percentage || 0) * (enrollment.courses!.total_lessons || 0) / 100),
          price: enrollment.courses!.price || 0,
          isFree: (enrollment.courses!.price || 0) === 0
        }));

        setEnrolledCourses(coursesData);

        // Update stats
        setStats({
          enrolledCourses: coursesData.length,
          totalReviews: 0, // To be implemented when reviews are added
          totalOrders: coursesData.filter(course => !course.isFree).length
        });

      } catch (error) {
        console.error('Error fetching student data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header Section */}
      <div className="relative h-64 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-800 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('/lovable-uploads/27aef8b2-ed34-43c6-bdf6-a1eed430115b.png')"
          }}
        />
        <div className="relative z-10 flex items-center justify-between p-8 h-full">
          <div className="flex items-center space-x-4">
            <BookOpen className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">GIFAMZ</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8 text-white">
            <a href="#" className="hover:text-blue-200">Home</a>
            <a href="#" className="hover:text-blue-200">Courses</a>
            <a href="#" className="hover:text-blue-200">About</a>
            <a href="#" className="hover:text-blue-200">Blogs</a>
            <a href="#" className="hover:text-blue-200">Contact Us</a>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
              Dashboard
            </Button>
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

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg">
          <div className="p-6">
            {/* Profile Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 p-1">
                  <div className="w-full h-full rounded-lg bg-white flex items-center justify-center">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Testing</h3>
              <p className="text-gray-500 text-sm">Student</p>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              <a href="#" className="flex items-center space-x-3 px-4 py-3 bg-blue-600 text-white rounded-lg">
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
                <BookOpen className="h-5 w-5" />
                <span>Enrolled Courses</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
                <ShoppingCart className="h-5 w-5" />
                <span>Orders</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
                <MessageSquare className="h-5 w-5" />
                <span>Reviews</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
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

          {/* Become Instructor Button */}
          <div className="flex justify-end mb-6">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
              Become a Instructor
            </Button>
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
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-500">
                        No Data Found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}