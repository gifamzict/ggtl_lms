# Laravel Backend Migration Guide

## Project Structure
- **Frontend**: `/Users/quovatech/Documents/gifamz-africa-learn` (React + Vite)
- **Backend**: `/Users/quovatech/Documents/gifamz-africa-learn-api` (Laravel 12 + PostgreSQL)

## ✅ Completed Steps

### 1. Laravel Project Created
- Laravel 12.35.1 installed
- Laravel Sanctum installed for SPA authentication
- Sanctum config published

### 2. Migration Files Created
All migration files have been created:
- `2025_10_27_155539_add_role_and_profile_fields_to_users_table.php`
- `2025_10_27_155556_create_categories_table.php`
- `2025_10_27_155556_create_courses_table.php`
- `2025_10_27_155557_create_lessons_table.php`
- `2025_10_27_155557_create_enrollments_table.php`
- `2025_10_27_155557_create_reviews_table.php`
- `2025_10_27_155557_create_lesson_progress_table.php`
- `2025_10_27_155557_create_payment_gateway_settings_table.php`

## 🔄 Next Steps

### Step 1: Configure Database (.env)
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=gifamz_learn
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Step 2: Write Migration Content
Each migration needs to replicate the Supabase schema.

### Step 3: Create Models
- User (already exists, needs extension)
- Category
- Course
- Lesson
- Enrollment
- Review
- LessonProgress
- PaymentGatewaySetting

### Step 4: Create API Controllers
- AuthController (register, login, logout, profile)
- CourseController (CRUD, publish/unpublish)
- CategoryController (CRUD)
- LessonController (CRUD for course lessons)
- EnrollmentController (enroll, my-courses, progress)
- ReviewController (submit review, get reviews)
- AdminController (dashboard stats, manage users)
- PaymentController (initialize, webhook)

### Step 5: Define API Routes
```php
// Public routes
POST /api/register
POST /api/login
GET /api/courses (browse all published)
GET /api/courses/{slug} (course details)
GET /api/categories

// Protected routes (student)
GET /api/user (current user profile)
POST /api/logout
GET /api/my-courses (enrollments)
POST /api/enroll (enroll in course)
PUT /api/lessons/{id}/progress (update lesson progress)
POST /api/reviews (submit review)

// Protected routes (admin)
POST /api/admin/courses (create course)
PUT /api/admin/courses/{id} (update course)
DELETE /api/admin/courses/{id} (delete course)
GET /api/admin/dashboard/stats
POST /api/admin/lessons (create lesson)
POST /api/admin/categories (create category)
GET /api/admin/students (list all students)
PUT /api/admin/payment-settings (update Paystack keys)

// Payment routes
POST /api/payment/initialize
POST /api/payment/webhook (Paystack webhook)
```

### Step 6: Update Frontend
- Replace `@/integrations/supabase/client` with axios API client
- Update all Supabase queries to Laravel API calls
- Configure Sanctum CSRF protection
- Update authentication flow

## Database Schema Mapping

### Supabase → Laravel

#### users (Laravel default + extensions)
- id (uuid) → id (bigint auto)
- email
- password
- **NEW FIELDS:**
  - full_name (string)
  - role (enum: STUDENT, INSTRUCTOR, ADMIN, SUPER_ADMIN)
  - bio (text nullable)
  - avatar_url (string nullable)
  - phone (string nullable)
  - email_verified_at (timestamp)

#### categories
- id (uuid) → id (bigint)
- name (unique)
- description (text nullable)
- slug (unique)
- timestamps

#### courses
- id (uuid) → id (bigint)
- title
- slug (unique)
- description (text)
- thumbnail_url (nullable)
- price (decimal 10,2)
- status (enum: DRAFT, PUBLISHED, ARCHIVED)
- instructor_id (foreign to users)
- category_id (foreign to categories, nullable)
- total_lessons (int default 0)
- total_duration (int default 0) // seconds
- timestamps

