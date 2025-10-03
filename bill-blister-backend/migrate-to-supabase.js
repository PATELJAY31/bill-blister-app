#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting migration from MySQL to Supabase...\n');

// Step 1: Install Supabase dependencies
console.log('📦 Installing Supabase dependencies...');
try {
  execSync('npm install @supabase/supabase-js pg', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully\n');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Step 2: Create backup of current .env
console.log('💾 Creating backup of current .env file...');
try {
  if (fs.existsSync('.env')) {
    fs.copyFileSync('.env', '.env.mysql.backup');
    console.log('✅ Backup created: .env.mysql.backup\n');
  }
} catch (error) {
  console.error('❌ Error creating backup:', error.message);
}

// Step 3: Create new .env for Supabase
console.log('🔧 Creating new .env file for Supabase...');
const supabaseEnvContent = `# Supabase Database Configuration
# Replace [YOUR-PROJECT-REF] and [YOUR-PASSWORD] with your actual Supabase credentials
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=5000
NODE_ENV="development"

# Supabase Configuration
# Get these from your Supabase project dashboard
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

# Email Configuration (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Redis Configuration (Optional - for caching)
REDIS_URL="redis://localhost:6379"
`;

try {
  fs.writeFileSync('.env', supabaseEnvContent);
  console.log('✅ New .env file created\n');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  process.exit(1);
}

// Step 4: Generate Prisma client for PostgreSQL
console.log('🔄 Generating Prisma client for PostgreSQL...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully\n');
} catch (error) {
  console.error('❌ Error generating Prisma client:', error.message);
  process.exit(1);
}

console.log('🎉 Migration setup completed!\n');
console.log('📋 Next steps:');
console.log('1. Go to https://supabase.com and create a new project');
console.log('2. Get your project credentials from the dashboard');
console.log('3. Update the .env file with your actual Supabase credentials');
console.log('4. Run: npx prisma db push');
console.log('5. Run: npm run db:seed');
console.log('6. Run: npm start');
console.log('\n📖 For detailed instructions, see SUPABASE_SETUP.md');
