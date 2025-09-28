#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Bill Blister Backend Setup Script');
console.log('=====================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/bill_blister_db?schema=public"

# JWT Configuration
JWT_SECRET="bill-blister-super-secret-jwt-key-2024"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3001
NODE_ENV="development"

# CORS Configuration
CORS_ORIGIN="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/gif,application/pdf"
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully\n');
} else {
  console.log('✅ .env file already exists\n');
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Generate Prisma client
console.log('🔧 Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully\n');
} catch (error) {
  console.error('❌ Failed to generate Prisma client:', error.message);
  process.exit(1);
}

// Check if PostgreSQL is running
console.log('🐘 Checking PostgreSQL connection...');
try {
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Database schema pushed successfully\n');
} catch (error) {
  console.error('❌ Failed to connect to database:', error.message);
  console.log('\n📋 Database Setup Instructions:');
  console.log('1. Install PostgreSQL (v12 or higher)');
  console.log('2. Create database: createdb bill_blister_db');
  console.log('3. Update DATABASE_URL in .env file');
  console.log('4. Run: npm run db:push');
  console.log('5. Run: npm run db:seed\n');
}

// Seed database
console.log('🌱 Seeding database...');
try {
  execSync('npm run db:seed', { stdio: 'inherit' });
  console.log('✅ Database seeded successfully\n');
} catch (error) {
  console.error('⚠️  Database seeding failed:', error.message);
  console.log('You can run "npm run db:seed" later to seed the database\n');
}

console.log('🎉 Setup completed successfully!');
console.log('\n📋 Next Steps:');
console.log('1. Start the backend: npm run dev');
console.log('2. Start the frontend: cd ../bill-blister-web && npm run dev');
console.log('3. Open http://localhost:3000 in your browser');
console.log('\n🔑 Demo Credentials:');
console.log('Admin: admin@billblister.com / password123');
console.log('Employee: employee@billblister.com / password123');
console.log('Engineer: engineer@billblister.com / password123');
console.log('HO Approver: approver@billblister.com / password123');
console.log('\n📚 API Documentation: http://localhost:3001/api');
console.log('🔍 Database Studio: npm run db:studio');
