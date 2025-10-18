// Test the mountain details API
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAPI() {
  try {
    console.log('🧪 Testing mountain details API...');
    
    // Test creating a mountain detail
    const testData = {
      mountain_id: 4, // Mount Pinatubo
      section_type: 'what_to_bring',
      item_name: 'Test Item',
      item_icon: '🧪',
      sort_order: 1
    };
    
    const response = await fetch('http://localhost:5000/api/mountain-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // You might need a real token
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ API test successful:', result);
    } else {
      console.log('❌ API test failed:', result);
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testAPI();
