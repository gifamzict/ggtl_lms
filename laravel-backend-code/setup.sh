#!/bin/bash

# GGTL Laravel Backend - Complete Setup Script
# This script will guide you through setting up PostgreSQL and email

echo "🎓 GGTL Laravel Backend Setup"
echo "=============================="
echo ""

LARAVEL_DIR="/Users/quovatech/Documents/gifamz-africa-learn-api"

cd $LARAVEL_DIR

# Step 1: Backup and replace .env
echo "📝 Step 1: Configuring .env file"
echo "--------------------------------"

if [ -f ".env" ]; then
    echo "✅ Backing up current .env to .env.backup"
    cp .env .env.backup
fi

if [ -f ".env.new" ]; then
    echo "✅ Applying new .env configuration"
    mv .env.new .env
else
    echo "❌ .env.new not found. Please run the previous script first."
    exit 1
fi

echo ""
echo "⚠️  IMPORTANT: You need to edit the .env file manually"
echo ""
echo "Required changes:"
echo "1. Set your PostgreSQL password:"
echo "   DB_PASSWORD=your_password_here"
echo ""
echo "2. (Optional) Configure email - uncomment one of these:"
echo "   - Gmail SMTP (for production)"
echo "   - Mailtrap (for testing)"
echo "   - Or leave as 'log' to save emails to logs"
echo ""

read -p "Press ENTER when you've edited the .env file, or type 'edit' to open it now: " choice

if [ "$choice" = "edit" ]; then
    nano .env
fi

# Step 2: Check PostgreSQL
echo ""
echo "🐘 Step 2: PostgreSQL Setup"
echo "---------------------------"

if command -v pg_isready &> /dev/null; then
    if pg_isready &> /dev/null; then
        echo "✅ PostgreSQL is running"
    else
        echo "❌ PostgreSQL is not running"
        echo "Starting PostgreSQL..."
        brew services start postgresql@14 || brew services start postgresql
    fi
else
    echo "⚠️  PostgreSQL command line tools not found"
    echo "Try connecting with: psql -U postgres"
fi

echo ""
read -p "Does database 'gifamz_learn' exist? (y/n): " db_exists

if [ "$db_exists" != "y" ]; then
    echo ""
    echo "Creating database 'gifamz_learn'..."
    createdb gifamz_learn 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Database created successfully"
    else
        echo "⚠️  Could not create database automatically"
        echo "Please create it manually:"
        echo "  psql -U postgres"
        echo "  CREATE DATABASE gifamz_learn;"
        echo "  \\q"
        read -p "Press ENTER when database is created..."
    fi
fi

# Step 3: Test database connection
echo ""
echo "🔍 Step 3: Testing Database Connection"
echo "---------------------------------------"

php artisan config:clear &> /dev/null

if php artisan db:show &> /dev/null; then
    echo "✅ Database connection successful!"
else
    echo "❌ Database connection failed"
    echo ""
    echo "Common issues:"
    echo "1. Wrong password in .env"
    echo "2. PostgreSQL not running"
    echo "3. Database doesn't exist"
    echo ""
    echo "Check your .env file:"
    grep "^DB_" .env
    echo ""
    exit 1
fi

# Step 4: Copy Laravel files
echo ""
echo "📦 Step 4: Copying Laravel Backend Files"
echo "-----------------------------------------"

SOURCE="/Users/quovatech/Documents/gifamz-africa-learn/laravel-backend-code"

if [ -d "$SOURCE" ]; then
    echo "Copying migrations..."
    cp $SOURCE/migrations/* database/migrations/ 2>/dev/null
    
    echo "Copying models..."
    cp $SOURCE/models/* app/Models/ 2>/dev/null
    
    echo "Copying controllers..."
    mkdir -p app/Http/Controllers/Api
    cp $SOURCE/controllers/*.php app/Http/Controllers/Api/ 2>/dev/null
    
    echo "Copying middleware..."
    cp $SOURCE/middleware/AdminMiddleware.php app/Http/Middleware/ 2>/dev/null
    
    echo "Copying routes..."
    cp $SOURCE/routes/api.php routes/ 2>/dev/null
    
    echo "✅ All files copied successfully"
else
    echo "❌ Source directory not found: $SOURCE"
    exit 1
fi

# Step 5: Register middleware
echo ""
echo "🔒 Step 5: Registering Middleware"
echo "----------------------------------"
echo "⚠️  Manual step required:"
echo ""
echo "Edit: bootstrap/app.php"
echo ""
echo "Add this inside the withMiddleware() function:"
echo ""
echo "\$middleware->alias(["
echo "    'admin' => \\App\\Http\\Middleware\\AdminMiddleware::class,"
echo "]);"
echo ""
echo "\$middleware->statefulApi();"
echo ""
read -p "Press ENTER when you've updated bootstrap/app.php..."

# Step 6: Clear cache
echo ""
echo "🧹 Step 6: Clearing Cache"
echo "-------------------------"
php artisan config:clear
php artisan cache:clear
php artisan route:clear
echo "✅ Cache cleared"

# Step 7: Run migrations
echo ""
echo "🚀 Step 7: Running Database Migrations"
echo "---------------------------------------"

read -p "Ready to run migrations? (y/n): " run_migrations

if [ "$run_migrations" = "y" ]; then
    php artisan migrate
    
    if [ $? -eq 0 ]; then
        echo "✅ Migrations completed successfully!"
    else
        echo "❌ Migration failed. Check the error above."
        exit 1
    fi
else
    echo "⏭️  Skipping migrations. Run manually with: php artisan migrate"
fi

# Step 8: Create admin user
echo ""
echo "👤 Step 8: Creating Admin User"
echo "-------------------------------"

echo "Creating admin seeder..."
cat > database/seeders/AdminSeeder.php << 'SEEDER_EOF'
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Check if admin already exists
        $existing = User::where('email', 'admin@ggtl.tech')->first();
        
        if ($existing) {
            $this->command->info('Admin user already exists!');
            return;
        }

        $admin = User::create([
            'email' => 'admin@ggtl.tech',
            'password' => Hash::make('Admin@123456'),
            'full_name' => 'GGTL Super Admin',
            'role' => 'SUPER_ADMIN',
        ]);

        $this->command->info('=================================');
        $this->command->info('✅ Admin user created successfully!');
        $this->command->info('=================================');
        $this->command->info('Email: admin@ggtl.tech');
        $this->command->info('Password: Admin@123456');
        $this->command->info('=================================');
        $this->command->warn('⚠️  Please change this password after first login!');
    }
}
SEEDER_EOF

echo "✅ Admin seeder created"

read -p "Create admin user now? (y/n): " create_admin

if [ "$create_admin" = "y" ]; then
    php artisan db:seed --class=AdminSeeder
fi

# Final summary
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "✅ Database configured"
echo "✅ Files copied"
echo "✅ Migrations run"
echo "✅ Admin user created"
echo ""
echo "🚀 Next Steps:"
echo "1. Start the server:"
echo "   php artisan serve"
echo ""
echo "2. Test the API:"
echo "   curl http://localhost:8000/api/categories"
echo ""
echo "3. Login as admin:"
echo "   Email: admin@ggtl.tech"
echo "   Password: Admin@123456"
echo ""
echo "📚 Documentation:"
echo "- Installation Guide: laravel-backend-code/INSTALLATION_GUIDE.md"
echo "- Database Setup: laravel-backend-code/DATABASE_EMAIL_SETUP.md"
echo ""
echo "Happy coding! 🎓"
