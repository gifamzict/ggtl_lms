#!/bin/bash

# GGTL Laravel Backend Installation Script
# Run this from the gifamz-africa-learn directory

echo "🚀 Starting Laravel Backend Installation..."

# Define paths
LARAVEL_PROJECT="/Users/quovatech/Documents/gifamz-africa-learn-api"
SOURCE_DIR="/Users/quovatech/Documents/gifamz-africa-learn/laravel-backend-code"

# Check if Laravel project exists
if [ ! -d "$LARAVEL_PROJECT" ]; then
    echo "❌ Laravel project not found at $LARAVEL_PROJECT"
    exit 1
fi

echo "📁 Laravel project found!"

# Copy migration files
echo "📋 Copying migration files..."
cp $SOURCE_DIR/migrations/* $LARAVEL_PROJECT/database/migrations/

# Copy model files
echo "📦 Copying model files..."
cp $SOURCE_DIR/models/* $LARAVEL_PROJECT/app/Models/

# Create Controllers directory if it doesn't exist
echo "🎮 Creating Controllers directory..."
mkdir -p $LARAVEL_PROJECT/app/Http/Controllers/Api

# Copy controller files
echo "📝 Copying controller files..."
cp $SOURCE_DIR/controllers/*.php $LARAVEL_PROJECT/app/Http/Controllers/Api/

# Copy middleware
echo "🔒 Copying middleware..."
cp $SOURCE_DIR/middleware/AdminMiddleware.php $LARAVEL_PROJECT/app/Http/Middleware/

# Copy routes
echo "🛣️  Copying API routes..."
cp $SOURCE_DIR/routes/api.php $LARAVEL_PROJECT/routes/

echo ""
echo "✅ All files copied successfully!"
echo ""
echo "📝 Next steps:"
echo "1. cd $LARAVEL_PROJECT"
echo "2. Configure your .env file with database credentials"
echo "3. php artisan migrate"
echo "4. php artisan db:seed --class=AdminSeeder (create admin user)"
echo "5. php artisan serve"
echo ""
echo "📚 Full documentation: laravel-backend-code/INSTALLATION_GUIDE.md"
