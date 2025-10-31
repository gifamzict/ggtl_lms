import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    Plus,
    Search,
    Edit,
    Trash2,
    Users,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    Upload,
    X,
    PlayCircle,
    Video,
    Save,
    Eye
} from 'lucide-react';
import { adminApi, Course, Category } from '@/services/api/adminApi';

interface Lesson {
    id?: number;
    title: string;
    description: string;
    video_source: 'UPLOAD' | 'DRIVE' | 'YOUTUBE' | 'VIMEO';
    video_url: string;
    duration: number;
    position: number;
    is_preview: boolean;
}

interface CoursesManagementProps {
    darkMode: boolean;
    dashboardData: any;
}

const CoursesManagement: React.FC<CoursesManagementProps> = ({ darkMode, dashboardData }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1); // 1: Course Details, 2: Lessons

    const [courseForm, setCourseForm] = useState({
        title: '',
        description: '',
        price: '',
        level: 'BEGINNER' as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
        category_id: '',
        thumbnail: null as File | null,
        status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
    });

    const [lessons, setLessons] = useState<Lesson[]>([]);

    useEffect(() => {
        fetchCourses();
        fetchCategories();
    }, []);

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            const courses = await adminApi.courses.getAll();
            setCourses(courses || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const categories = await adminApi.categories.getAll();
            setCategories(categories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSubmitCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('title', courseForm.title);
            formData.append('description', courseForm.description);
            formData.append('price', courseForm.price);
            formData.append('level', courseForm.level);
            formData.append('category_id', courseForm.category_id);
            formData.append('status', courseForm.status);

            if (courseForm.thumbnail) {
                formData.append('thumbnail', courseForm.thumbnail);
            }

            let course;
            if (editingCourse) {
                course = await adminApi.courses.update(editingCourse.id, formData);
            } else {
                course = await adminApi.courses.create(formData);
            }

            // If we have lessons and this is a new course, create them
            if (lessons.length > 0 && course?.id && !editingCourse) {
                for (const lesson of lessons) {
                    await adminApi.lessons.create(course.id, {
                        title: lesson.title,
                        description: lesson.description,
                        video_source: lesson.video_source,
                        video_url: lesson.video_url,
                        duration: lesson.duration,
                        position: lesson.position,
                        is_preview: lesson.is_preview
                    });
                }
            }

            setShowAddModal(false);
            resetForm();
            fetchCourses();
            alert(editingCourse ? 'Course updated successfully!' : 'Course created successfully!');
        } catch (error) {
            console.error('Error saving course:', error);
            alert('Error saving course. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditCourse = (course: Course) => {
        setEditingCourse(course);
        setCourseForm({
            title: course.title,
            description: course.description,
            price: course.price.toString(),
            level: course.level,
            category_id: course.category?.id.toString() || '',
            thumbnail: null,
            status: course.status
        });
        setCurrentStep(1); // Start with course details
        setShowAddModal(true);
    };

    const handleDeleteCourse = async (courseId: number) => {
        if (confirm('Are you sure you want to delete this course? This will also delete all lessons.')) {
            try {
                await adminApi.courses.delete(courseId);
                fetchCourses();
                alert('Course deleted successfully!');
            } catch (error) {
                console.error('Error deleting course:', error);
                alert('Error deleting course. Please try again.');
            }
        }
    };

    const resetForm = () => {
        setCourseForm({
            title: '',
            description: '',
            price: '',
            level: 'BEGINNER',
            category_id: '',
            thumbnail: null,
            status: 'DRAFT'
        });
        setLessons([]);
        setEditingCourse(null);
        setCurrentStep(1);
    };

    const addLesson = () => {
        const newLesson: Lesson = {
            title: '',
            description: '',
            video_source: 'YOUTUBE',
            video_url: '',
            duration: 0,
            position: lessons.length + 1,
            is_preview: false
        };
        setLessons([...lessons, newLesson]);
    };

    const updateLesson = (index: number, field: keyof Lesson, value: any) => {
        const updatedLessons = [...lessons];
        updatedLessons[index] = { ...updatedLessons[index], [field]: value };
        setLessons(updatedLessons);
    };

    const removeLesson = (index: number) => {
        const updatedLessons = lessons.filter((_, i) => i !== index);
        // Update positions
        updatedLessons.forEach((lesson, i) => {
            lesson.position = i + 1;
        });
        setLessons(updatedLessons);
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        const colors = {
            PUBLISHED: 'bg-green-100 text-green-800',
            DRAFT: 'bg-yellow-100 text-yellow-800',
            ARCHIVED: 'bg-red-100 text-red-800'
        };

        return (
            <span className= {`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || colors.DRAFT}`
    }>
        { status }
        </span>
        );
    };

if (isLoading) {
    return (
        <div className= "flex items-center justify-center py-12" >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" > </div>
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
                    Manage all courses and their content
                        </p>
                        </div>
                        < button
onClick = {() => setShowAddModal(true)}
className = "inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
    >
    <Plus className="w-5 h-5 mr-2" />
        Add New Course
            </button>
            </div>

{/* Stats Cards */ }
<div className="grid grid-cols-1 md:grid-cols-4 gap-6" >
    <div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md` }>
        <div className="flex items-center justify-between" >
            <div>
            <p className={ `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
                Total Courses
                    </p>
                    < p className = {`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        { courses.length }
                        </p>
                        </div>
                        < BookOpen className = "w-8 h-8 text-blue-600" />
                            </div>
                            </div>

                            < div className = {`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`}>
                                <div className="flex items-center justify-between" >
                                    <div>
                                    <p className={ `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
                                        Published
                                        </p>
                                        < p className = {`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                            { courses.filter(course => course.status === 'PUBLISHED').length }
                                            </p>
                                            </div>
                                            < CheckCircle className = "w-8 h-8 text-green-600" />
                                                </div>
                                                </div>

                                                < div className = {`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`}>
                                                    <div className="flex items-center justify-between" >
                                                        <div>
                                                        <p className={ `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
                                                            Draft Courses
                                                                </p>
                                                                < p className = {`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                                    { courses.filter(course => course.status === 'DRAFT').length }
                                                                    </p>
                                                                    </div>
                                                                    < Clock className = "w-8 h-8 text-yellow-600" />
                                                                        </div>
                                                                        </div>

                                                                        < div className = {`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`}>
                                                                            <div className="flex items-center justify-between" >
                                                                                <div>
                                                                                <p className={ `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
                                                                                    Total Revenue
                                                                                        </p>
                                                                                        < p className = {`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                                                            ${ courses.reduce((total, course) => total + parseFloat(course.price || '0'), 0).toLocaleString() }
</p>
    </div>
    < DollarSign className = "w-8 h-8 text-green-600" />
        </div>
        </div>
        </div>

{/* Search and Filters */ }
<div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md` }>
    <div className="flex flex-col lg:flex-row gap-4" >
        <div className="flex-1" >
            <div className="relative" >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                                type="text"
placeholder = "Search courses..."
value = { searchTerm }
onChange = {(e) => setSearchTerm(e.target.value)}
className = {`w-full pl-10 pr-4 py-2 border rounded-lg ${darkMode
    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            />
    </div>
    </div>

    < div className = "flex gap-4" >
        <select
                            value={ statusFilter }
onChange = {(e) => setStatusFilter(e.target.value)}
className = {`px-4 py-2 border rounded-lg ${darkMode
    ? 'bg-gray-700 border-gray-600 text-gray-100'
    : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        >
    <option value="all" > All Status </option>
        < option value = "PUBLISHED" > Published </option>
            < option value = "DRAFT" > Draft </option>
                < option value = "ARCHIVED" > Archived </option>
                    </select>
                    </div>
                    </div>
                    </div>

{/* Courses Table */ }
<div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden` }>
    <div className="overflow-x-auto" >
        <table className="w-full" >
            <thead className={ `${darkMode ? 'bg-gray-700' : 'bg-gray-50'}` }>
                <tr>
                <th className={ `px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider` }>
                    Course
                    </th>
                    < th className = {`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Category
                        </th>
                        < th className = {`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                            Price
                            </th>
                            < th className = {`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                Status
                                </th>
                                < th className = {`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Lessons
                                    </th>
                                    < th className = {`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                        Enrollments
                                        </th>
                                        < th className = {`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                            Actions
                                            </th>
                                            </tr>
                                            </thead>
                                            < tbody className = {`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                            {
                                                filteredCourses.map((course) => (
                                                    <tr key= { course.id } className = {`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`} >
                                                <td className="px-6 py-4 whitespace-nowrap" >
                                                    <div className="flex items-center" >
                                                        <div className="flex-shrink-0 h-12 w-12" >
                                                            {
                                                                course.thumbnail_url ? (
                                                                    <img
                                                        className= "h-12 w-12 rounded-lg object-cover"
                                                        src={ course.thumbnail_url }
                                                        alt={ course.title }
                                                                />
                                                ) : (
                                                                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center" >
                                                                <BookOpen className="w-6 h-6 text-white" />
                                                                </div>
                                                                )}
</div>
    < div className = "ml-4" >
        <div className={ `text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
            { course.title }
            </div>
            < div className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                { course.level }
                </div>
                </div>
                </div>
                </td>
                < td className = "px-6 py-4 whitespace-nowrap" >
                    <div className={ `text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}` }>
                        { course.category?.name || 'No Category' }
                        </div>
                        </td>
                        < td className = "px-6 py-4 whitespace-nowrap" >
                            <div className={ `text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
                                ${ course.price }
</div>
    </td>
    < td className = "px-6 py-4 whitespace-nowrap" >
        { getStatusBadge(course.status) }
        </td>
        < td className = "px-6 py-4 whitespace-nowrap" >
            <div className="flex items-center" >
                <Video className="w-4 h-4 text-gray-400 mr-1" />
                    <span className={ `text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}` }>
                        { course.total_lessons || 0 }
                        </span>
                        </div>
                        </td>
                        < td className = "px-6 py-4 whitespace-nowrap" >
                            <div className="flex items-center" >
                                <Users className="w-4 h-4 text-gray-400 mr-1" />
                                    <span className={ `text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}` }>
                                        { course.total_enrollments || 0 }
                                        </span>
                                        </div>
                                        </td>
                                        < td className = "px-6 py-4 whitespace-nowrap" >
                                            <div className="flex items-center space-x-2" >
                                                <button
                                                onClick={ () => handleEditCourse(course) }
className = "p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
title = "Edit Course"
    >
    <Edit className="w-4 h-4" />
        </button>
        < button
onClick = {() => handleDeleteCourse(course.id)}
className = "p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
title = "Delete Course"
    >
    <Trash2 className="w-4 h-4" />
        </button>
        </div>
        </td>
        </tr>
                            ))}
</tbody>
    </table>

{
    filteredCourses.length === 0 && (
        <div className="text-center py-12" >
            <BookOpen className={ `w-12 h-12 ${darkMode ? 'text-gray-400' : 'text-gray-300'} mx-auto mb-4` } />
                < p className = {`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`
}>
    No courses found
        </p>
        < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
            { searchTerm || statusFilter !== 'all'
            ? 'Try adjusting your filters'
            : 'Get started by adding your first course'
                                }
</p>
    </div>
                    )}
</div>
    </div>

{/* Add/Edit Course Modal */ }
{
    showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" >
            <div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto` }>
                <div className="flex justify-between items-center mb-6" >
                    <h3 className={ `text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
                        { editingCourse? 'Edit Course': 'Add New Course' }
                        </h3>
                        < button
    onClick = {() => {
        setShowAddModal(false);
        resetForm();
    }
}
className = {`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
    <X className="w-5 h-5" />
        </button>
        </div>

{/* Step Progress */ }
<div className="flex items-center mb-6" >
    <div className={ `flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}` }>
        <div className={ `w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}` }>
            1
            </div>
            < span className = "ml-2" > Course Details </span>
                </div>
                < div className = {`flex-1 h-0.5 mx-4 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}> </div>
                    < div className = {`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={ `w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}` }>
                            2
                            </div>
                            < span className = "ml-2" > Lessons </span>
                                </div>
                                </div>

                                < form onSubmit = { handleSubmitCourse } >
                                    {/* Step 1: Course Details */ }
{
    currentStep === 1 && (
        <div className="space-y-4" >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
                <div>
                <label className={ `block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}` }>
                    Course Title *
                        </label>
                        < input
    type = "text"
    value = { courseForm.title }
    onChange = {(e) => setCourseForm({ ...courseForm, title: e.target.value })
}
className = {`w-full px-3 py-2 border rounded-lg ${darkMode
    ? 'bg-gray-700 border-gray-600 text-gray-100'
    : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
required
    />
    </div>

    < div >
    <label className={ `block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}` }>
        Price($) *
        </label>
        < input
type = "number"
step = "0.01"
value = { courseForm.price }
onChange = {(e) => setCourseForm({ ...courseForm, price: e.target.value })}
className = {`w-full px-3 py-2 border rounded-lg ${darkMode
    ? 'bg-gray-700 border-gray-600 text-gray-100'
    : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
required
    />
    </div>
    </div>

    < div >
    <label className={ `block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}` }>
        Description *
        </label>
        < textarea
value = { courseForm.description }
onChange = {(e) => setCourseForm({ ...courseForm, description: e.target.value })}
rows = { 4}
className = {`w-full px-3 py-2 border rounded-lg ${darkMode
    ? 'bg-gray-700 border-gray-600 text-gray-100'
    : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
required
    />
    </div>

    < div className = "grid grid-cols-1 md:grid-cols-3 gap-4" >
        <div>
        <label className={ `block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}` }>
            Level *
            </label>
            < select
value = { courseForm.level }
onChange = {(e) => setCourseForm({ ...courseForm, level: e.target.value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' })}
className = {`w-full px-3 py-2 border rounded-lg ${darkMode
    ? 'bg-gray-700 border-gray-600 text-gray-100'
    : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            >
    <option value="BEGINNER" > Beginner </option>
        < option value = "INTERMEDIATE" > Intermediate </option>
            < option value = "ADVANCED" > Advanced </option>
                </select>
                </div>

                < div >
                <label className={ `block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}` }>
                    Category *
                    </label>
                    < select
value = { courseForm.category_id }
onChange = {(e) => setCourseForm({ ...courseForm, category_id: e.target.value })}
className = {`w-full px-3 py-2 border rounded-lg ${darkMode
    ? 'bg-gray-700 border-gray-600 text-gray-100'
    : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
required
    >
    <option value="" > Select Category </option>
{
    categories.map((category) => (
        <option key= { category.id } value = { category.id.toString() } >
        { category.name }
        </option>
    ))
}
</select>
    </div>

    < div >
    <label className={ `block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}` }>
        Status
        </label>
        < select
value = { courseForm.status }
onChange = {(e) => setCourseForm({ ...courseForm, status: e.target.value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' })}
className = {`w-full px-3 py-2 border rounded-lg ${darkMode
    ? 'bg-gray-700 border-gray-600 text-gray-100'
    : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            >
    <option value="DRAFT" > Draft </option>
        < option value = "PUBLISHED" > Published </option>
            < option value = "ARCHIVED" > Archived </option>
                </select>
                </div>
                </div>

                < div >
                <label className={ `block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}` }>
                    Course Thumbnail
                        </label>
                        < div className = "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg" >
                            <div className="space-y-1 text-center" >
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600" >
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500" >
                                            <span>Upload a file </span>
                                                < input
type = "file"
accept = "image/*"
className = "sr-only"
onChange = {(e) => setCourseForm({ ...courseForm, thumbnail: e.target.files?.[0] || null })}
                                                        />
    </label>
    < p className = "pl-1" > or drag and drop </p>
        </div>
        < p className = "text-xs text-gray-500" > PNG, JPG, GIF up to 10MB </p>
            </div>
            </div>
            </div>

            < div className = "flex justify-end space-x-4 pt-4" >
                <button
                                            type="button"
onClick = {() => {
    setShowAddModal(false);
    resetForm();
}}
className = {`px-4 py-2 border rounded-lg ${darkMode
    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
    } transition-colors`}
                                        >
    Cancel
    </button>
{
    editingCourse ? (
        <button
                                                type= "submit"
                                                disabled = { isSubmitting }
    className = "px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
        >
        { isSubmitting? 'Updating...': 'Update Course' }
        </button>
                                        ) : (
        <>
        <button
                                                    type= "button"
    onClick = {() => setCurrentStep(2)
}
className = "px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
    >
    Next: Add Lessons
        </button>
        < button
type = "submit"
disabled = { isSubmitting }
className = "px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
    >
    { isSubmitting? 'Creating...': 'Create Course' }
    </button>
    </>
                                        )}
</div>
    </div>
                            )}

{/* Step 2: Lessons (only for new courses) */ }
{
    currentStep === 2 && !editingCourse && (
        <div className="space-y-6" >
            <div className="flex justify-between items-center" >
                <h4 className={ `text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
                    Course Lessons
                        </h4>
                        < button
    type = "button"
    onClick = { addLesson }
    className = "inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
        <Plus className="w-4 h-4 mr-2" />
            Add Lesson
                </button>
                </div>

                < div className = "space-y-4" >
                {
                    lessons.map((lesson, index) => (
                        <div key= { index } className = {`p-4 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`} >
                    <div className="flex justify-between items-start mb-4" >
                        <h5 className={ `font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
                            Lesson { index + 1 }
    </h5>
        < button
    type = "button"
    onClick = {() => removeLesson(index)
}
className = "text-red-600 hover:text-red-800"
    >
    <X className="w-4 h-4" />
        </button>
        </div>

        < div className = "grid grid-cols-1 md:grid-cols-2 gap-4" >
            <div>
            <label className={ `block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}` }>
                Lesson Title
                    </label>
                    < input
type = "text"
value = { lesson.title }
onChange = {(e) => updateLesson(index, 'title', e.target.value)}
className = {`w-full px-3 py-2 border rounded-lg ${darkMode
    ? 'bg-gray-600 border-gray-500 text-gray-100'
    : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                        />
    </div>

    < div >
    <label className={ `block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}` }>
        Duration(minutes)
        </label>
        < input
type = "number"
value = { lesson.duration }
onChange = {(e) => updateLesson(index, 'duration', parseInt(e.target.value) || 0)}
className = {`w-full px-3 py-2 border rounded-lg ${darkMode
    ? 'bg-gray-600 border-gray-500 text-gray-100'
    : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                        />
    </div>
    </div>

    < div className = "mt-4" >
        <label className={ `block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}` }>
            Description
            </label>
            < textarea
value = { lesson.description }
onChange = {(e) => updateLesson(index, 'description', e.target.value)}
rows = { 2}
className = {`w-full px-3 py-2 border rounded-lg ${darkMode
    ? 'bg-gray-600 border-gray-500 text-gray-100'
    : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                    />
    </div>

    < div className = "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4" >
        <div>
        <label className={ `block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}` }>
            Video Source
                </label>
                < select
value = { lesson.video_source }
onChange = {(e) => updateLesson(index, 'video_source', e.target.value)}
className = {`w-full px-3 py-2 border rounded-lg ${darkMode
    ? 'bg-gray-600 border-gray-500 text-gray-100'
    : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                        >
    <option value="YOUTUBE" > YouTube </option>
        < option value = "VIMEO" > Vimeo </option>
            < option value = "DRIVE" > Google Drive </option>
                < option value = "UPLOAD" > Upload </option>
                    </select>
                    </div>

                    < div className = "md:col-span-2" >
                        <label className={ `block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}` }>
                            Video URL
                                </label>
                                < input
type = "url"
value = { lesson.video_url }
onChange = {(e) => updateLesson(index, 'video_url', e.target.value)}
placeholder = "https://..."
className = {`w-full px-3 py-2 border rounded-lg ${darkMode
    ? 'bg-gray-600 border-gray-500 text-gray-100'
    : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                        />
    </div>
    </div>

    < div className = "mt-4" >
        <label className="flex items-center" >
            <input
                                                            type="checkbox"
checked = { lesson.is_preview }
onChange = {(e) => updateLesson(index, 'is_preview', e.target.checked)}
className = "mr-2"
    />
    <span className={ `text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}` }>
        This is a preview lesson(free to watch)
            </span>
            </label>
            </div>
            </div>
                                        ))}

{
    lessons.length === 0 && (
        <div className="text-center py-8" >
            <Video className={ `w-12 h-12 ${darkMode ? 'text-gray-400' : 'text-gray-300'} mx-auto mb-4` } />
                < p className = {`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`
}>
    No lessons added yet
        </p>
        < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
            Click "Add Lesson" to get started
                </p>
                </div>
                                        )}
</div>

    < div className = "flex justify-between pt-4" >
        <button
                                            type="button"
onClick = {() => setCurrentStep(1)}
className = {`px-4 py-2 border rounded-lg ${darkMode
    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
    } transition-colors`}
                                        >
    Back to Course Details
        </button>

        < div className = "space-x-4" >
            <button
                                                type="button"
onClick = {() => {
    setShowAddModal(false);
    resetForm();
}}
className = {`px-4 py-2 border rounded-lg ${darkMode
    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
    } transition-colors`}
                                            >
    Cancel
    </button>
    < button
type = "submit"
disabled = { isSubmitting }
className = "px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
    >
    { isSubmitting? 'Creating...': 'Create Course & Lessons' }
    </button>
    </div>
    </div>
    </div>
                            )}
</form>
    </div>
    </div>
            )}
</div>
    );
};

export default CoursesManagement;