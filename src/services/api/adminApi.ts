import { apiClient } from './config';

// ==================== Types ====================

export interface User {
    id: number;
    name: string;
    full_name?: string;
    email: string;
    role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'SUPER_ADMIN';
    bio?: string;
    avatar_url?: string;
    phone?: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    courses_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Course {
    id: number;
    category_id: number;
    instructor_id: number;
    title: string;
    slug: string;
    description: string;
    thumbnail_url?: string;
    video_url?: string; // Google Drive link supported
    price: string;
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    total_lessons?: number;
    total_duration?: number;
    total_enrollments?: number;
    average_rating?: string;
    created_at: string;
    updated_at: string;
    category?: Category;
    instructor?: User;
}

export interface Lesson {
    id: number;
    course_id: number;
    title: string;
    slug: string;
    description?: string;
    video_url: string; // Google Drive link supported
    duration?: number; // in minutes
    order_number: number;
    is_preview: boolean;
    status: 'DRAFT' | 'PUBLISHED';
    created_at: string;
    updated_at: string;
    course?: Course;
}

export interface Enrollment {
    id: number;
    user_id: number;
    course_id: number;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    progress_percentage: number;
    completed_lessons: number;
    enrolled_at: string;
    completed_at?: string;
    created_at: string;
    updated_at: string;
    user?: User;
    course?: Course;
}

export interface Review {
    id: number;
    user_id: number;
    course_id: number;
    rating: number; // 1-5
    comment?: string;
    created_at: string;
    updated_at: string;
    user?: User;
    course?: Course;
}

export interface DashboardStats {
    stats: {
        total_courses: number;
        published_courses: number;
        draft_courses: number;
        total_students: number;
        active_students: number;
        total_instructors: number;
        total_enrollments: number;
        total_revenue: number;
        total_reviews: number;
        average_rating: number;
        new_students_this_month: number;
        students_change: number;
        enrollments_change: number;
        revenue_change: number;
    };
    monthly_data: Array<{
        month: string;
        enrollment_count: number;
        revenue: number;
    }>;
    top_courses: Course[];
    recent_enrollments: Enrollment[];
}

// ==================== Authentication ====================

export const adminAuth = {
    // Login
    async login(email: string, password: string) {
        const response = await apiClient.post('/login', { email, password });
        const { token, user } = response.data;

        // Store token and user in localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return { token, user };
    },

    // Logout
    async logout() {
        await apiClient.post('/logout');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    },

    // Verify admin access
    async verifyAdmin(): Promise<User> {
        const response = await apiClient.get('/admin/verify');
        return response.data.user;
    },

    // Get current user
    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        return JSON.parse(userStr);
    },
};

// ==================== Dashboard ====================

export const adminDashboard = {
    async getStats(): Promise<DashboardStats> {
        const response = await apiClient.get('/admin/dashboard');
        return response.data;
    },
};

// ==================== Categories ====================

