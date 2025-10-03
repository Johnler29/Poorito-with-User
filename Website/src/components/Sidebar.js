import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/mountains', label: 'Mountains', icon: '⛰️' },
    { path: '/articles-guides', label: 'Articles and Guides', icon: '📖' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/admin', label: 'Admin', icon: '👤' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-lg z-50">
      <div className="p-6 text-center border-b border-gray-100">
        <img 
          src="/poorito-logo.png" 
          alt="Poorito" 
          className="w-28 h-28 mx-auto object-contain" 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="hidden flex-col items-center justify-center">
          <div className="w-28 h-28 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-xl">
            <span className="text-white font-bold text-base text-center">POORITO</span>
          </div>
        </div>
      </div>
      <nav className="flex flex-col py-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 transition-all duration-200 border-l-4 ${
              location.pathname === item.path 
                ? 'bg-gradient-to-r from-primary to-primary-dark text-white border-primary-dark shadow-md' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-primary border-transparent'
            }`}
          >
            <span className="text-xl mr-3">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;

