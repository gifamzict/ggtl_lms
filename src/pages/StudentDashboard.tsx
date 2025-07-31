import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BookOpen, 
  Star, 
  ShoppingCart, 
  User, 
  GraduationCap,
  MessageSquare,
  LogOut,
  Settings
} from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

interface EnrolledCourse {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  thumbnail: string;
  totalLessons: number;
  completedLessons: number;
}

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    totalReviews: 0,
    totalOrders: 0
  });

  // Mock data for now - replace with actual API calls
  useEffect(() => {
    setEnrolledCourses([
      {
        id: "1",
        title: "React Development Fundamentals",
        instructor: "John Doe",
        progress: 75,
        thumbnail: "/lovable-uploads/bd0b0eb0-6cfd-4fc4-81b8-d4b8002811c9.png",
        totalLessons: 24,
        completedLessons: 18
      },
      {
        id: "2", 
        title: "Advanced JavaScript Concepts",
        instructor: "Jane Smith",
        progress: 45,
        thumbnail: "/lovable-uploads/bd0b0eb0-6cfd-4fc4-81b8-d4b8002811c9.png",
        totalLessons: 30,
        completedLessons: 14
      }
    ]);

    setStats({
      enrolledCourses: 2,
      totalReviews: 0,
      totalOrders: 0
    });
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <StudentSidebar />
        
        <main className="flex-1">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Student Dashboard</h1>
                <nav className="flex items-center space-x-2 text-blue-100 mt-2">
                  <span>HOME</span>
                  <span>•</span>
                  <span>STUDENT DASHBOARD</span>
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Button variant="outline" className="bg-blue-500 border-blue-400 text-white hover:bg-blue-400">
                  Become a Instructor
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Profile Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <Card className="lg:col-span-1">
                <CardContent className="p-6 text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-xl">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg mb-1">Testing</h3>
                  <p className="text-muted-foreground text-sm">Student</p>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{stats.enrolledCourses}</div>
                    <div className="text-sm text-muted-foreground">ENROLLED COURSES</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{stats.totalReviews}</div>
                    <div className="text-sm text-muted-foreground">TOTAL REVIEWS</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{stats.totalOrders}</div>
                    <div className="text-sm text-muted-foreground">TOTAL ORDERS</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Orders Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Orders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium text-muted-foreground">No.</th>
                        <th className="text-left p-2 font-medium text-muted-foreground">Invoice</th>
                        <th className="text-left p-2 font-medium text-muted-foreground">Amount</th>
                        <th className="text-left p-2 font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-2 font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={5} className="text-center p-8 text-muted-foreground">
                          No Data Found
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Enrolled Courses Section */}
            {enrolledCourses.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>My Enrolled Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {enrolledCourses.map((course) => (
                      <Card key={course.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="w-full h-40 object-cover rounded-lg mb-3"
                          />
                          <h4 className="font-semibold mb-2 line-clamp-2">{course.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">by {course.instructor}</p>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                              <Badge variant="secondary">Continue</Badge>
                            </div>
                          </div>
                          
                          <Button className="w-full mt-3" size="sm">
                            Continue Learning
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}