# Mountain Details Database Integration

This document describes the integration of "What to Bring" and "Budgeting" sections with the database.

## Overview

The mountain detail pages now fetch and display data from the database instead of using hardcoded values. This allows administrators to manage the content dynamically through the admin panel.

## Database Schema

### New Table: `mountain_details`

```sql
CREATE TABLE mountain_details (
    id BIGSERIAL PRIMARY KEY,
    mountain_id BIGINT REFERENCES mountains(id) ON DELETE CASCADE,
    section_type TEXT CHECK (section_type IN ('what_to_bring', 'budgeting')) NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    item_description TEXT,
    item_icon VARCHAR(10), -- For emoji icons
    item_amount DECIMAL(10,2), -- For budgeting fees
    item_unit VARCHAR(50), -- e.g., 'per person', 'per group'
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

### Backend Routes (`/api/mountain-details`)

- `GET /mountains/:mountainId/details` - Get details for a specific mountain
- `GET /mountain-details` - Get all mountain details (admin only)
- `POST /mountain-details` - Create new mountain detail (admin only)
- `PUT /mountain-details/:id` - Update mountain detail (admin only)
- `DELETE /mountain-details/:id` - Delete mountain detail (admin only)
- `PUT /mountains/:mountainId/details` - Bulk update mountain details (admin only)

## Frontend Components

### Updated Components

1. **MountainDetail.js** - Now fetches and displays data from database
2. **Admin.js** - Added "Mountain Details" tab for management
3. **MountainDetailForm.js** - New form component for CRUD operations

### New Features

- **Dynamic Content**: Mountain detail pages now show data from database
- **Admin Management**: Admins can add, edit, and delete mountain details
- **Loading States**: Skeleton loading animations while fetching data
- **Error Handling**: Graceful fallbacks when data is unavailable
- **Responsive Design**: Maintains existing responsive layout

## Setup Instructions

### 1. Database Setup

Run the SQL script to create the table:

```bash
# Option 1: Use the setup script
node setup-mountain-details.js

# Option 2: Manual setup
# Copy contents of add-mountain-details-table.sql
# Run in Supabase SQL Editor
```

### 2. Backend Setup

The backend routes are already added to `server.js`. No additional setup required.

### 3. Frontend Setup

The frontend components are already updated. No additional setup required.

### 4. Start Servers

```bash
# Backend (in backend folder)
npm start

# Frontend (in Website folder)
npm start
```

## Usage

### For Administrators

1. **Access Admin Panel**: Go to `/admin` and login with admin credentials
2. **Navigate to Mountain Details**: Click on "Mountain Details" tab
3. **Add New Details**: Click "Add Mountain Detail" button
4. **Fill Form**:
   - Select mountain
   - Choose section type (What to Bring or Budgeting)
   - Enter item name and description
   - For "What to Bring": Add emoji icon
   - For "Budgeting": Add amount and unit
   - Set sort order
5. **Save**: Click "Create" to save

### For Users

1. **View Mountain Details**: Visit any mountain detail page
2. **See Dynamic Content**: "What to Bring" and "Budgeting" sections show database content
3. **Loading Experience**: Skeleton animations while content loads

## Data Structure

### What to Bring Items
```json
{
  "section_type": "what_to_bring",
  "item_name": "Backpack",
  "item_description": "Sturdy backpack for carrying essentials",
  "item_icon": "🎒",
  "sort_order": 1
}
```

### Budgeting Items
```json
{
  "section_type": "budgeting",
  "item_name": "Environmental and Entrance Fee",
  "item_description": "Required fee for trail maintenance",
  "item_amount": 100.00,
  "item_unit": "per person",
  "sort_order": 1
}
```

## Features

### What to Bring Section
- Grid layout with icons and names
- Hover effects and animations
- Responsive design (2-4-6 columns)
- Loading skeletons
- Empty state handling

### Budgeting Section
- Card layout with color coding
- Amount formatting (₱ symbol)
- Unit display
- Responsive design (3 columns)
- Loading skeletons
- Empty state handling

## Security

- Row Level Security (RLS) enabled
- Admin-only write access
- Public read access
- Input validation on both frontend and backend

## Error Handling

- Graceful fallbacks when API fails
- Loading states for better UX
- Error messages in admin forms
- Console logging for debugging

## Future Enhancements

- Bulk import/export functionality
- Image support for items
- Categories and tags
- User favorites
- Search and filtering
- Analytics tracking

## Troubleshooting

### Common Issues

1. **Data not loading**: Check backend server is running
2. **Admin form not working**: Verify admin authentication
3. **Database errors**: Check Supabase connection and RLS policies
4. **Styling issues**: Ensure Tailwind CSS is properly configured

### Debug Steps

1. Check browser console for errors
2. Verify API endpoints are accessible
3. Check database connection
4. Validate form data before submission

## Support

For issues or questions:
1. Check the console logs
2. Verify database setup
3. Test API endpoints directly
4. Check network connectivity
