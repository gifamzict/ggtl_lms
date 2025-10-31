# 🔧 Quick Setup Guide - .env Configuration

## ⚡ Fastest Way to Get Started

### Option 1: Automated Setup (Recommended)

Run this single command to set up everything:

```bash
cd /Users/quovatech/Documents/gifamz-africa-learn
./laravel-backend-code/setup.sh
```

This script will:
1. ✅ Configure .env file for PostgreSQL
2. ✅ Create database
3. ✅ Copy all Laravel files
4. ✅ Run migrations
5. ✅ Create admin user
6. ✅ Test everything

---

### Option 2: Manual Setup (If you prefer control)

#### Step 1: Apply New .env Configuration

```bash
cd /Users/quovatech/Documents/gifamz-africa-learn-api

# Backup current .env
cp .env .env.backup

# Apply new configuration
mv .env.new .env

# Open in editor
nano .env
```

#### Step 2: Edit These Lines in .env

**Required - PostgreSQL Password:**
```env
DB_PASSWORD=your_postgres_password_here
```

**Optional - Email Configuration:**

Uncomment ONE of these options:

**For Gmail (Production):**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=youremail@gmail.com
MAIL_PASSWORD=your-gmail-app-password
MAIL_ENCRYPTION=tls
```

**For Mailtrap (Testing - Easiest):**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
```

**Or Keep Default (Logs emails to file):**
```env
MAIL_MAILER=log
```

#### Step 3: Create PostgreSQL Database

```bash
createdb gifamz_learn
```

#### Step 4: Test Database Connection

```bash
cd /Users/quovatech/Documents/gifamz-africa-learn-api
php artisan config:clear
php artisan db:show
```

If successful, you'll see database details!

#### Step 5: Copy Backend Files

```bash
./laravel-backend-code/install.sh
```

#### Step 6: Run Migrations

```bash
cd /Users/quovatech/Documents/gifamz-africa-learn-api
php artisan migrate
```

#### Step 7: Create Admin User

Run the setup script or create seeder manually (see DATABASE_EMAIL_SETUP.md)

---

## 📝 Your Current .env.new File

I've created a new `.env.new` file in your Laravel project with:
- ✅ PostgreSQL configuration
- ✅ Sanctum settings for SPA authentication
- ✅ Frontend URL for CORS
- ✅ Email configuration templates
- ✅ All required settings

**Location:** `/Users/quovatech/Documents/gifamz-africa-learn-api/.env.new`

---

## 🔍 Finding Your PostgreSQL Password

### Try these common options:

1. **No password (trust authentication):**
   ```bash
   psql -U postgres
   ```
   If this works, leave `DB_PASSWORD=` empty in .env

2. **Password is 'postgres':**
   ```env
   DB_PASSWORD=postgres
   ```

3. **Your macOS username:**
   ```env
   DB_PASSWORD=quovatech
   ```

4. **Reset PostgreSQL password:**
   ```bash
   psql -U postgres
   ALTER USER postgres PASSWORD 'newpassword';
   \q
   ```

---

## 🎯 Quick Test Commands

### Test PostgreSQL Connection
```bash
psql -U postgres -d gifamz_learn -c "SELECT version();"
```

### Test Laravel Database
```bash
cd /Users/quovatech/Documents/gifamz-africa-learn-api
php artisan db:show
```

### View Current .env Database Settings
```bash
cd /Users/quovatech/Documents/gifamz-africa-learn-api
grep "^DB_" .env
```

---

## 📧 Email Setup Options Comparison

| Option | Best For | Difficulty | Free Tier |
|--------|----------|------------|-----------|
| **Log** (default) | Development | ⭐ Easiest | Unlimited |
| **Mailtrap** | Testing emails | ⭐⭐ Easy | 500/month |
| **Gmail SMTP** | Small production | ⭐⭐⭐ Medium | 500/day |
| **SendGrid** | Production | ⭐⭐⭐⭐ Advanced | 100/day |

### Recommendation:
- **Development:** Use `log` (default) or Mailtrap
- **Production:** Use SendGrid or Gmail

---

## 🚨 Common Issues & Solutions

### Issue: "SQLSTATE[08006] Connection refused"
**Solution:** PostgreSQL not running
```bash
brew services start postgresql@14
# or
brew services start postgresql
```

### Issue: "SQLSTATE[08006] Authentication failed"
**Solution:** Wrong password in .env
- Try empty password
- Try 'postgres'
- Reset password (see above)

### Issue: "Database does not exist"
**Solution:**
```bash
createdb gifamz_learn
```

### Issue: "Laravel config is cached"
**Solution:**
```bash
php artisan config:clear
php artisan cache:clear
```

### Issue: Can't see .env file in Finder
**Solution:**
.env files are hidden. Use terminal:
```bash
cd /Users/quovatech/Documents/gifamz-africa-learn-api
open -a TextEdit .env
```

Or use VS Code:
```bash
code .env
```

---

## ✅ Checklist Before Running Setup

- [ ] PostgreSQL is installed and running
- [ ] You know your PostgreSQL password (or it has no password)
- [ ] Database `gifamz_learn` exists (or will be created)
- [ ] You have email credentials (or will use 'log' driver)
- [ ] .env.new file exists in Laravel project

---

## 🎬 Ready to Start?

### Automated Setup (Easiest):
```bash
cd /Users/quovatech/Documents/gifamz-africa-learn
./laravel-backend-code/setup.sh
```

### Manual Setup:
1. Apply .env: `mv .env.new .env`
2. Edit .env: `nano .env` (add password)
3. Create DB: `createdb gifamz_learn`
4. Run install: `./laravel-backend-code/install.sh`
5. Migrate: `php artisan migrate`
6. Seed admin: `php artisan db:seed --class=AdminSeeder`
7. Start: `php artisan serve`

---

## 📞 Need Help?

1. **Check logs:** `storage/logs/laravel.log`
2. **Test PostgreSQL:** `pg_isready`
3. **Read detailed guide:** `DATABASE_EMAIL_SETUP.md`
4. **Installation guide:** `INSTALLATION_GUIDE.md`

---

**The .env file is located at:**
`/Users/quovatech/Documents/gifamz-africa-learn-api/.env`

**You can edit it with:**
```bash
cd /Users/quovatech/Documents/gifamz-africa-learn-api
nano .env
# or
open -a TextEdit .env
# or
code .env
```

Good luck! 🚀
