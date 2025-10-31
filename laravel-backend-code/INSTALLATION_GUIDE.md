# Laravel Backend Installation & Setup Guide

## Files Created Summary

### ✅ Migrations (8 files)
All migration files have been created in `laravel-backend-code/migrations/`:
1. `2025_10_27_155539_add_role_and_profile_fields_to_users_table.php`
2. `2025_10_27_155556_create_categories_table.php`
3. `2025_10_27_155556_create_courses_table.php`
4. `2025_10_27_155557_create_lessons_table.php`
5. `2025_10_27_155557_create_enrollments_table.php`
6. `2025_10_27_155557_create_reviews_table.php`
7. `2025_10_27_155557_create_lesson_progress_table.php`
8. `2025_10_27_155557_create_payment_gateway_settings_table.php`

### ✅ Models (7 files)
All Eloquent models created in `laravel-backend-code/models/`:
1. `User.php` (extended with relationships)
2. `Category.php`
3. `Course.php`
4. `Lesson.php`
5. `Enrollment.php`
6. `Review.php`
7. `LessonProgress.php`

### ✅ Controllers (10 files)
All API controllers created in `laravel-backend-code/controllers/`:
1. `AuthController.php` - Registration, login, logout, profile
2. `CourseController.php` - Browse, create, update, delete courses
3. `CategoryController.php` - Category CRUD
4. `LessonController.php` - Lesson CRUD and reordering
5. `EnrollmentController.php` - My courses, enrollment management
6. `LessonProgressController.php` - Track lesson completion
7. `ReviewController.php` - Submit and manage reviews
8. `AdminController.php` - Dashboard stats, user management
9. `PaymentController.php` - Paystack integration
10. Middleware: `AdminMiddleware.php`

### ✅ Routes
- `routes/api.php` - Complete API routes with middleware

---

## Step-by-Step Installation

### Step 1: Copy Files to Laravel Project

```bash
# Navigate to your Laravel project
cd /Users/quovatech/Documents/gifamz-africa-learn-api

# Copy migration files
cp /Users/quovatech/Documents/gifamz-africa-learn/laravel-backend-code/migrations/* database/migrations/

# Copy model files
cp /Users/quovatech/Documents/gifamz-africa-learn/laravel-backend-code/models/* app/Models/

# Copy controller files
mkdir -p app/Http/Controllers/Api
cp /Users/quovatech/Documents/gifamz-africa-learn/laravel-backend-code/controllers/*.php app/Http/Controllers/Api/

# Copy middleware
cp /Users/quovatech/Documents/gifamz-africa-learn/laravel-backend-code/middleware/AdminMiddleware.php app/Http/Middleware/

# Copy routes
cp /Users/quovatech/Documents/gifamz-africa-learn/laravel-backend-code/routes/api.php routes/
```

---

### Step 2: Configure Database

Edit `.env` file:

```env
APP_NAME="GGTL API"
APP_ENV=local
APP_KEY=base64:... # Already generated
APP_DEBUG=true
APP_URL=http://localhost:8000

# Frontend URL for CORS and callbacks
FRONTEND_URL=http://localhost:8080

# PostgreSQL Database Configuration
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=gifamz_learn
DB_USERNAME=your_postgres_username
DB_PASSWORD=your_postgres_password

# Sanctum Configuration
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:8080,127.0.0.1,127.0.0.1:8000,www.ggtl.tech,ggtl.tech
SESSION_DRIVER=cookie
SESSION_DOMAIN=localhost
```

---

### Step 3: Register Middleware

Edit `bootstrap/app.php` and add the admin middleware:

```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);
        
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
```

---

### Step 4: Configure CORS

Edit `config/cors.php`:

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:8080',
        'https://www.ggtl.tech',
        'https://ggtl.tech',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
```

---

### Step 5: Configure Sanctum

Edit `config/sanctum.php`:

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    Sanctum::currentApplicationUrlWithPort(),
    ',localhost:8080,www.ggtl.tech,ggtl.tech'
))),
```

---

### Step 6: Create PostgreSQL Database

```bash
# Create database
createdb gifamz_learn

# Or using psql
psql -U postgres
CREATE DATABASE gifamz_learn;
\q
```

---

### Step 7: Run Migrations

