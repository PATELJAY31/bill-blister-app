const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Supabase connection successful!');
    console.log('🚀 Database is ready for production');
    process.exit(0);
  } catch (error) {
    console.log('❌ Supabase connection failed:');
    console.log('Error:', error.message);
    
    if (error.message.includes("Can't reach database server")) {
      console.log('\n🔧 Possible solutions:');
      console.log('1. Check if your Supabase project is paused');
      console.log('2. Go to https://supabase.com and resume your project');
      console.log('3. Verify the database URL is correct');
      console.log('4. Check your internet connection');
    }
    
    process.exit(1);
  }
}

testConnection();
