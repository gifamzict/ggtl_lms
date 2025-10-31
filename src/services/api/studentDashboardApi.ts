import { toast } from "@/hooks/use-toast";

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Get auth token from localStorage
const getAuthToken = () => {
    // Use the same localStorage key as the main auth system
    return localStorage.getItem('auth_token');
};

// Make authenticated API request
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('laravel-auth');
            window.location.href = '/';
            throw new Error('Authentication expired');
        }
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
};

export const studentDashboardApi = {
    // Get student's enrolled courses
    getEnrolledCourses: async () => {
        try {
            return await apiRequest('/my-courses');
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
            toast({
                title: "Error",
                description: "Failed to load enrolled courses",
                variant: "destructive",
            });
            throw error;
        }
    },

    // Get student dashboard stats
    getDashboardStats: async () => {
        try {
            return await apiRequest('/student/dashboard-stats');
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            toast({
                title: "Error",
                description: "Failed to load dashboard statistics",
                variant: "destructive",
            });
            throw error;
        }
    },

    // Get student's lesson progress for a course
    getCourseProgress: async (courseId: number) => {
        try {
            return await apiRequest(`/student/courses/${courseId}/progress`);
        } catch (error) {
            console.error('Error fetching course progress:', error);
            toast({
                title: "Error",
                description: "Failed to load course progress",
                variant: "destructive",
            });
            throw error;
        }
    },

    // Get available courses for enrollment
    getAvailableCourses: async () => {
        try {
            return await apiRequest('/courses');
        } catch (error) {
            console.error('Error fetching available courses:', error);
            toast({
                title: "Error",
                description: "Failed to load available courses",
                variant: "destructive",
            });
            throw error;
        }
    },

    // Enroll in a course
    enrollInCourse: async (courseId: number) => {
        try {
            return await apiRequest('/student/enroll', {
                method: 'POST',
                body: JSON.stringify({ course_id: courseId }),
            });
        } catch (error) {
            console.error('Error enrolling in course:', error);
            toast({
                title: "Error",
                description: "Failed to enroll in course",
                variant: "destructive",
            });
            throw error;
        }
    },

    // Get course details with lessons
    getCourseDetails: async (courseId: number) => {
        try {
            return await apiRequest(`/courses/${courseId}`);
        } catch (error) {
            console.error('Error fetching course details:', error);
            toast({
                title: "Error",
                description: "Failed to load course details",
                variant: "destructive",
            });
            throw error;
        }
    },

    // Check if user is enrolled in a specific course
    checkEnrollmentStatus: async (courseId: number) => {
        try {
            const token = getAuthToken();
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            };

            const response = await fetch(`${API_BASE_URL}/enrollment/${courseId}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                // For enrollment check, don't auto-logout on 401/404
                throw new Error(`Enrollment check failed: ${response.status}`);
            }

            return response.json();
        } catch (error) {
            // For enrollment checks, just throw the error without logging out
            throw error;
        }
    },

    // Get course learning data for enrolled user
    getLearnCourse: async (slug: string) => {
        return await apiRequest(`/learn/${slug}`, {
            method: 'GET',
        });
    },

    // Get lesson progress
    getLessonProgress: async (lessonId: number) => {
        return await apiRequest(`/lessons/${lessonId}/progress`, {
            method: 'GET',
        });
    },

    // Update lesson progress
    updateLessonProgress: async (lessonId: number, progressData: { completed: boolean; watched_duration: number }) => {
        return await apiRequest(`/lessons/${lessonId}/progress`, {
            method: 'PUT',
            body: JSON.stringify(progressData),
        });
    },
};
