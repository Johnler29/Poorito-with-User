# Poorito Dashboard

A modern React-based mountain management dashboard application for tracking and managing mountain hiking information, articles, guides, and analytics.

## Features

- **Dashboard**: Overview of total mountains, articles, and guides
- **Mountains Management**: CRUD operations for mountain information including:
  - Mountain details (name, location, difficulty, duration)
  - Image gallery upload
  - Hike itinerary
  - Transportation guides
  - Things to bring
  - Fees information
  - Reminders
- **Articles & Guides**: Manage related content for each mountain
- **Analytics**: View visitor statistics, article/guide clicks, and mountain views
- **Admin Panel**: Activity log tracking all system changes

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```bash
npm run build
```

## Technology Stack

- React 18.2
- React Router 6.20
- CSS3 (No external UI libraries)
- Modern ES6+ JavaScript

## Project Structure

```
src/
├── components/
│   ├── Layout.js       # Main layout wrapper
│   ├── Sidebar.js      # Navigation sidebar
│   └── Header.js       # Top header with search
├── pages/
│   ├── Dashboard.js    # Dashboard overview
│   ├── Mountains.js    # Mountains list
│   ├── MountainForm.js # Add/Edit mountain form
│   ├── ArticlesGuides.js
│   ├── Analytics.js
│   └── Admin.js
└── App.js              # Main app component with routing
```

## Color Scheme

- Primary: Orange (#d2691e)
- Secondary: Brown (#8b4513)
- Accent: Yellow (#f5c842)
- Background: Beige (#f5f5f0)
- Success: Green (#6ba832)
- Danger: Red (#e74c3c)

## License

MIT