```bash
cd /Users/quovatech/Documents/gifamz-africa-learn-api

php artisan migrate
```

Expected output:
```
Migration table created successfully.
Migrating: 0001_01_01_000000_create_users_table
Migrated:  0001_01_01_000000_create_users_table
...
Migrating: 2025_10_27_155557_create_payment_gateway_settings_table
Migrated:  2025_10_27_155557_create_payment_gateway_settings_table
```

---

### Step 8: Create Admin User (Seeder)

Create `database/seeders/AdminSeeder.php`:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'email' => 'admin@ggtl.tech',
            'password' => Hash::make('Admin@123456'),
            'full_name' => 'GGTL Admin',
            'role' => 'SUPER_ADMIN',
        ]);

        $this->command->info('Admin user created: admin@ggtl.tech / Admin@123456');
    }
}
```

Run seeder:
```bash
php artisan db:seed --class=AdminSeeder
```

---

### Step 9: Start Laravel Server

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

Server should start at `http://127.0.0.1:8000`

---

### Step 10: Test API Endpoints

```bash
# Test registration
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "full_name": "Test User"
  }'

# Test login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ggtl.tech",
    "password": "Admin@123456"
  }'

# Test get courses (public)
curl http://localhost:8000/api/courses

# Test get categories
curl http://localhost:8000/api/categories
```

---

## API Endpoint Summary

### Public Endpoints
```
POST   /api/register
POST   /api/login
GET    /api/courses
GET    /api/courses/{slug}
GET    /api/categories
GET    /api/payment/public-key
```

### Authenticated Endpoints
```
POST   /api/logout
GET    /api/user
PUT    /api/user/profile
GET    /api/my-courses
POST   /api/enroll
GET    /api/learn/{slug}
PUT    /api/lessons/{id}/progress
POST   /api/reviews
POST   /api/payment/initialize
POST   /api/payment/verify
```

### Admin Endpoints (require admin role)
```
GET    /api/admin/dashboard/stats
GET    /api/admin/courses
POST   /api/admin/courses
PUT    /api/admin/courses/{id}
DELETE /api/admin/courses/{id}
POST   /api/admin/lessons
PUT    /api/admin/lessons/{id}
DELETE /api/admin/lessons/{id}
POST   /api/admin/categories
GET    /api/admin/students
GET    /api/admin/admins
PUT    /api/admin/users/{id}/promote
GET    /api/admin/orders
PUT    /api/admin/payment-settings
```

---

## Next Steps

1. ✅ Backend API is ready
2. ⏭️ Update frontend to use Laravel API
3. ⏭️ Deploy Laravel backend to production
4. ⏭️ Configure file storage (S3/DigitalOcean Spaces)
5. ⏭️ Test all endpoints thoroughly
6. ⏭️ Migrate data from Supabase to PostgreSQL

---

## Deployment Checklist

### Production Environment Variables
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.ggtl.tech

FRONTEND_URL=https://www.ggtl.tech

DB_CONNECTION=pgsql
DB_HOST=your-production-db-host
DB_PORT=5432
DB_DATABASE=gifamz_learn_prod
DB_USERNAME=prod_user
DB_PASSWORD=secure_password

SANCTUM_STATEFUL_DOMAINS=www.ggtl.tech,ggtl.tech
SESSION_DOMAIN=.ggtl.tech
```

### Deployment Options
1. **Laravel Forge** - Easiest, managed Laravel hosting
2. **DigitalOcean App Platform** - Simple deployment
3. **Heroku** - Quick setup with PostgreSQL addon
4. **VPS (Ubuntu)** - Full control, requires manual setup
5. **AWS EC2 + RDS** - Scalable but complex

### Recommended: Laravel Forge + DigitalOcean
- Deploy to DigitalOcean droplet via Forge
- Managed database, SSL, deployments
- $12/month droplet + $12/month Forge

---

## Troubleshooting

### CORS Issues
Ensure CORS middleware is registered and origins are correct in `config/cors.php`

### Token Mismatch
Run `php artisan config:clear` after changing Sanctum settings

### Database Connection
Check PostgreSQL is running and credentials are correct

### Migration Errors
Run `php artisan migrate:fresh` to reset database (⚠️ deletes all data)

---

## Status: Backend Complete ✅

All Laravel backend files are ready. Next step is updating the frontend to connect to this API.
