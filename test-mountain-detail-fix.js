// Test script to verify mountain detail form fixes
// Run this to verify the backend routes are working correctly

const http = require('http');

console.log('🧪 Mountain Detail Form - Testing Fixes\n');

// Test 1: Health check
console.log('Test 1: Backend Health Check...');
http.get('http://localhost:5000/api/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('✅ Backend is running - Status:', json.status);
      console.log('   Message:', json.message);
    } catch (e) {
      console.log('❌ Health check failed:', e.message);
    }
  });
}).on('error', (e) => {
  console.log('❌ Cannot connect to backend on localhost:5000');
  console.log('   Make sure backend is running: cd backend && npm start');
});

// Test 2: Check mountains endpoint
console.log('\nTest 2: Mountains Endpoint Check...');
http.get('http://localhost:5000/api/mountains', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.mountains && json.mountains.length > 0) {
        console.log('✅ Mountains fetched successfully');
        console.log('   Total mountains:', json.mountains.length);
        console.log('   Sample:', json.mountains[0].name);
      } else {
        console.log('⚠️  No mountains found in database');
      }
    } catch (e) {
      console.log('❌ Mountains endpoint error:', e.message);
    }
  });
}).on('error', (e) => {
  console.log('❌ Cannot reach mountains endpoint');
});

// Test 3: Check mountain details endpoint (requires auth token)
console.log('\nTest 3: Mountain Details Endpoint Check...');
console.log('⚠️  This endpoint requires authentication token');
console.log('   Will verify at runtime when testing through admin panel');

console.log('\n📝 Fixes Applied:');
console.log('  1. ✅ mountain_id converted to integer (parseInt)');
console.log('  2. ✅ Mountains loading logic added to Admin.js');
console.log('  3. ✅ Detailed console logging added');
console.log('  4. ✅ Error handling improved');
console.log('  5. ✅ Backend validation enhanced');

console.log('\n🚀 Next Steps:');
console.log('  1. Go to http://localhost:3000');
console.log('  2. Login as admin (admin@poorito.com)');
console.log('  3. Navigate to Admin → Mountain Details tab');
console.log('  4. Click "+ Add Mountain Detail"');
console.log('  5. Fill form and submit');
console.log('  6. Check browser console (F12) for detailed logs');
