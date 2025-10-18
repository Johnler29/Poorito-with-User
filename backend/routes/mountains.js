const express = require('express');
const supabase = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all mountains (public)
router.get('/', async (req, res) => {
  try {
    const { data: mountains, error } = await supabase
      .from('mountains')
      .select('id, name, elevation, location, difficulty, description, image_url, created_at, updated_at')
      .order('name', { ascending: true });

    if (error) {
      console.error('Get mountains error:', error);
      // Development fallback so UI stays usable without DB setup
      if (process.env.NODE_ENV !== 'production') {
        return res.json({ mountains: [
          { id: 1, name: 'Mount Apo', elevation: 2954, location: 'Davao del Sur', difficulty: 'Hard', description: 'The highest peak in the Philippines', image_url: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 2, name: 'Mount Pulag', elevation: 2922, location: 'Benguet', difficulty: 'Moderate', description: 'Famous for its sea of clouds', image_url: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        ]});
      }
      return res.status(500).json({ 
        error: 'Failed to fetch mountains',
        details: process.env.NODE_ENV !== 'production' ? error.message : undefined
      });
    }

    res.json({ mountains: mountains || [] });
  } catch (error) {
    console.error('Get mountains error:', error);
    if (process.env.NODE_ENV !== 'production') {
      return res.json({ mountains: [
        { id: 1, name: 'Mount Apo', elevation: 2954, location: 'Davao del Sur', difficulty: 'Hard', description: 'The highest peak in the Philippines', image_url: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 2, name: 'Mount Pulag', elevation: 2922, location: 'Benguet', difficulty: 'Moderate', description: 'Famous for its sea of clouds', image_url: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ]});
    }
    res.status(500).json({ error: 'Failed to fetch mountains' });
  }
});

// Get single mountain
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: mountain, error } = await supabase
      .from('mountains')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Get mountain error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch mountain',
        details: process.env.NODE_ENV !== 'production' ? error.message : undefined
      });
    }

    if (!mountain) {
      return res.status(404).json({ error: 'Mountain not found' });
    }

    res.json({ mountain });
  } catch (error) {
    console.error('Get mountain error:', error);
    res.status(500).json({ error: 'Failed to fetch mountain' });
  }
});

// Create mountain (admin only) - temporarily without auth for testing
router.post('/', async (req, res) => {
  try {
    const { name, elevation, location, difficulty, description, image_url } = req.body;
    
    // Debug: Log received data
    console.log('Received mountain data:', {
      name,
      elevation,
      location,
      difficulty,
      description,
      image_url: image_url ? `${image_url.substring(0, 50)}...` : 'No image'
    });

    if (!name || !elevation || !location || !difficulty) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: newMountain, error } = await supabase
      .from('mountains')
      .insert([{
        name,
        elevation,
        location,
        difficulty,
        description,
        image_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Create mountain error:', error);
      return res.status(500).json({ 
        error: 'Failed to create mountain',
        details: process.env.NODE_ENV !== 'production' ? error.message : undefined
      });
    }

    res.status(201).json({
      message: 'Mountain created successfully',
      mountain: newMountain
    });
  } catch (error) {
    console.error('Create mountain error:', error);
    res.status(500).json({ error: 'Failed to create mountain' });
  }
});

// Update mountain (admin only) - temporarily without auth for testing
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      elevation, 
      location, 
      difficulty, 
      description, 
      image_url,
      what_to_bring,
      budgeting,
      itinerary,
      how_to_get_there
    } = req.body;

    console.log('Attempting to update mountain:', id, { name, elevation, location });

    // Build update object with only provided fields
    const updateData = {
      name,
      elevation,
      location,
      difficulty,
      description,
      image_url,
      updated_at: new Date().toISOString()
    };

    // Add JSONB columns if provided
    if (what_to_bring !== undefined) updateData.what_to_bring = what_to_bring;
    if (budgeting !== undefined) updateData.budgeting = budgeting;
    if (itinerary !== undefined) updateData.itinerary = itinerary;
    if (how_to_get_there !== undefined) updateData.how_to_get_there = how_to_get_there;

    const { data: updatedMountain, error } = await supabase
      .from('mountains')
      .update(updateData)
      .eq('id', parseInt(id))
      .select();

    if (error) {
      console.error('Update mountain error:', error);
      return res.status(500).json({ 
        error: 'Failed to update mountain',
        details: error.message
      });
    }

    console.log('Mountain updated successfully:', updatedMountain);

    // Return the updated mountain data
    res.json({ 
      message: 'Mountain updated successfully', 
      mountain: updatedMountain && updatedMountain.length > 0 ? updatedMountain[0] : { id, name, elevation, location, difficulty, description, image_url }
    });
  } catch (error) {
    console.error('Update mountain catch error:', error);
    res.status(500).json({ error: 'Failed to update mountain', details: error.message });
  }
});

