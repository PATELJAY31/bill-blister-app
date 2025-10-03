#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Bill Blister for Production...\n');

// Production environment template
const productionEnv = `# Production Environment Variables
# Update these values for your production deployment

# Database Configuration (Choose one)
# Supabase
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"

# Railway (Recommended for production)
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@containers-us-west-XXX.railway.app:XXXX/railway"

# Neon (PostgreSQL cloud)
# DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb"

# JWT Configuration (CHANGE THIS IN PRODUCTION!)
JWT_SECRET="your-super-secure-jwt-secret-key-change-this-in-production-${Date.now()}"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=5000
NODE_ENV="production"

# CORS Configuration (Update with your production domain)
CORS_ORIGIN="https://yourdomain.com,https://www.yourdomain.com"

# Rate Limiting (Production settings)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/gif,application/pdf"

# Email Configuration (Optional - for production notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Redis Configuration (Optional - for caching in production)
REDIS_URL="redis://localhost:6379"
`;

// Create production .env file
fs.writeFileSync('.env.production', productionEnv);

console.log('✅ Created .env.production file');
console.log('📋 Next steps:');
console.log('');
console.log('1. Choose your database provider:');
console.log('   - Supabase: Resume your project at https://supabase.com');
console.log('   - Railway: Create project at https://railway.app');
console.log('   - Neon: Create project at https://neon.tech');
console.log('');
console.log('2. Update .env.production with your database URL');
console.log('');
console.log('3. Copy .env.production to .env:');
console.log('   copy .env.production .env');
console.log('');
console.log('4. Run database migrations:');
console.log('   npx prisma db push');
console.log('   npm run db:seed');
console.log('');
console.log('5. Start the production server:');
console.log('   npm start');
console.log('');
console.log('🎯 For deployment, consider:');
console.log('   - Vercel (Frontend + Backend)');
console.log('   - Railway (Backend)');
console.log('   - Render (Backend)');
console.log('   - DigitalOcean (Full stack)');
console.log('');
console.log('📖 See PRODUCTION_SETUP.md for detailed instructions');
