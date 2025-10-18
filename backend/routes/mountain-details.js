const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get mountain details by mountain ID
router.get('/mountains/:mountainId/details', async (req, res) => {
  try {
    const { mountainId } = req.params;
    
    const { data: mountainDetails, error } = await supabase
      .from('mountain_details')
      .select('*')
      .eq('mountain_id', mountainId)
      .order('section_type', { ascending: true })
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching mountain details:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch mountain details'
      });
    }

    // Group results by section type
    const grouped = {
      what_to_bring: [],
      budgeting: [],
      itinerary: [],
      how_to_get_there: []
    };

    mountainDetails.forEach(row => {
      if (grouped[row.section_type]) {
        grouped[row.section_type].push(row);
      }
    });

    // If no data found, return sample data for demonstration
    if (mountainDetails.length === 0) {
      const sampleData = {
        what_to_bring: [
          {
            id: 1,
            mountain_id: parseInt(mountainId),
            section_type: 'what_to_bring',
            item_name: 'Hiking Boots',
            item_description: 'Sturdy, waterproof hiking boots with good ankle support',
            item_icon: '🥾',
            sort_order: 1
          },
          {
            id: 2,
            mountain_id: parseInt(mountainId),
            section_type: 'what_to_bring',
            item_name: 'Backpack',
            item_description: '40-50L backpack for multi-day hike',
            item_icon: '🎒',
            sort_order: 2
          },
          {
            id: 3,
            mountain_id: parseInt(mountainId),
            section_type: 'what_to_bring',
            item_name: 'Tent',
            item_description: '3-season tent for camping',
            item_icon: '⛺',
            sort_order: 3
          },
          {
            id: 4,
            mountain_id: parseInt(mountainId),
            section_type: 'what_to_bring',
            item_name: 'Sleeping Bag',
            item_description: 'Cold weather sleeping bag (0°C rating)',
            item_icon: '🛌',
            sort_order: 4
          },
          {
            id: 5,
            mountain_id: parseInt(mountainId),
            section_type: 'what_to_bring',
            item_name: 'Water Bottles',
            item_description: 'At least 3L of water capacity',
            item_icon: '💧',
            sort_order: 5
          },
          {
            id: 6,
            mountain_id: parseInt(mountainId),
            section_type: 'what_to_bring',
            item_name: 'First Aid Kit',
            item_description: 'Complete first aid kit with emergency supplies',
            item_icon: '🏥',
            sort_order: 6
          }
        ],
        budgeting: [
          {
            id: 7,
            mountain_id: parseInt(mountainId),
            section_type: 'budgeting',
            item_name: 'Environmental Fee',
            item_description: 'Required environmental fee',
            item_amount: 500.00,
            item_unit: 'per person',
            sort_order: 1
          },
          {
            id: 8,
            mountain_id: parseInt(mountainId),
            section_type: 'budgeting',
            item_name: 'Guide Fee',
            item_description: 'Mandatory guide service fee',
            item_amount: 2000.00,
            item_unit: 'per group',
            sort_order: 2
          },
          {
            id: 9,
            mountain_id: parseInt(mountainId),
            section_type: 'budgeting',
            item_name: 'Transportation',
            item_description: 'Round trip transportation to trailhead',
            item_amount: 3000.00,
            item_unit: 'per group',
            sort_order: 3
          },
          {
            id: 10,
            mountain_id: parseInt(mountainId),
            section_type: 'budgeting',
            item_name: 'Food & Supplies',
            item_description: '3-day food and cooking supplies',
            item_amount: 1500.00,
            item_unit: 'per person',
            sort_order: 4
          }
        ],
        itinerary: [
          {
            id: 11,
            mountain_id: parseInt(mountainId),
            section_type: 'itinerary',
            item_name: 'Day 1: Arrival & Acclimatization',
            item_description: 'Arrive at base camp, set up tents, short acclimatization hike',
            item_time: '8:00 AM',
            item_duration: 'Full day',
            sort_order: 1
          },
          {
            id: 12,
            mountain_id: parseInt(mountainId),
            section_type: 'itinerary',
            item_name: 'Day 2: Summit Attempt',
            item_description: 'Early morning start for summit attempt, return to base camp',
            item_time: '2:00 AM',
            item_duration: '12-14 hours',
            sort_order: 2
          },
          {
            id: 13,
            mountain_id: parseInt(mountainId),
            section_type: 'itinerary',
            item_name: 'Day 3: Descent & Departure',
            item_description: 'Pack up camp, descend to trailhead, return to city',
            item_time: '6:00 AM',
            item_duration: '6-8 hours',
            sort_order: 3
          }
        ],
        how_to_get_there: [
          {
            id: 14,
            mountain_id: parseInt(mountainId),
            section_type: 'how_to_get_there',
            item_name: 'By Private Vehicle',
            item_description: 'Drive to the area, then to trailhead (3-4 hours from city)',
            item_transport_type: 'private',
            sort_order: 1
          },
          {
            id: 15,
            mountain_id: parseInt(mountainId),
            section_type: 'how_to_get_there',
            item_name: 'By Public Transport',
            item_description: 'Take bus to the area, then jeepney to trailhead',
            item_transport_type: 'public',
            sort_order: 2
          },
          {
            id: 16,
            mountain_id: parseInt(mountainId),
            section_type: 'how_to_get_there',
            item_name: 'Organized Tour',
            item_description: 'Book with local tour operators for complete package including guide and transport',
            item_transport_type: 'tour',
            sort_order: 3
          }
        ]
      };
      
      return res.json({
        success: true,
        data: sampleData
      });
    }

    res.json({
      success: true,
      data: grouped
    });
  } catch (error) {
    console.error('Error fetching mountain details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mountain details'
    });
  }
});

