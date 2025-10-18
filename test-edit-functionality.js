// Test the edit functionality
const http = require('http');

console.log('🧪 Testing Mountain Detail Edit Functionality...\n');

// First login
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
        testEditFlow(29, response.token); // Mount Apo
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

function testEditFlow(mountainId, token) {
  console.log(`\nStep 1: Adding a test item to Mountain ID ${mountainId}...`);
  
  // First, add an item
  const addData = JSON.stringify({
    item_name: 'Test Boots for Editing',
    item_description: 'Original description',
    item_icon: '🥾'
  });

  const addOptions = {
    hostname: 'localhost',
    port: 5000,
    path: `/api/mountains/${mountainId}/details/what_to_bring`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  const addReq = http.request(addOptions, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`Add Response Status: ${res.statusCode}`);
      console.log('Add Response Body:', data);
      
      if (res.statusCode === 201) {
        console.log('✅ Item added successfully!');
        
        try {
          const response = JSON.parse(data);
          const itemId = response.data.id;
          console.log(`Item ID: ${itemId}`);
          
          // Now try to edit it
          console.log('\nStep 2: Editing the item...');
          testEditItem(mountainId, itemId, token);
        } catch (e) {
          console.log('❌ Error parsing add response:', e.message);
        }
      } else {
        console.log('❌ Failed to add item');
        console.log('   This means the database columns are missing');
        console.log('   You need to run the ALTER TABLE commands in Supabase');
      }
    });
  });

  addReq.on('error', (e) => {
    console.log('❌ Add request error:', e.message);
  });

  addReq.write(addData);
  addReq.end();
}

function testEditItem(mountainId, itemId, token) {
  const editData = JSON.stringify({
    item_name: 'Updated Boots Name',
    item_description: 'Updated description',
    item_icon: '👢'
  });

  const editOptions = {
    hostname: 'localhost',
    port: 5000,
    path: `/api/mountains/${mountainId}/details/what_to_bring/${itemId}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  const editReq = http.request(editOptions, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`Edit Response Status: ${res.statusCode}`);
      console.log('Edit Response Body:', data);
      
      if (res.statusCode === 200) {
        console.log('✅ Item edited successfully!');
        console.log('   The edit functionality is working.');
      } else {
        console.log('❌ Failed to edit item');
        console.log('   Response:', data);
      }
    });
  });

  editReq.on('error', (e) => {
    console.log('❌ Edit request error:', e.message);
  });

  editReq.write(editData);
  editReq.end();
}
