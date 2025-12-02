const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create Supabase client (prefer service role key on the server)
const supabaseUrl = process.env.SUPABASE_URL || 'https://ednzkmajmerlvuwptnti.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY 
  || process.env.SUPABASE_ANON_KEY 
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkbnprbWFqbWVybHZ1d3B0bnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDcwNTUsImV4cCI6MjA3NTEyMzA1NX0.LPnXAC8K-dZcERJgmq2Fq42x4EtL_n8920FB0fbbES4';

// Log which key is being used (for debugging)
if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('✅ Using SUPABASE_SERVICE_ROLE_KEY (bypasses RLS)');
} else if (process.env.SUPABASE_ANON_KEY) {
  console.log('⚠️  Using SUPABASE_ANON_KEY (respects RLS policies)');
  console.log('💡 Tip: Set SUPABASE_SERVICE_ROLE_KEY in .env to bypass RLS');
} else {
  console.log('⚠️  Using fallback anon key (respects RLS policies)');
  console.log('💡 Tip: Set SUPABASE_SERVICE_ROLE_KEY in .env to bypass RLS');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
const testConnection = async () => {
  try {
    // Only test if we have real credentials
    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'https://placeholder.supabase.co') {
      console.log('⚠️  Supabase not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
      console.log('📖 See SUPABASE_SETUP.md for setup instructions');
      return;
    }

    // Use a publicly readable table for connectivity test
    const { data, error } = await supabase
      .from('mountains')
      .select('id', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error connecting to Supabase:', error.message);
      return;
    }
    console.log('✅ Connected to Supabase database');
  } catch (err) {
    console.error('Supabase connection error:', err.message);
  }
};

// Test connection on startup
testConnection();

module.exports = supabase;
