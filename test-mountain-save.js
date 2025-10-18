// Test script to check mountain saving functionality
const { Pool } = require('pg');

async function testMountainSave() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/poorito'
  });

  try {
    // Check if mountain_details table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'mountain_details'
      );
    `);
    
    console.log('Mountain details table exists:', tableCheck.rows[0].exists);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Creating mountain_details table...');
      const fs = require('fs');
      const sql = fs.readFileSync('./add-mountain-details-table.sql', 'utf8');
      await pool.query(sql);
      console.log('Table created successfully!');
    }
    
    // Check if there are any mountains
    const mountains = await pool.query('SELECT id, name FROM mountains LIMIT 5');
    console.log('Available mountains:', mountains.rows);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

testMountainSave();