export const adminCategories = {
    async getAll(): Promise<Category[]> {
        const response = await apiClient.get('/admin/categories');
        return response.data;
    },

    async getById(id: number): Promise<Category> {
        const response = await apiClient.get(`/admin/categories/${id}`);
        return response.data;
    },

    async create(data: {
        name: string;
        description?: string;
        image_url?: string;
    }): Promise<Category> {
        const response = await apiClient.post('/admin/categories', data);
        return response.data;
    },

    async update(id: number, data: {
        name?: string;
        description?: string;
        image_url?: string;
    }): Promise<Category> {
        const response = await apiClient.put(`/admin/categories/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await apiClient.delete(`/admin/categories/${id}`);
    },
};

// ==================== Courses ====================

export const adminCourses = {
    async getAll(params?: {
        category_id?: number;
        status?: string;
        search?: string;
    }): Promise<Course[]> {
        const response = await apiClient.get('/admin/courses', { params });
        return response.data;
    },

    async getById(id: number): Promise<Course> {
        const response = await apiClient.get(`/admin/courses/${id}`);
        return response.data;
    },

    async create(data: {
        category_id: number;
        title: string;
        description: string;
        thumbnail_url?: string;
        video_url?: string; // Google Drive link
        price: number;
        level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
        status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    }): Promise<Course> {
        const response = await apiClient.post('/admin/courses', data);
        return response.data;
    },

    async update(id: number, data: {
        category_id?: number;
        title?: string;
        description?: string;
        thumbnail_url?: string;
        video_url?: string; // Google Drive link
        price?: number;
        level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
        status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    }): Promise<Course> {
        const response = await apiClient.put(`/admin/courses/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await apiClient.delete(`/admin/courses/${id}`);
    },
};

// ==================== Lessons ====================

export const adminLessons = {
    async getByCourse(courseId: number): Promise<Lesson[]> {
        const response = await apiClient.get(`/admin/courses/${courseId}/lessons`);
        return response.data;
    },

    async getById(courseId: number, lessonId: number): Promise<Lesson> {
        const response = await apiClient.get(`/admin/courses/${courseId}/lessons/${lessonId}`);
        return response.data;
    },

    async create(courseId: number, data: {
        title: string;
        description?: string;
        video_url: string; // Google Drive link
        video_source?: 'UPLOAD' | 'DRIVE' | 'YOUTUBE' | 'VIMEO';
        duration?: number;
        order_number: number;
        is_preview?: boolean;
        status?: 'DRAFT' | 'PUBLISHED';
    }): Promise<Lesson> {
        const response = await apiClient.post(`/admin/courses/${courseId}/lessons`, data);
        return response.data;
    },

    async update(courseId: number, lessonId: number, data: {
        title?: string;
        description?: string;
        video_url?: string; // Google Drive link
        video_source?: 'UPLOAD' | 'DRIVE' | 'YOUTUBE' | 'VIMEO';
        duration?: number;
        order_number?: number;
        is_preview?: boolean;
        status?: 'DRAFT' | 'PUBLISHED';
    }): Promise<Lesson> {
        const response = await apiClient.put(`/admin/courses/${courseId}/lessons/${lessonId}`, data);
        return response.data;
    },

    async delete(courseId: number, lessonId: number): Promise<void> {
        await apiClient.delete(`/admin/courses/${courseId}/lessons/${lessonId}`);
    },
};

// ==================== Enrollments ====================

export const adminEnrollments = {
    async getAll(params?: {
        course_id?: number;
        user_id?: number;
        status?: string;
    }): Promise<Enrollment[]> {
        const response = await apiClient.get('/admin/enrollments', { params });
        return response.data;
    },

    async getById(id: number): Promise<Enrollment> {
        const response = await apiClient.get(`/admin/enrollments/${id}`);
        return response.data;
    },

    async updateStatus(id: number, status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'): Promise<Enrollment> {
        const response = await apiClient.put(`/admin/enrollments/${id}`, { status });
        return response.data;
    },
};

// ==================== Reviews ====================

export const adminReviews = {
    async getAll(params?: {
        course_id?: number;
        user_id?: number;
    }): Promise<Review[]> {
        const response = await apiClient.get('/admin/reviews', { params });
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await apiClient.delete(`/admin/reviews/${id}`);
    },
};

// ==================== Users ====================

export const adminUsers = {
    async getStudents(params?: {
        search?: string;
        page?: number;
    }): Promise<{ data: User[]; total: number; current_page: number; last_page: number }> {
        const response = await apiClient.get('/admin/students', { params });
        return response.data;
    },

    async getAdmins(): Promise<User[]> {
        const response = await apiClient.get('/admin/admins');
        return response.data;
    },

    async promoteToAdmin(userId: number, role: 'ADMIN' | 'SUPER_ADMIN'): Promise<User> {
        const response = await apiClient.put(`/admin/users/${userId}/promote`, { role });
        return response.data;
    },

    async demoteAdmin(userId: number): Promise<User> {
        const response = await apiClient.put(`/admin/users/${userId}/demote`);
        return response.data;
    },
};

// ==================== Orders ====================

export const adminOrders = {
    async getAll(params?: {
        status?: string;
        page?: number;
        search?: string;
    }): Promise<{
        data: Enrollment[];
        total: number;
        current_page: number;
        last_page: number;
        per_page: number;
        from: number;
        to: number;
    }> {
        const response = await apiClient.get('/admin/orders', { params });
        return response.data;
    },
};

// ==================== Payments ====================

export const adminPayments = {
    async getSettings(): Promise<{
        paystack_public_key: string;
        paystack_secret_key?: string;
    }> {
        const response = await apiClient.get('/admin/payment-settings');
        return response.data;
    },

    async updateSettings(settings: {
        paystack_public_key: string;
        paystack_secret_key: string;
    }): Promise<void> {
        await apiClient.put('/admin/payment-settings', settings);
    },

    async getTransactions(params?: {
        status?: string;
        page?: number;
        search?: string;
    }): Promise<{
        data: any[];
        total: number;
        current_page: number;
        last_page: number;
    }> {
        const response = await apiClient.get('/admin/payments', { params });
        return response.data;
    },

    async approvePayment(enrollmentId: number): Promise<void> {
        await apiClient.post(`/admin/payments/${enrollmentId}/approve`);
    },

    async bulkApprovePayments(enrollmentIds: number[]): Promise<{
        message: string;
        approved_count: number;
    }> {
        const response = await apiClient.post('/admin/payments/bulk-approve', {
            enrollment_ids: enrollmentIds
        });
        return response.data;
    },

    async approveAllPayments(): Promise<{
        message: string;
        approved_count: number;
    }> {
        const response = await apiClient.post('/admin/payments/approve-all');
        return response.data;
    },
};

// Export everything together
export const adminApi = {
    auth: adminAuth,
    dashboard: adminDashboard,
    categories: adminCategories,
    courses: adminCourses,
    lessons: adminLessons,
    enrollments: adminEnrollments,
    reviews: adminReviews,
    users: adminUsers,
    orders: adminOrders,
    payments: adminPayments,
};
