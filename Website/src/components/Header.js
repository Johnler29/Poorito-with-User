import React from 'react';

function Header() {
  return (
    <div className="flex justify-between items-center px-8 py-5 bg-white/70 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="relative flex items-center">
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-80 px-4 py-2.5 pr-10 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
        />
        <button className="absolute right-3 text-gray-400 hover:text-primary transition-colors">
          🔍
        </button>
      </div>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-lg cursor-pointer hover:shadow-lg transition-all transform hover:scale-105">
          👤
        </div>
      </div>
    </div>
  );
}

export default Header;

