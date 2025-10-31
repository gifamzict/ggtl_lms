import { useState, useEffect } from "react";
import { useLaravelAuth } from "@/store/laravelAuthStore";
import { studentDashboardApi } from "@/services/api/studentDashboardApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import {
    BookOpen,
    Clock,
    Play,
    CheckCircle,
    Search,
    Filter,
    BookOpenCheck,
    Users,
    Award,
    Calendar,
    TrendingUp,
    Sparkles,
    Star,
    Grid3X3,
    List,
    SortAsc
} from "lucide-react";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface EnrolledCourse {
    id: number;
    title: string;
    slug: string;
    description: string;
    thumbnail_url?: string;
    instructor?: {
        full_name: string;
    };
    total_lessons: number;
    completed_lessons?: number;
    progress_percentage?: number;
    last_accessed?: string;
    enrolled_at: string;
    category?: {
        name: string;
    };
}

export default function StudentCourses() {
    const { user, isAuthenticated } = useLaravelAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState<EnrolledCourse[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<EnrolledCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("recent");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }
        fetchEnrolledCourses();
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        filterAndSortCourses();
    }, [courses, searchTerm, filterStatus, sortBy]);

    const fetchEnrolledCourses = async () => {
        try {
            setLoading(true);
            const coursesData = await studentDashboardApi.getEnrolledCourses();
            setCourses(coursesData);
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
            toast.error('Failed to load enrolled courses');
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortCourses = () => {
        let filtered = [...courses];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(course =>
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (course.instructor?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        switch (filterStatus) {
            case "completed":
                filtered = filtered.filter(course => course.progress_percentage === 100);
                break;
            case "in-progress":
                filtered = filtered.filter(course =>
                    course.progress_percentage && course.progress_percentage > 0 && course.progress_percentage < 100
                );
                break;
            case "not-started":
                filtered = filtered.filter(course => !course.progress_percentage || course.progress_percentage === 0);
                break;
        }

        // Sort
        switch (sortBy) {
            case "title":
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "progress":
                filtered.sort((a, b) => (b.progress_percentage || 0) - (a.progress_percentage || 0));
                break;
            case "recent":
            default:
                filtered.sort((a, b) => new Date(b.enrolled_at).getTime() - new Date(a.enrolled_at).getTime());
                break;
        }

        setFilteredCourses(filtered);
    };

    const getStatusBadge = (course: EnrolledCourse) => {
        const progress = course.progress_percentage || 0;
        if (progress === 100) {
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-200" > Completed </Badge>;
        } else if (progress > 0) {
            return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200" > In Progress </Badge>;
        } else {
            return <Badge variant="outline" > Not Started </Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

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
                    < p className = "text-gray-600 font-medium" > Loading your courses...</p>
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
        {/* Header */ }
        < div className = "relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8" >
            <div className="absolute inset-0 bg-black/10" > </div>
                < div className = "absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" > </div>
                    < div className = "absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" > </div>

                        < div className = "relative z-10" >
                            <div className="flex items-center justify-between mb-6" >
                                <div className="flex items-center space-x-4" >
                                    <SidebarTrigger className="md:hidden text-white hover:bg-white/10 rounded-lg p-2" />
                                        <div className="flex items-center space-x-3" >
                                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm" >
                                                <BookOpen className="h-8 w-8 text-white" />
                                                    </div>
                                                    < div >
                                                    <h1 className="text-3xl font-bold text-white" > My Courses </h1>
                                                        < p className = "text-blue-100" > Continue your learning journey </p>
                                                            </div>
                                                            </div>
                                                            </div>
                                                            </div>

{/* Stats */ }
<div className="grid grid-cols-1 md:grid-cols-4 gap-4" >
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg" >
        <CardContent className="p-4 text-center" >
            <div className="text-2xl font-bold text-blue-600" > { courses.length } </div>
                < div className = "text-sm text-gray-600" > Total Enrolled </div>
                    </CardContent>
                    </Card>
                    < Card className = "bg-white/95 backdrop-blur-sm border-0 shadow-lg" >
                        <CardContent className="p-4 text-center" >
                            <div className="text-2xl font-bold text-green-600" >
                                { courses.filter(c => c.progress_percentage === 100).length }
                                </div>
                                < div className = "text-sm text-gray-600" > Completed </div>
                                    </CardContent>
                                    </Card>
                                    < Card className = "bg-white/95 backdrop-blur-sm border-0 shadow-lg" >
                                        <CardContent className="p-4 text-center" >
                                            <div className="text-2xl font-bold text-orange-600" >
                                                { courses.filter(c => c.progress_percentage && c.progress_percentage > 0 && c.progress_percentage < 100).length }
                                                </div>
                                                < div className = "text-sm text-gray-600" > In Progress </div>
                                                    </CardContent>
                                                    </Card>
                                                    < Card className = "bg-white/95 backdrop-blur-sm border-0 shadow-lg" >
                                                        <CardContent className="p-4 text-center" >
                                                            <div className="text-2xl font-bold text-purple-600" >
                                                                { Math.round(courses.reduce((acc, course) => acc + (course.progress_percentage || 0), 0) / courses.length || 0) } %
                                                                </div>
                                                                < div className = "text-sm text-gray-600" > Avg Progress </div>
                                                                    </CardContent>
                                                                    </Card>
                                                                    </div>
                                                                    </div>
                                                                    </div>

{/* Filters and Search */ }
<div className="p-8 pb-4" >
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6" >
        <div className="flex flex-1 gap-4 items-center" >
            <div className="relative flex-1 max-w-md" >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                    placeholder="Search courses..."
value = { searchTerm }
onChange = {(e) => setSearchTerm(e.target.value)}
className = "pl-10"
    />
    </div>

    < Select value = { filterStatus } onValueChange = { setFilterStatus } >
        <SelectTrigger className="w-40" >
            <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
                </SelectTrigger>
                < SelectContent >
                <SelectItem value="all" > All Courses </SelectItem>
                    < SelectItem value = "completed" > Completed </SelectItem>
                        < SelectItem value = "in-progress" > In Progress </SelectItem>
                            < SelectItem value = "not-started" > Not Started </SelectItem>
                                </SelectContent>
                                </Select>

                                < Select value = { sortBy } onValueChange = { setSortBy } >
                                    <SelectTrigger className="w-40" >
                                        <SortAsc className="h-4 w-4 mr-2" />
                                            <SelectValue />
                                            </SelectTrigger>
                                            < SelectContent >
                                            <SelectItem value="recent" > Recently Enrolled </SelectItem>
                                                < SelectItem value = "title" > Title A - Z </SelectItem>
                                                    < SelectItem value = "progress" > Progress </SelectItem>
                                                        </SelectContent>
                                                        </Select>
                                                        </div>

                                                        < div className = "flex items-center gap-2" >
                                                            <Button
                  variant={ viewMode === "grid" ? "default" : "outline" }
size = "sm"
onClick = {() => setViewMode("grid")}
                >
    <Grid3X3 className="h-4 w-4" />
        </Button>
        < Button
variant = { viewMode === "list" ? "default" : "outline"}
size = "sm"
onClick = {() => setViewMode("list")}
                >
    <List className="h-4 w-4" />
        </Button>
        </div>
        </div>
        </div>

{/* Courses Grid/List */ }
<div className="px-8 pb-8" >
{
    filteredCourses.length > 0 ? (
        <div className= { viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
              } >
{
    filteredCourses.map((course, index) => (
        <motion.div
                    key= { course.id }
                    initial = {{ opacity: 0, y: 20 }}
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: index * 0.1 }}
                  >
    { viewMode === "grid" ? (
        <Card className= "group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white" >
<CardContent className="p-0" >
    <div className="relative h-48 overflow-hidden rounded-t-lg" >
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

                    < div className = "absolute top-4 right-4" >
                        { getStatusBadge(course) }
                        </div>
                        </div>

                        < div className = "p-6" >
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

    < div className = "mt-4 flex items-center justify-between text-xs text-gray-500" >
        <span>Enrolled { formatDate(course.enrolled_at) } </span>
{
    course.category && (
        <Badge variant="outline" className = "text-xs" >
            { course.category.name }
            </Badge>
                              )
}
</div>
    </div>
    </CardContent>
    </Card>
                    ) : (
    <Card className= "hover:shadow-lg transition-shadow bg-white" >
    <CardContent className="p-6" >
        <div className="flex items-center space-x-4" >
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0" >
                {
                    course.thumbnail_url ? (
                        <img 
                                  src= { course.thumbnail_url } 
                                  alt={ course.title }
                                  className="w-full h-full object-cover"
                    />
                              ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center" >
                    <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    )}
</div>

    < div className = "flex-1 min-w-0" >
        <div className="flex items-start justify-between mb-2" >
            <div>
            <h3 className="font-semibold text-lg text-gray-900 truncate" > { course.title } </h3>
                < p className = "text-sm text-gray-600" > by { course.instructor?.full_name || 'Instructor' } </p>
                    </div>
{ getStatusBadge(course) }
</div>

    < p className = "text-sm text-gray-600 mb-3 line-clamp-2" > { course.description } </p>

{
    course.progress_percentage !== undefined && (
        <div className="mb-3" >
            <div className="flex items-center justify-between mb-1" >
                <span className="text-xs text-gray-500" > Progress </span>
                    < span className = "text-xs font-medium" > { Math.round(course.progress_percentage) } % </span>
                        </div>
                        < Progress value = { course.progress_percentage } className = "h-1" />
                            </div>
                              )
}

<div className="flex items-center justify-between" >
    <div className="flex items-center space-x-4 text-xs text-gray-500" >
        <span>{ course.total_lessons } lessons </span>
            < span > Enrolled { formatDate(course.enrolled_at) } </span>
                </div>
                < Button
onClick = {() => navigate(`/learn/${course.slug}`)}
size = "sm"
className = "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
    >
    <Play className="w-3 h-3 mr-1" />
        Continue
        </Button>
        </div>
        </div>
        </div>
        </CardContent>
        </Card>
                    )}
</motion.div>
                ))}
</div>
            ) : (
    <motion.div
                initial= {{ opacity: 0, y: 20 }}
animate = {{ opacity: 1, y: 0 }}
className = "text-center py-12"
    >
    <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-dashed border-2 border-gray-200" >
        <CardContent className="p-12" >
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6" >
                <BookOpen className="h-12 w-12 text-blue-600" />
                    </div>
                    < h3 className = "text-xl font-semibold text-gray-900 mb-2" >
                        { searchTerm || filterStatus !== "all" ? "No courses found" : "No enrolled courses yet"}
</h3>
    < p className = "text-gray-600 mb-6" >
        { searchTerm || filterStatus !== "all"
        ? "Try adjusting your search or filter criteria"
        : "Start your learning journey by enrolling in courses"
                      }
</p>
{
    !searchTerm && filterStatus === "all" && (
        <Button 
                        onClick={ () => navigate('/courses') }
    className = "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
        <Sparkles className="w-4 h-4 mr-2" />
            Explore Courses
                </Button>
                    )
}
</CardContent>
    </Card>
    </motion.div>
            )}
</div>
    </div>
    </div>
    </SidebarProvider>
  );
}