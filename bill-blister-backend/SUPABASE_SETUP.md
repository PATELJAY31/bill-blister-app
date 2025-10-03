# 🚀 Supabase Migration Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name:** `bill-blister-app`
   - **Database Password:** Choose a strong password
   - **Region:** Choose closest to your location

## Step 2: Get Your Supabase Credentials

After creating the project, go to **Settings > API** and copy:

- **Project URL:** `https://[YOUR-PROJECT-REF].supabase.co`
- **Anon Key:** `[YOUR-ANON-KEY]`
- **Service Role Key:** `[YOUR-SERVICE-ROLE-KEY]`

## Step 3: Update Environment Variables

Replace your `.env` file with:

```env
# Supabase Database Configuration
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=5000
NODE_ENV="development"

# Supabase Configuration
SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"

# CORS Configuration
CORS_ORIGIN="http://localhost:3000,http://localhost:5173"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/gif,application/pdf"
```

## Step 4: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

## Step 5: Run Database Migration

```bash
# Generate Prisma client for PostgreSQL
npx prisma generate

# Push schema to Supabase
npx prisma db push

# Seed the database
npm run db:seed
```

## Step 6: Start the Backend

```bash
npm start
```

## Benefits of Using Supabase

### 🗄️ **Database Features**
- **PostgreSQL** - More powerful than MySQL
- **Real-time subscriptions** - Live data updates
- **Row Level Security** - Built-in security policies
- **Full-text search** - Advanced search capabilities

### 🔐 **Authentication Features**
- **Built-in JWT** - No need for custom auth
- **Social logins** - Google, GitHub, etc.
- **Email verification** - Built-in email system
- **Password reset** - Automatic password reset flow

### 📁 **File Storage**
- **Built-in storage** - No need for Firebase
- **CDN delivery** - Fast file serving
- **Image transformations** - Automatic resizing
- **Access control** - Secure file access

### 🚀 **Additional Features**
- **Auto-generated APIs** - REST and GraphQL
- **Dashboard** - Web interface for data
- **Edge Functions** - Serverless functions
- **Webhooks** - Real-time notifications

## Migration Commands

```bash
# 1. Stop current backend
# 2. Update .env file with Supabase credentials
# 3. Install Supabase client
npm install @supabase/supabase-js

# 4. Generate new Prisma client
npx prisma generate

# 5. Push schema to Supabase
npx prisma db push

# 6. Seed database
npm run db:seed

# 7. Start backend
npm start
```

## Supabase Dashboard

After migration, you can:
- View your data at `https://supabase.com/dashboard/project/[YOUR-PROJECT-REF]`
- Use the SQL editor to run queries
- Monitor API usage and performance
- Manage users and authentication
- Upload and manage files

## Next Steps

1. **Create Supabase project**
2. **Update environment variables**
3. **Run migration commands**
4. **Test the application**
5. **Enjoy the benefits of Supabase!**
