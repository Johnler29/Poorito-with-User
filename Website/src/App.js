import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Mountains from './pages/Mountains';
import MountainForm from './pages/MountainForm';
import ArticlesGuides from './pages/ArticlesGuides';
import Analytics from './pages/Analytics';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mountains" element={<Mountains />} />
          <Route path="/mountains/new" element={<MountainForm />} />
          <Route path="/mountains/edit/:id" element={<MountainForm />} />
          <Route path="/articles-guides" element={<ArticlesGuides />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