// Get all mountain details (admin only)
router.get('/mountain-details', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.'
      });
    }

    const { data: mountainDetails, error } = await supabase
      .from('mountain_details')
      .select(`
        *,
        mountains!inner(name)
      `)
      .order('mountains(name)', { ascending: true })
      .order('section_type', { ascending: true })
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching all mountain details:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch mountain details'
      });
    }

    res.json({
      success: true,
      data: mountainDetails
    });
  } catch (error) {
    console.error('Error fetching all mountain details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mountain details'
    });
  }
});

// Create mountain detail item (admin only)
router.post('/mountain-details', authenticateToken, async (req, res) => {
  try {
    console.log('POST /mountain-details - User:', req.user);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    if (req.user.role !== 'admin') {
      console.log('Authorization failed - User role:', req.user.role);
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.'
      });
    }

    const {
      mountain_id,
      section_type,
      item_name,
      item_description,
      item_icon,
      item_amount,
      item_unit,
      item_time,
      item_duration,
      item_transport_type,
      sort_order
    } = req.body;

    // Validate required fields
    if (!mountain_id || !section_type || !item_name) {
      console.log('Validation failed - Missing fields:', { mountain_id, section_type, item_name });
      return res.status(400).json({
        success: false,
        error: 'mountain_id, section_type, and item_name are required'
      });
    }

    // Validate section_type
    if (!['what_to_bring', 'budgeting', 'itinerary', 'how_to_get_there'].includes(section_type)) {
      return res.status(400).json({
        success: false,
        error: 'section_type must be one of: "what_to_bring", "budgeting", "itinerary", "how_to_get_there"'
      });
    }

    console.log('Creating mountain detail with data:', {
      mountain_id: parseInt(mountain_id),
      section_type,
      item_name,
      item_description,
      item_icon,
      item_amount,
      item_unit,
      item_time,
      item_duration,
      item_transport_type,
      sort_order: sort_order || 0
    });

    const { data: newDetail, error } = await supabase
      .from('mountain_details')
      .insert({
        mountain_id: parseInt(mountain_id),
        section_type,
        item_name,
        item_description,
        item_icon,
        item_amount,
        item_unit,
        item_time,
        item_duration,
        item_transport_type,
        sort_order: sort_order || 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating mountain detail:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create mountain detail',
        details: error.message
      });
    }

    console.log('Mountain detail created successfully:', newDetail);
    res.status(201).json({
      success: true,
      data: newDetail
    });
  } catch (error) {
    console.error('Error creating mountain detail:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create mountain detail',
      details: error.message
    });
  }
});