#### lessons
- id (uuid) → id (bigint)
- title
- description (text nullable)
- course_id (foreign to courses, cascade delete)
- video_source (enum: UPLOAD, DRIVE, YOUTUBE, VIMEO)
- video_url
- duration (int default 0) // seconds
- position (int default 0)
- is_preview (boolean default false)
- timestamps

#### enrollments
- id (uuid) → id (bigint)
- user_id (foreign to users, cascade delete)
- course_id (foreign to courses, cascade delete)
- enrolled_at (timestamp)
- completed_at (timestamp nullable)
- progress_percentage (decimal 5,2 default 0)
- UNIQUE(user_id, course_id)

#### reviews
- id (uuid) → id (bigint)
- user_id (foreign to users, cascade delete)
- course_id (foreign to courses, cascade delete)
- rating (int 1-5)
- comment (text nullable)
- timestamps
- UNIQUE(user_id, course_id)

#### lesson_progress
- id (uuid) → id (bigint)
- user_id (foreign to users, cascade delete)
- lesson_id (foreign to lessons, cascade delete)
- completed (boolean default false)
- watched_duration (int default 0) // seconds
- completed_at (timestamp nullable)
- timestamps
- UNIQUE(user_id, lesson_id)

#### payment_gateway_settings
- id (uuid) → id (bigint)
- paystack_public_key_encrypted (text)
- paystack_secret_key_encrypted (text)
- is_live_mode (boolean default false)
- timestamps

## API Endpoints Specification

### Authentication
```
POST /api/register
Body: { email, password, password_confirmation, full_name, role? }
Response: { user, token }

POST /api/login
Body: { email, password, role_filter?: ['ADMIN', 'SUPER_ADMIN'] }
Response: { user, token }

POST /api/logout
Headers: Authorization: Bearer {token}
Response: { message }

GET /api/user
Headers: Authorization: Bearer {token}
Response: { user }
```

### Courses (Public)
```
GET /api/courses?category={slug}&search={query}&limit={10}
Response: { data: [courses] }

GET /api/courses/{slug}
Response: { course, lessons, reviews, instructor }
```

### Student Routes
```
GET /api/my-courses
Headers: Authorization: Bearer {token}
Response: { enrollments: [{ course, progress }] }

POST /api/enroll
Body: { course_id }
Headers: Authorization: Bearer {token}
Response: { enrollment }

PUT /api/lessons/{id}/progress
Body: { watched_duration, completed }
Headers: Authorization: Bearer {token}
Response: { progress }
```

### Admin Routes
```
GET /api/admin/dashboard/stats
Headers: Authorization: Bearer {token}
Response: { total_courses, total_students, total_revenue, monthly_data }

POST /api/admin/courses
Body: { title, slug, description, thumbnail, price, category_id, status }
Headers: Authorization: Bearer {token}
Response: { course }

PUT /api/admin/courses/{id}
Body: { ... }
Headers: Authorization: Bearer {token}
Response: { course }

DELETE /api/admin/courses/{id}
Headers: Authorization: Bearer {token}
Response: { message }
```

## CORS Configuration
Laravel needs to allow requests from Vercel frontend:
```php
// config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['https://www.ggtl.tech', 'http://localhost:8080'],
'supports_credentials' => true,
```

## Sanctum Configuration for SPA
```php
// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:8080,127.0.0.1,127.0.0.1:8000,::1,www.ggtl.tech,ggtl.tech')),
```

## Frontend Changes Required
1. Remove Supabase client
2. Create axios API client with base URL
3. Add CSRF token fetching for Sanctum
4. Update all data fetching to use REST endpoints
5. Store auth token in localStorage/cookie
6. Update file upload handling

## Deployment
- Backend: Deploy Laravel to VPS/Laravel Forge/Heroku
- Database: PostgreSQL on same server or managed (RDS/DigitalOcean)
- Domain: api.ggtl.tech (or subdomain)
- SSL: Required for production
- Environment: Set all .env variables on server
