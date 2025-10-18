// Test with a valid mountain ID
const http = require('http');

console.log('🧪 Testing with valid mountain ID...\n');

// Login first
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
        console.log('✅ Login successful');
        testWithMountainId(29, response.token); // Mount Apo
      } else {
        console.log('❌ Login failed:', response);
      }
    } catch (e) {
      console.log('❌ Login error:', e.message);
    }
  });
});

loginReq.on('error', (e) => {
  console.log('❌ Login request error:', e.message);
});

loginReq.write(loginData);
loginReq.end();

function testWithMountainId(mountainId, token) {
  console.log(`\nTesting with Mountain ID: ${mountainId} (Mount Apo)`);
  
  const detailData = JSON.stringify({
    item_name: 'Test Hiking Boots',
    item_description: 'Waterproof boots for testing',
    item_icon: '🥾'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: `/api/mountains/${mountainId}/details/what_to_bring`,
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
        console.log('✅ SUCCESS! Mountain detail created!');
        console.log('   The form should work now in the browser.');
        
        // Let's also check if we can retrieve the details
        console.log('\nChecking if we can retrieve the details...');
        checkMountainDetails(mountainId);
      } else if (res.statusCode === 500) {
        console.log('❌ Server error - likely database schema issue');
        console.log('   The JSONB columns might not exist yet');
      } else {
        console.log(`❌ Unexpected status: ${res.statusCode}`);
        console.log('   Response:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.log('❌ Request error:', e.message);
  });

  req.write(detailData);
  req.end();
}

function checkMountainDetails(mountainId) {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: `/api/mountains/${mountainId}/details`,
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('Mountain details response:', JSON.stringify(response, null, 2));
        
        if (response.data && response.data.what_to_bring) {
          console.log(`✅ Found ${response.data.what_to_bring.length} items in what_to_bring`);
        } else {
          console.log('⚠️  No what_to_bring data found');
        }
      } catch (e) {
        console.log('❌ Error parsing details response:', e.message);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.log('❌ Details request error:', e.message);
  });

  req.end();
}
