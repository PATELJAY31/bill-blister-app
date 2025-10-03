# 🚀 Production Setup Guide

## Option 1: Fix Supabase (Recommended)

### 1. Check Supabase Project Status
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Check if your project `ghybvcpstchruojlqvdc` is paused
4. If paused, click "Resume" to reactivate

### 2. Get Updated Credentials
1. Go to **Settings > Database**
2. Copy the new **Connection string** if it changed
3. Update your `.env` file with the new URL

### 3. Test Connection
```bash
# Test the connection
curl http://localhost:5000/api/health
```

## Option 2: Local PostgreSQL (Alternative)

### 1. Install PostgreSQL
- Download from [postgresql.org](https://www.postgresql.org/download/)
- Install with default settings
- Remember the password you set

### 2. Create Database
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE bill_blister_db;

-- Create user (optional)
CREATE USER billblister WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE bill_blister_db TO billblister;
```

### 3. Update Environment Variables
```env
# Local PostgreSQL
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/bill_blister_db"

# Or with custom user
DATABASE_URL="postgresql://billblister:your_password@localhost:5432/bill_blister_db"
```

### 4. Run Migrations
```bash
npx prisma db push
npm run db:seed
```

## Option 3: Cloud Database (Production Ready)

### 1. Railway (Recommended)
- Go to [railway.app](https://railway.app)
- Create new project
- Add PostgreSQL database
- Get connection string
- Update `.env` file

### 2. PlanetScale (MySQL)
- Go to [planetscale.com](https://planetscale.com)
- Create new database
- Get connection string
- Update Prisma schema to MySQL

### 3. Neon (PostgreSQL)
- Go to [neon.tech](https://neon.tech)
- Create new project
- Get connection string
- Update `.env` file

## Production Deployment

### 1. Environment Variables
```env
# Database
DATABASE_URL="your_production_database_url"

# JWT
JWT_SECRET="your-super-secure-jwt-secret-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="production"

# CORS (Update with your domain)
CORS_ORIGIN="https://yourdomain.com,https://www.yourdomain.com"
```

### 2. Security Checklist
- [ ] Strong JWT secret
- [ ] Secure database credentials
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] Helmet security headers
- [ ] HTTPS enabled

### 3. Deployment Platforms
- **Vercel** (Frontend + Backend)
- **Railway** (Backend)
- **Render** (Backend)
- **DigitalOcean** (Full stack)
- **AWS** (Full stack)

## Quick Fix for Now

If you want to get started immediately:

1. **Resume your Supabase project**
2. **Update the database URL** if needed
3. **Restart the backend**

Or use the mock backend temporarily while setting up production database.
