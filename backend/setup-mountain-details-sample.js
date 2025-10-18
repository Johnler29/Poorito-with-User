const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupMountainDetailsSample() {
  try {
    console.log('Setting up mountain details sample data...');

    // First, get the mountain IDs
    const { data: mountains, error: mountainsError } = await supabase
      .from('mountains')
      .select('id, name');

    if (mountainsError) {
      console.error('Error fetching mountains:', mountainsError);
      return;
    }

    console.log('Found mountains:', mountains);

    // Sample mountain details data
    const sampleDetails = [
      // Mount Apo details
      {
        mountain_id: mountains[0]?.id,
        section_type: 'what_to_bring',
        item_name: 'Hiking Boots',
        item_description: 'Sturdy, waterproof hiking boots with good ankle support',
        item_icon: '🥾',
        sort_order: 1
      },
      {
        mountain_id: mountains[0]?.id,
        section_type: 'what_to_bring',
        item_name: 'Backpack',
        item_description: '40-50L backpack for multi-day hike',
        item_icon: '🎒',
        sort_order: 2
      },
      {
        mountain_id: mountains[0]?.id,
        section_type: 'what_to_bring',
        item_name: 'Tent',
        item_description: '3-season tent for camping',
        item_icon: '⛺',
        sort_order: 3
      },
      {
        mountain_id: mountains[0]?.id,
        section_type: 'what_to_bring',
        item_name: 'Sleeping Bag',
        item_description: 'Cold weather sleeping bag (0°C rating)',
        item_icon: '🛌',
        sort_order: 4
      },
      {
        mountain_id: mountains[0]?.id,
        section_type: 'what_to_bring',
        item_name: 'Water Bottles',
        item_description: 'At least 3L of water capacity',
        item_icon: '💧',
        sort_order: 5
      },
      {
        mountain_id: mountains[0]?.id,
        section_type: 'what_to_bring',
        item_name: 'First Aid Kit',
        item_description: 'Complete first aid kit with emergency supplies',
        item_icon: '🏥',
        sort_order: 6
      },
      {
        mountain_id: mountains[0]?.id,
        section_type: 'budgeting',
        item_name: 'Environmental Fee',
        item_description: 'Required environmental fee for Mount Apo',
        item_amount: 500.00,
        item_unit: 'per person',
        sort_order: 1
      },
      {
        mountain_id: mountains[0]?.id,
        section_type: 'budgeting',
        item_name: 'Guide Fee',
        item_description: 'Mandatory guide service fee',
        item_amount: 2000.00,
        item_unit: 'per group',
        sort_order: 2
      },
      {
        mountain_id: mountains[0]?.id,
        section_type: 'budgeting',
        item_name: 'Transportation',
        item_description: 'Round trip transportation to trailhead',
        item_amount: 3000.00,
        item_unit: 'per group',
        sort_order: 3
      },
      {
        mountain_id: mountains[0]?.id,
        section_type: 'budgeting',
        item_name: 'Food & Supplies',
        item_description: '3-day food and cooking supplies',
        item_amount: 1500.00,
        item_unit: 'per person',
        sort_order: 4
      },
      {
        mountain_id: mountains[0]?.id,
        section_type: 'itinerary',
        item_name: 'Day 1: Arrival & Acclimatization',
        item_description: 'Arrive at base camp, set up tents, short acclimatization hike',
        item_time: '8:00 AM',
        item_duration: 'Full day',
        sort_order: 1
      },
      {
        mountain_id: mountains[0]?.id,
        section_type: 'itinerary',
        item_name: 'Day 2: Summit Attempt',
        item_description: 'Early morning start for summit attempt, return to base camp',
        item_time: '2:00 AM',
        item_duration: '12-14 hours',
        sort_order: 2
      },
      {
        mountain_id: mountains[0]?.id,
        section_type: 'itinerary',
        item_name: 'Day 3: Descent & Departure',
        item_description: 'Pack up camp, descend to trailhead, return to city',
        item_time: '6:00 AM',
        item_duration: '6-8 hours',
        sort_order: 3
      },
      {
        mountain_id: mountains[0]?.id,
        section_type: 'how_to_get_there',
        item_name: 'By Private Vehicle',
        item_description: 'Drive to Davao City, then to Kapatagan trailhead (3-4 hours from Davao)',
        item_transport_type: 'private',
        sort_order: 1
      },
      {
        mountain_id: mountains[0]?.id,
        section_type: 'how_to_get_there',
        item_name: 'By Public Transport',
        item_description: 'Fly to Davao, take bus to Digos, then jeepney to Kapatagan',
        item_transport_type: 'public',
        sort_order: 2
      },
      {
        mountain_id: mountains[0]?.id,
        section_type: 'how_to_get_there',
        item_name: 'Organized Tour',
        item_description: 'Book with local tour operators for complete package including guide and transport',
        item_transport_type: 'tour',
        sort_order: 3
      }
    ];

    // Insert sample data
    const { data, error } = await supabase
      .from('mountain_details')
      .insert(sampleDetails);

    if (error) {
      console.error('Error inserting mountain details:', error);
      return;
    }

    console.log('Successfully inserted mountain details sample data!');
    console.log('Inserted', sampleDetails.length, 'items');

    // Also add some data for Mount Pulag
    if (mountains[1]) {
      const pulagDetails = [
        {
          mountain_id: mountains[1].id,
          section_type: 'what_to_bring',
          item_name: 'Warm Clothing',
          item_description: 'Layers for cold weather at high altitude',
          item_icon: '🧥',
          sort_order: 1
        },
        {
          mountain_id: mountains[1].id,
          section_type: 'what_to_bring',
          item_name: 'Headlamp',
          item_description: 'For early morning summit hike',
          item_icon: '🔦',
          sort_order: 2
        },
        {
          mountain_id: mountains[1].id,
          section_type: 'budgeting',
          item_name: 'Registration Fee',
          item_description: 'Mount Pulag registration fee',
          item_amount: 200.00,
          item_unit: 'per person',
          sort_order: 1
        },
        {
          mountain_id: mountains[1].id,
          section_type: 'budgeting',
          item_name: 'Guide Fee',
          item_description: 'Required guide service',
          item_amount: 800.00,
          item_unit: 'per group',
          sort_order: 2
        },
        {
          mountain_id: mountains[1].id,
          section_type: 'itinerary',
          item_name: 'Day 1: Arrival',
          item_description: 'Arrive at Ambangeg Ranger Station, register, camp overnight',
          item_time: '2:00 PM',
          item_duration: 'Afternoon',
          sort_order: 1
        },
        {
          mountain_id: mountains[1].id,
          section_type: 'itinerary',
          item_name: 'Day 2: Summit',
          item_description: 'Early morning hike to summit for sunrise, return to camp',
          item_time: '3:00 AM',
          item_duration: '6-8 hours',
          sort_order: 2
        },
        {
          mountain_id: mountains[1].id,
          section_type: 'how_to_get_there',
          item_name: 'From Baguio',
          item_description: 'Take bus from Baguio to Kabayan, then jeepney to Ambangeg',
          item_transport_type: 'public',
          sort_order: 1
        }
      ];

      const { error: pulagError } = await supabase
        .from('mountain_details')
        .insert(pulagDetails);

      if (pulagError) {
        console.error('Error inserting Mount Pulag details:', pulagError);
      } else {
        console.log('Successfully inserted Mount Pulag details!');
      }
    }

  } catch (error) {
    console.error('Error setting up mountain details:', error);
  }
}

setupMountainDetailsSample();
