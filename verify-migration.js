// Simple verification script to check if migration worked
const http = require('http');

console.log('🔍 Verifying Mountain Details Integration...\n');

// Test 1: Check if new endpoint exists
console.log('Test 1: Checking new endpoint...');
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/mountains/1/details/what_to_bring',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 404) {
      console.log('❌ Route not found - Backend needs restart!');
      console.log('   Solution: Stop backend (Ctrl+C) and run: cd backend && npm start');
    } else if (res.statusCode === 401 || res.statusCode === 403) {
      console.log('✅ Route exists! (Auth error expected without real token)');
      console.log('   The new endpoints are working.');
    } else {
      console.log(`✅ Route exists! Status: ${res.statusCode}`);
    }
    
    // Test 2: Check mountains endpoint
    console.log('\nTest 2: Checking mountains endpoint...');
    const mountainsReq = http.get('http://localhost:5000/api/mountains', (mountainsRes) => {
      let mountainsData = '';
      mountainsRes.on('data', chunk => mountainsData += chunk);
      mountainsRes.on('end', () => {
        try {
          const json = JSON.parse(mountainsData);
          if (json.mountains && json.mountains.length > 0) {
            console.log('✅ Mountains endpoint working');
            console.log(`   Found ${json.mountains.length} mountains`);
            
            // Check if any mountain has the new JSONB columns
            const sampleMountain = json.mountains[0];
            const hasNewColumns = sampleMountain.what_to_bring !== undefined ||
                                sampleMountain.budgeting !== undefined ||
                                sampleMountain.itinerary !== undefined ||
                                sampleMountain.how_to_get_there !== undefined;
            
            if (hasNewColumns) {
              console.log('✅ Database migration appears successful!');
              console.log('   New JSONB columns detected in mountains table');
            } else {
              console.log('⚠️  Database migration may not be complete');
              console.log('   No JSONB columns found in mountains data');
              console.log('   Make sure to run the migration script in Supabase');
            }
          } else {
            console.log('❌ No mountains found');
          }
        } catch (e) {
          console.log('❌ Error parsing mountains response:', e.message);
        }
      });
    });
    
    mountainsReq.on('error', (e) => {
      console.log('❌ Mountains endpoint error:', e.message);
    });
  });
});

req.on('error', (e) => {
  console.log('❌ Request error:', e.message);
  console.log('   Make sure backend is running on port 5000');
});

req.write(JSON.stringify({ item_name: 'Test Item' }));
req.end();

console.log('\n📋 Next Steps:');
console.log('1. If "Route not found" → Restart backend server');
console.log('2. If "No JSONB columns" → Run migration in Supabase');
console.log('3. If both work → Test the form in browser');