// Delete mountain (admin only) - temporarily without auth for testing
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: deletedMountain, error } = await supabase
      .from('mountains')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Delete mountain error:', error);
      return res.status(500).json({ 
        error: 'Failed to delete mountain',
        details: process.env.NODE_ENV !== 'production' ? error.message : undefined
      });
    }

    if (!deletedMountain) {
      return res.status(404).json({ error: 'Mountain not found' });
    }

    res.json({ message: 'Mountain deleted successfully' });
  } catch (error) {
    console.error('Delete mountain error:', error);
    res.status(500).json({ error: 'Failed to delete mountain' });
  }
});

// Get mountains by difficulty
router.get('/difficulty/:level', async (req, res) => {
  try {
    const { level } = req.params;
    
    const { data: mountains, error } = await supabase
      .from('mountains')
      .select('*')
      .eq('difficulty', level)
      .order('name', { ascending: true });

    if (error) {
      console.error('Get mountains by difficulty error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch mountains',
        details: process.env.NODE_ENV !== 'production' ? error.message : undefined
      });
    }

    res.json({ mountains: mountains || [] });
  } catch (error) {
    console.error('Get mountains by difficulty error:', error);
    res.status(500).json({ error: 'Failed to fetch mountains' });
  }
});

// Get mountain details (what_to_bring, budgeting, itinerary, how_to_get_there)
router.get('/:mountainId/details', async (req, res) => {
  try {
    const { mountainId } = req.params;
    
    const { data: mountain, error } = await supabase
      .from('mountains')
      .select('what_to_bring, budgeting, itinerary, how_to_get_there')
      .eq('id', mountainId)
      .single();

    if (error) {
      console.error('Get mountain details error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch mountain details',
        details: process.env.NODE_ENV !== 'production' ? error.message : undefined
      });
    }

    if (!mountain) {
      return res.status(404).json({ error: 'Mountain not found' });
    }

    res.json({
      success: true,
      data: {
        what_to_bring: mountain.what_to_bring || [],
        budgeting: mountain.budgeting || [],
        itinerary: mountain.itinerary || [],
        how_to_get_there: mountain.how_to_get_there || []
      }
    });
  } catch (error) {
    console.error('Get mountain details error:', error);
    res.status(500).json({ error: 'Failed to fetch mountain details' });
  }
});

// Add or update a detail item to a mountain section (admin only)
router.post('/:mountainId/details/:sectionType', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('POST mountain detail:', { mountainId: req.params.mountainId, sectionType: req.params.sectionType });
    console.log('Request body:', req.body);

    const { mountainId, sectionType } = req.params;
    const { item_name, item_description, item_icon, item_amount, item_unit, item_time, item_duration, item_transport_type, sort_order } = req.body;

    // Validate section type
    if (!['what_to_bring', 'budgeting', 'itinerary', 'how_to_get_there'].includes(sectionType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid section type'
      });
    }

    // Validate required fields
    if (!item_name) {
      return res.status(400).json({
        success: false,
        error: 'item_name is required'
      });
    }

    // Get current mountain
    const { data: mountain, error: fetchError } = await supabase
      .from('mountains')
      .select(sectionType)
      .eq('id', mountainId)
      .single();

    if (fetchError || !mountain) {
      console.error('Error fetching mountain:', fetchError);
      return res.status(404).json({
        success: false,
        error: 'Mountain not found'
      });
    }

    // Get current items array
    let items = mountain[sectionType] || [];
    if (!Array.isArray(items)) {
      items = [];
    }

    // Create new item
    const newItem = {
      id: Date.now(),
      item_name,
      item_description,
      item_icon: sectionType === 'what_to_bring' ? item_icon : undefined,
      item_amount: sectionType === 'budgeting' ? item_amount : undefined,
      item_unit: sectionType === 'budgeting' ? item_unit : undefined,
      item_time: sectionType === 'itinerary' ? item_time : undefined,
      item_duration: sectionType === 'itinerary' ? item_duration : undefined,
      item_transport_type: sectionType === 'how_to_get_there' ? item_transport_type : undefined,
      sort_order: sort_order || items.length
    };

    // Add to items array
    items.push(newItem);

    // Update mountain
    const updateData = {};
    updateData[sectionType] = items;

    const { data: updatedMountain, error: updateError } = await supabase
      .from('mountains')
      .update(updateData)
      .eq('id', mountainId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating mountain:', updateError);
      return res.status(500).json({
        success: false,
        error: 'Failed to add mountain detail',
        details: updateError.message
      });
    }

    console.log('Mountain detail added successfully');
    res.status(201).json({
      success: true,
      data: newItem
    });
  } catch (error) {
    console.error('Error adding mountain detail:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add mountain detail',
      details: error.message
    });
  }
});

