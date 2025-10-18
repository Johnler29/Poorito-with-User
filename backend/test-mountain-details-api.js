const fetch = require('node-fetch').default;

async function testMountainDetailsAPI() {
  try {
    console.log('Testing Mountain Details API...');
    
    // Test getting mountain details for a specific mountain
    const response = await fetch('http://localhost:5000/api/mountains/4/details');
    const data = await response.json();
    
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✓ API is working correctly');
      console.log('What to Bring items:', data.data.what_to_bring.length);
      console.log('Budgeting items:', data.data.budgeting.length);
      console.log('Itinerary items:', data.data.itinerary.length);
      console.log('How to get there items:', data.data.how_to_get_there.length);
    } else {
      console.log('✗ API returned error:', data.error);
    }
    
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testMountainDetailsAPI();
