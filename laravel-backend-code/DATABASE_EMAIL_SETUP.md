# Database & Email Configuration Guide

## Step 1: Create PostgreSQL Database

### Option A: Using Command Line (Recommended)

```bash
# Open terminal and run:
createdb gifamz_learn

# Verify it was created:
psql -l | grep gifamz_learn
```

### Option B: Using psql Interactive Shell

```bash
# Open PostgreSQL shell
psql -U postgres

# Create database
CREATE DATABASE gifamz_learn;

# Verify
\l

# Exit
\q
```

### Option C: Using a GUI Tool (pgAdmin, DBeaver, etc.)
1. Open your PostgreSQL GUI tool
2. Right-click on "Databases"
3. Select "Create" → "Database"
4. Name: `gifamz_learn`
5. Owner: `postgres` (or your username)
6. Click "Save"

---

## Step 2: Update .env File

### Quick Update Command

Run this command to update your .env file automatically:

```bash
cd /Users/quovatech/Documents/gifamz-africa-learn-api

# Backup original .env
cp .env .env.backup

# Copy the template
cp /Users/quovatech/Documents/gifamz-africa-learn/laravel-backend-code/.env.example .env.new
```

Then manually edit `.env` with these critical changes:

### Required Database Changes

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=gifamz_learn
DB_USERNAME=postgres          # Change to your PostgreSQL username
DB_PASSWORD=your_password     # Change to your PostgreSQL password
```

### Find Your PostgreSQL Credentials

#### If you don't know your PostgreSQL password:

**On macOS (Homebrew):**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Try connecting without password (if configured for trust)
psql -U postgres

# If that doesn't work, you may need to reset the password
# Instructions: https://stackoverflow.com/questions/12720967/how-to-change-postgresql-user-password
```

**Common default credentials:**
- Username: `postgres`
- Password: `postgres` or empty or your macOS user password

---

## Step 3: Configure Email (Choose ONE Option)

### 🟢 Option 1: Gmail SMTP (Easiest for Development)

#### Steps:
1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "GGTL Laravel API"
   - Copy the 16-character password

3. **Update .env**:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=youremail@gmail.com
MAIL_PASSWORD=your-16-char-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@ggtl.tech
MAIL_FROM_NAME="GGTL Learning Platform"
```

---

### 🟡 Option 2: Mailtrap (Testing Only - Recommended for Dev)

**Best for:** Testing emails without sending real emails

#### Steps:
1. Sign up at https://mailtrap.io (FREE)
2. Go to "Email Testing" → "Inboxes" → "My Inbox"
3. Click "Show Credentials"
4. Copy Username and Password

**Update .env**:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@ggtl.tech
MAIL_FROM_NAME="GGTL Learning Platform"
```

**Benefits:**
- ✅ All emails are caught (won't send to real users)
- ✅ Preview emails in browser
- ✅ Test HTML rendering
- ✅ FREE

---

### 🔵 Option 3: SendGrid (Production - Recommended)

**Best for:** Production use (reliable delivery)

#### Steps:
1. Sign up at https://sendgrid.com (FREE tier: 100 emails/day)
2. Create an API Key:
   - Settings → API Keys → Create API Key
   - Name: "GGTL API"
   - Full Access
3. Verify your sender email:
   - Settings → Sender Authentication
   - Verify single sender OR set up domain authentication

**Update .env**:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key-here
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@ggtl.tech
MAIL_FROM_NAME="GGTL Learning Platform"
```

---

### 🟣 Option 4: Mailgun (Production Alternative)

**Update .env**:
```env
MAIL_MAILER=mailgun
MAILGUN_DOMAIN=your-domain.mailgun.org
MAILGUN_SECRET=your-mailgun-api-key
MAILGUN_ENDPOINT=api.mailgun.net
MAIL_FROM_ADDRESS=noreply@ggtl.tech
MAIL_FROM_NAME="GGTL Learning Platform"
```

---

## Step 4: Update Sanctum & Session Settings

Add these to your `.env`:

```env
FRONTEND_URL=http://localhost:8080
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:8080,127.0.0.1,www.ggtl.tech,ggtl.tech
SESSION_DRIVER=cookie
SESSION_DOMAIN=localhost
```

---

## Step 5: Apply Configuration

```bash
cd /Users/quovatech/Documents/gifamz-africa-learn-api

# Clear all cached config
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Test database connection
php artisan migrate:status

# If the above works, run migrations
php artisan migrate
```

---

## Step 6: Test Email Configuration

Create a test command:

```bash
php artisan tinker
```

Then run:

```php
Mail::raw('Test email from GGTL API', function($msg) {
    $msg->to('your-test-email@example.com')
        ->subject('GGTL Test Email');
});

// Check output - should say "Sent successfully"
```

---

## Complete .env Example (Ready to Copy)

```env
APP_NAME="GGTL API"
APP_ENV=local
APP_KEY=base64:PeovfX19R1pI35PFNL22ZIghdq4CTI3OTdmxe+p3YAI=
APP_DEBUG=true
APP_URL=http://localhost:8000

# PostgreSQL Database
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=gifamz_learn
DB_USERNAME=postgres
DB_PASSWORD=your_password_here

# Frontend & CORS
FRONTEND_URL=http://localhost:8080
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:8080,127.0.0.1,www.ggtl.tech

# Session
SESSION_DRIVER=cookie
SESSION_LIFETIME=120
SESSION_DOMAIN=localhost

# Email (Gmail Example)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=youremail@gmail.com
MAIL_PASSWORD=your-gmail-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@ggtl.tech
MAIL_FROM_NAME="GGTL Learning Platform"

# Other settings (keep defaults)
BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
CACHE_STORE=database
LOG_CHANNEL=stack
```

---

## Troubleshooting

### "SQLSTATE[08006] Connection refused"
- PostgreSQL is not running
- Run: `brew services start postgresql@14` (macOS)
- Or check with: `pg_isready`

### "SQLSTATE[08006] Authentication failed"
- Wrong password in .env
- Try connecting manually: `psql -U postgres -d gifamz_learn`

### "Database does not exist"
- Run: `createdb gifamz_learn`

### "Connection to smtp.gmail.com:587 Timed Out"
- Gmail might be blocking Less Secure Apps
- Use App Password (see Gmail setup above)
- Check firewall settings

### "Laravel config cached"
- Run: `php artisan config:clear`
- Always run this after editing .env

---

## Quick Commands Reference

```bash
# Create database
createdb gifamz_learn

# Check PostgreSQL is running
pg_isready

# Test database connection
psql -U postgres -d gifamz_learn

# Clear Laravel cache
php artisan config:clear && php artisan cache:clear

# Run migrations
php artisan migrate

# Check migration status
php artisan migrate:status

# Test email
php artisan tinker
>>> Mail::raw('Test', fn($m) => $m->to('test@test.com')->subject('Test'));
```

---

## Next Steps After Configuration

1. ✅ Configure PostgreSQL credentials
2. ✅ Configure email settings
3. ✅ Run `php artisan config:clear`
4. ✅ Run `php artisan migrate`
5. ✅ Create admin user (seeder)
6. ✅ Test API endpoints

---

Need help? Check:
- Laravel Logs: `storage/logs/laravel.log`
- PostgreSQL Logs: Check console output
- Email Logs: Check Mailtrap inbox or Laravel logs