// Update a detail item in a mountain section (admin only)
router.put('/:mountainId/details/:sectionType/:itemId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { mountainId, sectionType, itemId } = req.params;
    const { item_name, item_description, item_icon, item_amount, item_unit, item_time, item_duration, item_transport_type } = req.body;

    // Validate section type
    if (!['what_to_bring', 'budgeting', 'itinerary', 'how_to_get_there'].includes(sectionType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid section type'
      });
    }

    // Get current mountain
    const { data: mountain, error: fetchError } = await supabase
      .from('mountains')
      .select(sectionType)
      .eq('id', mountainId)
      .single();

    if (fetchError || !mountain) {
      return res.status(404).json({
        success: false,
        error: 'Mountain not found'
      });
    }

    // Get current items array
    let items = mountain[sectionType] || [];
    if (!Array.isArray(items)) {
      items = [];
    }

    // Find and update item
    const itemIndex = items.findIndex(item => item.id === parseInt(itemId));
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    // Update item
    items[itemIndex] = {
      ...items[itemIndex],
      item_name: item_name || items[itemIndex].item_name,
      item_description: item_description || items[itemIndex].item_description,
      item_icon: sectionType === 'what_to_bring' ? (item_icon || items[itemIndex].item_icon) : undefined,
      item_amount: sectionType === 'budgeting' ? (item_amount || items[itemIndex].item_amount) : undefined,
      item_unit: sectionType === 'budgeting' ? (item_unit || items[itemIndex].item_unit) : undefined,
      item_time: sectionType === 'itinerary' ? (item_time || items[itemIndex].item_time) : undefined,
      item_duration: sectionType === 'itinerary' ? (item_duration || items[itemIndex].item_duration) : undefined,
      item_transport_type: sectionType === 'how_to_get_there' ? (item_transport_type || items[itemIndex].item_transport_type) : undefined
    };

    // Update mountain
    const updateData = {};
    updateData[sectionType] = items;

    const { data: updatedMountain, error: updateError } = await supabase
      .from('mountains')
      .update(updateData)
      .eq('id', mountainId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update mountain detail',
        details: updateError.message
      });
    }

    res.json({
      success: true,
      data: items[itemIndex]
    });
  } catch (error) {
    console.error('Error updating mountain detail:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update mountain detail',
      details: error.message
    });
  }
});

// Delete a detail item from a mountain section (admin only)
router.delete('/:mountainId/details/:sectionType/:itemId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { mountainId, sectionType, itemId } = req.params;

    // Validate section type
    if (!['what_to_bring', 'budgeting', 'itinerary', 'how_to_get_there'].includes(sectionType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid section type'
      });
    }

    // Get current mountain
    const { data: mountain, error: fetchError } = await supabase
      .from('mountains')
      .select(sectionType)
      .eq('id', mountainId)
      .single();

    if (fetchError || !mountain) {
      return res.status(404).json({
        success: false,
        error: 'Mountain not found'
      });
    }

    // Get current items array
    let items = mountain[sectionType] || [];
    if (!Array.isArray(items)) {
      items = [];
    }

    // Find and remove item
    const itemIndex = items.findIndex(item => item.id === parseInt(itemId));
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    items.splice(itemIndex, 1);

    // Update mountain
    const updateData = {};
    updateData[sectionType] = items;

    const { data: updatedMountain, error: updateError } = await supabase
      .from('mountains')
      .update(updateData)
      .eq('id', mountainId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete mountain detail',
        details: updateError.message
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
      error: 'Failed to delete mountain detail',
      details: error.message
    });
  }
});

module.exports = router;
