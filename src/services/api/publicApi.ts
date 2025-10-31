import axios from 'axios';

// API Base URL
export const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create a public axios instance (no auth required)
const publicClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// ==================== Types ====================

export interface Course {
    id: number;
    category_id: number;
    instructor_id: number;
    title: string;
    slug: string;
    description: string;
    thumbnail_url?: string;
    video_url?: string;
    price: string;
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    total_lessons?: number;
    total_duration?: number;
    average_rating?: string;
    enrollment_count?: number;
    is_enrolled?: boolean;
    created_at: string;
    updated_at: string;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
    instructor?: {
        id: number;
        name: string;
        email: string;
        full_name: string;
        role: string;
    };
    lessons?: {
        id: number;
        title: string;
        description: string;
        course_id: number;
        video_source: string;
        video_url: string;
        duration: number;
        position: number;
        is_preview: boolean;
        created_at: string;
        updated_at: string;
    }[];
    reviews?: any[];
}

export interface PaginatedCourses {
    current_page: number;
    data: Course[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

// ==================== Public API Functions ====================

export const publicApi = {
    // Get all published courses
    async getCourses(params?: {
        category?: string;
        search?: string;
        limit?: number;
        page?: number;
    }, authToken?: string): Promise<PaginatedCourses> {
        const headers: any = {};
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await publicClient.get('/courses', {
            params,
            headers
        });
        return response.data;
    },

    // Get single course by slug
    async getCourse(slug: string, authToken?: string): Promise<Course> {
        const headers: any = {};
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await publicClient.get(`/courses/${slug}`, { headers });
        return response.data;
    },

    // Get all categories
    async getCategories(): Promise<Category[]> {
        const response = await publicClient.get('/categories');
        return response.data;
    },
};

export default publicApi;
