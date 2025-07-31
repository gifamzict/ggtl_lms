import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Users, Star, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  slug?: string;
  total_lessons: number;
  total_duration: number;
  price: number;
  status: string;
  instructor_id: string;
  isEnrolled?: boolean;
  progress?: number;
}

export default function StudentCourses() {
  const { user, loading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [dataLoading, setDataLoading] = useState(true);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;

      try {
        setDataLoading(true);

        // Fetch all published courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .eq('status', 'PUBLISHED');

        if (coursesError) {
          console.error('Error fetching courses:', coursesError);
          toast.error('Failed to load courses');
          return;
        }

        // Fetch user's enrollments
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select('course_id, progress_percentage')
          .eq('user_id', user.id);

        if (enrollmentsError) {
          console.error('Error fetching enrollments:', enrollmentsError);
        }

        // Create a set of enrolled course IDs and progress map
        const enrolledIds = new Set<string>();
        const progressMap = new Map<string, number>();
        
        (enrollments || []).forEach((enrollment: any) => {
          enrolledIds.add(enrollment.course_id);
          progressMap.set(enrollment.course_id, enrollment.progress_percentage || 0);
        });

        // Add enrollment status and progress to courses
        const coursesWithEnrollment = (coursesData || []).map((course: any) => ({
          ...course,
          isEnrolled: enrolledIds.has(course.id),
          progress: progressMap.get(course.id) || 0
        }));

        setCourses(coursesWithEnrollment);
        setEnrolledCourseIds(enrolledIds);

      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setDataLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  const handleEnroll = async (courseId: string, isFree: boolean) => {
    if (!user) {
      toast.error('Please log in to enroll in courses');
      return;
    }

    setEnrollingCourseId(courseId);
    
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          progress_percentage: 0
        });

      if (error) {
        console.error('Error enrolling in course:', error);
        toast.error('Failed to enroll in course');
        return;
      }

      // Update local state
      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? { ...course, isEnrolled: true, progress: 0 }
          : course
      ));
      setEnrolledCourseIds(prev => new Set([...prev, courseId]));
      
      toast.success('Successfully enrolled in course!');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course');
    } finally {
      setEnrollingCourseId(null);
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <StudentSidebar />
        
        <div className="flex-1">
          {/* Header */}
          <div className="bg-white border-b p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="md:hidden" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
                  <p className="text-gray-600">Manage your enrolled courses and discover new ones</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Enrolled Courses Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Enrolled Courses</h2>
              {courses.filter(course => course.isEnrolled).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.filter(course => course.isEnrolled).map((course) => (
                    <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img 
                          src={course.thumbnail_url || "/lovable-uploads/bd0b0eb0-6cfd-4fc4-81b8-d4b8002811c9.png"} 
                          alt={course.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary">Enrolled</Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{course.total_lessons} lessons</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{Math.floor((course.total_duration || 0) / 60)}h</span>
                          </div>
                        </div>

                        <Button 
                          className="w-full"
                          onClick={() => window.location.href = `/learn/${course.slug || course.id}`}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Continue Learning
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Enrolled Courses</h3>
                  <p className="text-gray-600">Start learning by enrolling in courses below</p>
                </div>
              )}
            </div>

            {/* Available Courses Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.filter(course => !course.isEnrolled).map((course) => (
                  <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={course.thumbnail_url || "/lovable-uploads/bd0b0eb0-6cfd-4fc4-81b8-d4b8002811c9.png"} 
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant={course.price === 0 ? "secondary" : "default"}>
                          {course.price === 0 ? "Free" : `$${course.price}`}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{course.total_lessons} lessons</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{Math.floor((course.total_duration || 0) / 60)}h</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={() => handleEnroll(course.id, course.price === 0)}
                        disabled={enrollingCourseId === course.id}
                      >
                        {enrollingCourseId === course.id ? 'Enrolling...' : 'Enroll Now'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}