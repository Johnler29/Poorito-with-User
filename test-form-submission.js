// Test the actual form submission to see what's happening
const http = require('http');

console.log('🧪 Testing Mountain Detail Form Submission...\n');

// First, let's test if we can get a valid auth token
console.log('Step 1: Testing login...');
const loginData = JSON.stringify({
  email: 'admin@poorito.com',
  password: 'password'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const loginReq = http.request(loginOptions, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (response.token) {
        console.log('✅ Login successful, got token');
        testMountainDetailSubmission(response.token);
      } else {
        console.log('❌ Login failed:', response);
        console.log('   Make sure admin@poorito.com exists with password "password"');
      }
    } catch (e) {
      console.log('❌ Login response error:', e.message);
      console.log('   Response was:', data);
    }
  });
});

loginReq.on('error', (e) => {
  console.log('❌ Login request error:', e.message);
});

loginReq.write(loginData);
loginReq.end();

function testMountainDetailSubmission(token) {
  console.log('\nStep 2: Testing mountain detail submission...');
  
  const detailData = JSON.stringify({
    item_name: 'Test Hiking Boots',
    item_description: 'Waterproof boots for testing',
    item_icon: '🥾'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/mountains/1/details/what_to_bring',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`Response Status: ${res.statusCode}`);
      console.log('Response Body:', data);
      
      if (res.statusCode === 201) {
        console.log('✅ Mountain detail created successfully!');
        console.log('   The form should work now.');
      } else if (res.statusCode === 500) {
        console.log('❌ Server error - likely database issue');
        console.log('   Check if JSONB columns were added properly');
      } else if (res.statusCode === 401 || res.statusCode === 403) {
        console.log('❌ Authentication error');
        console.log('   Token might be invalid or user not admin');
      } else {
        console.log(`❌ Unexpected status: ${res.statusCode}`);
      }
    });
  });

  req.on('error', (e) => {
    console.log('❌ Request error:', e.message);
  });

  req.write(detailData);
  req.end();
}