// Update mountain detail item (admin only)
router.put('/mountain-details/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.'
      });
    }

    const { id } = req.params;
    const {
      section_type,
      item_name,
      item_description,
      item_icon,
      item_amount,
      item_unit,
      item_time,
      item_duration,
      item_transport_type,
      sort_order
    } = req.body;

    // Validate section_type if provided
    if (section_type && !['what_to_bring', 'budgeting', 'itinerary', 'how_to_get_there'].includes(section_type)) {
      return res.status(400).json({
        success: false,
        error: 'section_type must be one of: "what_to_bring", "budgeting", "itinerary", "how_to_get_there"'
      });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (section_type !== undefined) updateData.section_type = section_type;
    if (item_name !== undefined) updateData.item_name = item_name;
    if (item_description !== undefined) updateData.item_description = item_description;
    if (item_icon !== undefined) updateData.item_icon = item_icon;
    if (item_amount !== undefined) updateData.item_amount = item_amount;
    if (item_unit !== undefined) updateData.item_unit = item_unit;
    if (item_time !== undefined) updateData.item_time = item_time;
    if (item_duration !== undefined) updateData.item_duration = item_duration;
    if (item_transport_type !== undefined) updateData.item_transport_type = item_transport_type;
    if (sort_order !== undefined) updateData.sort_order = sort_order;

    const { data: updatedDetail, error } = await supabase
      .from('mountain_details')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating mountain detail:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update mountain detail'
      });
    }

    if (!updatedDetail) {
      return res.status(404).json({
        success: false,
        error: 'Mountain detail not found'
      });
    }

    res.json({
      success: true,
      data: updatedDetail
    });
  } catch (error) {
    console.error('Error updating mountain detail:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update mountain detail'
    });
  }
});

// Delete mountain detail item (admin only)
router.delete('/mountain-details/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.'
      });
    }

    const { id } = req.params;

    const { data: deletedDetail, error } = await supabase
      .from('mountain_details')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error deleting mountain detail:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete mountain detail'
      });
    }

    if (!deletedDetail) {
      return res.status(404).json({
        success: false,
        error: 'Mountain detail not found'
      });
    }

    res.json({
      success: true,
      message: 'Mountain detail deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting mountain detail:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete mountain detail'
    });
  }
});

// Bulk update mountain details (admin only)
router.put('/mountains/:mountainId/details', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.'
      });
    }

    const { mountainId } = req.params;
    const { what_to_bring, budgeting, itinerary, how_to_get_there } = req.body;

    // Start transaction
    await db.query('BEGIN');

    try {
      // Delete existing details for this mountain
      await db.query('DELETE FROM mountain_details WHERE mountain_id = $1', [mountainId]);

      // Insert new what_to_bring items
      if (what_to_bring && Array.isArray(what_to_bring)) {
        for (let i = 0; i < what_to_bring.length; i++) {
          const item = what_to_bring[i];
          await db.query(`
            INSERT INTO mountain_details (
              mountain_id, section_type, item_name, item_description, 
              item_icon, sort_order
            ) VALUES ($1, 'what_to_bring', $2, $3, $4, $5)
          `, [mountainId, item.item_name, item.item_description, item.item_icon, i + 1]);
        }
      }

      // Insert new budgeting items
      if (budgeting && Array.isArray(budgeting)) {
        for (let i = 0; i < budgeting.length; i++) {
          const item = budgeting[i];
          await db.query(`
            INSERT INTO mountain_details (
              mountain_id, section_type, item_name, item_description, 
              item_amount, item_unit, sort_order
            ) VALUES ($1, 'budgeting', $2, $3, $4, $5, $6)
          `, [mountainId, item.item_name, item.item_description, item.item_amount, item.item_unit, i + 1]);
        }
      }

      // Insert new itinerary items
      if (itinerary && Array.isArray(itinerary)) {
        for (let i = 0; i < itinerary.length; i++) {
          const item = itinerary[i];
          await db.query(`
            INSERT INTO mountain_details (
              mountain_id, section_type, item_name, item_description, 
              item_time, item_duration, sort_order
            ) VALUES ($1, 'itinerary', $2, $3, $4, $5, $6)
          `, [mountainId, item.item_name, item.item_description, item.item_time, item.item_duration, i + 1]);
        }
      }

      // Insert new how_to_get_there items
      if (how_to_get_there && Array.isArray(how_to_get_there)) {
        for (let i = 0; i < how_to_get_there.length; i++) {
          const item = how_to_get_there[i];
          await db.query(`
            INSERT INTO mountain_details (
              mountain_id, section_type, item_name, item_description, 
              item_transport_type, sort_order
            ) VALUES ($1, 'how_to_get_there', $2, $3, $4, $5)
          `, [mountainId, item.item_name, item.item_description, item.item_transport_type, i + 1]);
        }
      }

      await db.query('COMMIT');

      res.json({
        success: true,
        message: 'Mountain details updated successfully'
      });
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error bulk updating mountain details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update mountain details'
    });
  }
});

module.exports = router;
