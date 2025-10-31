import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    Filter,
    BookOpen,
    Users,
    Eye,
    Edit,
    Trash2,
    Star,
    DollarSign,
    Clock,
    Award,
    TrendingUp,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { adminApi, Course } from '@/services/api/adminApi';
import { toast } from 'sonner';

interface CourseManagementProps {
    darkMode: boolean;
}

export const CourseManagement: React.FC<CourseManagementProps> = ({ darkMode }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const coursesData = await adminApi.courses.getAll();
            setCourses(coursesData);
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCourse = async (courseId: number) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;

        try {
            await adminApi.courses.delete(courseId);
            setCourses(courses.filter(course => course.id !== courseId));
            toast.success('Course deleted successfully');
        } catch (error) {
            console.error('Error deleting course:', error);
            toast.error('Failed to delete course');
        }
    };

    const handleStatusChange = async (courseId: number, newStatus: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => {
        try {
            await adminApi.courses.update(courseId, { status: newStatus });
            setCourses(courses.map(course =>
                course.id === courseId ? { ...course, status: newStatus } : course
            ));
            toast.success(`Course ${newStatus.toLowerCase()} successfully`);
        } catch (error) {
            console.error('Error updating course status:', error);
            toast.error('Failed to update course status');
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || course.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PUBLISHED': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'DRAFT': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            case 'ARCHIVED': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PUBLISHED': return darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600';
            case 'DRAFT': return darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600';
            case 'ARCHIVED': return darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600';
            default: return darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600';
        }
    };

    if (loading) {
        return (
            <div className= "flex items-center justify-center h-64" >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" > </div>
                </div>
    );
  }

return (
    <div className= "space-y-6" >
    {/* Header */ }
    < div className = "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" >
        <div>
        <h2 className={ `text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}` }>
            Course Management
                </h2>
                < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Manage all courses, lessons, and content
                        </p>
                        </div>
                        < button
onClick = {() => setShowAddModal(true)}
className = "flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
    >
    <Plus className="w-5 h-5" />
        Add New Course
            </button>
            </div>

{/* Stats Cards */ }
<div className="grid grid-cols-1 md:grid-cols-4 gap-6" >
{
    [
    {
        title: 'Total Courses',
        value: courses.length,
        icon: BookOpen,
        color: 'blue',
        bgGradient: 'from-blue-500 to-blue-600'
    },
    {
        title: 'Published',
        value: courses.filter(c => c.status === 'PUBLISHED').length,
        icon: CheckCircle,
        color: 'green',
        bgGradient: 'from-green-500 to-green-600'
    },
    {
        title: 'Draft',
        value: courses.filter(c => c.status === 'DRAFT').length,
        icon: AlertCircle,
        color: 'yellow',
        bgGradient: 'from-yellow-500 to-yellow-600'
    },
    {
        title: 'Total Enrollments',
        value: courses.reduce((acc, course) => acc + (course.total_enrollments || 0), 0),
        icon: Users,
        color: 'purple',
        bgGradient: 'from-purple-500 to-purple-600'
    }
    ].map((stat, index) => (
        <motion.div
            key= { stat.title }
            initial = {{ opacity: 0, y: 20 }}
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: index * 0.1 }}
className = {`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
          >
    <div className="flex items-center justify-between" >
        <div>
        <p className={ `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
            { stat.title }
            </p>
            < p className = {`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                { stat.value }
                </p>
                </div>
                < div className = {`p-3 rounded-xl bg-gradient-to-r ${stat.bgGradient}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        </div>
                        </motion.div>
        ))}
</div>

{/* Filters */ }
<div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg` }>
    <div className="flex flex-col sm:flex-row gap-4" >
        {/* Search */ }
        < div className = "relative flex-1" >
            <Search className={ `absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}` } />
                < input
type = "text"
placeholder = "Search courses..."
value = { searchTerm }
onChange = {(e) => setSearchTerm(e.target.value)}
className = {`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode
        ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400'
        : 'bg-gray-50 border-gray-200 text-gray-800'
    }`}
            />
    </div>

{/* Status Filter */ }
<div className="relative" >
    <select
              value={ statusFilter }
onChange = {(e) => setStatusFilter(e.target.value)}
className = {`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-w-[150px] ${darkMode
        ? 'bg-gray-700 border-gray-600 text-gray-200'
        : 'bg-gray-50 border-gray-200 text-gray-800'
    }`}
            >
    <option value="ALL" > All Status </option>
        < option value = "PUBLISHED" > Published </option>
            < option value = "DRAFT" > Draft </option>
                < option value = "ARCHIVED" > Archived </option>
                    </select>
                    </div>
                    </div>
                    </div>

{/* Courses Table */ }
<div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden` }>
    <div className="overflow-x-auto" >
        <table className="w-full" >
            <thead className={ `${darkMode ? 'bg-gray-700' : 'bg-gray-50'}` }>
                <tr>
                <th className={ `px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}` }>
                    Course
                    </th>
                    < th className = {`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Instructor
                        </th>
                        < th className = {`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Price
                            </th>
                            < th className = {`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                Enrollments
                                </th>
                                < th className = {`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                    Status
                                    </th>
                                    < th className = {`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        Actions
                                        </th>
                                        </tr>
                                        </thead>
                                        < tbody className = "divide-y divide-gray-200 dark:divide-gray-700" >
                                        {
                                            filteredCourses.map((course, index) => (
                                                <motion.tr
                  key= { course.id }
                  initial = {{ opacity: 0, x: -20 }}
animate = {{ opacity: 1, x: 0 }}
transition = {{ delay: index * 0.05 }}
className = {`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}
                >
    <td className="px-6 py-4" >
        <div className="flex items-center space-x-4" >
            <div className="flex-shrink-0" >
                {
                    course.thumbnail_url ? (
                        <img
                            src= { course.thumbnail_url }
                            alt={ course.title }
                            className="w-12 h-12 rounded-lg object-cover"
                    />
                        ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center" >
                    <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    )}
</div>
    < div >
    <p className={ `font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}` }>
        { course.title }
        </p>
        < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            { course.level }
            </p>
            </div>
            </div>
            </td>
            < td className = "px-6 py-4" >
                <p className={ `${darkMode ? 'text-gray-200' : 'text-gray-800'}` }>
                    { course.instructor?.full_name || 'N/A' }
                    </p>
                    </td>
                    < td className = "px-6 py-4" >
                        <div className="flex items-center gap-1" >
                            <DollarSign className="w-4 h-4 text-green-500" />
                                <span className={ `font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}` }>
                                    { parseFloat(course.price).toLocaleString() }
                                    </span>
                                    </div>
                                    </td>
                                    < td className = "px-6 py-4" >
                                        <div className="flex items-center gap-1" >
                                            <Users className="w-4 h-4 text-blue-500" />
                                                <span className={ `${darkMode ? 'text-gray-200' : 'text-gray-800'}` }>
                                                    { course.total_enrollments || 0 }
                                                    </span>
                                                    </div>
                                                    </td>
                                                    < td className = "px-6 py-4" >
                                                        <div className="flex items-center gap-2" >
                                                            { getStatusIcon(course.status) }
                                                            < span className = {`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                                                                { course.status }
                                                                </span>
                                                                </div>
                                                                </td>
                                                                < td className = "px-6 py-4" >
                                                                    <div className="flex items-center gap-2" >
                                                                        <button
                        className={ `p-2 rounded-lg hover:${darkMode ? 'bg-gray-600' : 'bg-gray-100'} transition-colors` }
title = "View Course"
    >
    <Eye className="w-4 h-4" />
        </button>
        < button
className = {`p-2 rounded-lg hover:${darkMode ? 'bg-gray-600' : 'bg-gray-100'} transition-colors`}
title = "Edit Course"
    >
    <Edit className="w-4 h-4" />
        </button>

{/* Status Change Buttons */ }
{
    course.status !== 'PUBLISHED' && (
        <button
                          onClick={ () => handleStatusChange(course.id, 'PUBLISHED') }
    className = "p-2 rounded-lg hover:bg-green-100 transition-colors text-green-600"
    title = "Publish Course"
        >
        <CheckCircle className="w-4 h-4" />
            </button>
                      )
}

{
    course.status !== 'ARCHIVED' && (
        <button
                          onClick={ () => handleStatusChange(course.id, 'ARCHIVED') }
    className = "p-2 rounded-lg hover:bg-red-100 transition-colors text-red-600"
    title = "Archive Course"
        >
        <XCircle className="w-4 h-4" />
            </button>
                      )
}

<button
                        onClick={ () => handleDeleteCourse(course.id) }
className = "p-2 rounded-lg hover:bg-red-100 transition-colors text-red-600"
title = "Delete Course"
    >
    <Trash2 className="w-4 h-4" />
        </button>
        </div>
        </td>
        </motion.tr>
              ))}
</tbody>
    </table>
    </div>

{
    filteredCourses.length === 0 && (
        <div className="text-center py-12" >
            <BookOpen className={ `w-16 h-16 ${darkMode ? 'text-gray-400' : 'text-gray-300'} mx-auto mb-4` } />
                < p className = {`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`
}>
    No courses found
        </p>
        < p className = {`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            { searchTerm || statusFilter !== 'ALL'
            ? 'Try adjusting your filters'
            : 'Create your first course to get started'
              }
</p>
    </div>
        )}
</div>
    </div>
  );
};