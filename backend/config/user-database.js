const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create user-scoped Supabase client for authenticated requests
const supabaseUrl = process.env.SUPABASE_URL || 'https://ednzkmajmerlvuwptnti.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY 
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkbnprbWFqbWVybHZ1d3B0bnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDcwNTUsImV4cCI6MjA3NTEyMzA1NX0.LPnXAC8K-dZcERJgmq2Fq42x4EtL_n8920FB0fbbES4';

// Function to create a user-scoped Supabase client
const createUserClient = (userToken) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  });
};

module.exports = {
  createUserClient,
  supabaseUrl,
  supabaseAnonKey
};
