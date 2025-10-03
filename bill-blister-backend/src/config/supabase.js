const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials not found. File uploads will be disabled.');
  module.exports = null;
} else {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('✅ Supabase client initialized successfully');
  
  module.exports = supabase;
}
