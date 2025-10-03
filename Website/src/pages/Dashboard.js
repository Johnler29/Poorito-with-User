import React from 'react';

function Dashboard() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-primary font-medium">{currentDate}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border border-gray-100 hover:border-primary/30 transform hover:-translate-y-1">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Total Mountains</h3>
            <div className="text-6xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent my-6">
              0
            </div>
            <div className="text-6xl">⛰️</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border border-gray-100 hover:border-secondary/30 transform hover:-translate-y-1">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Articles</h3>
            <div className="text-6xl font-bold bg-gradient-to-r from-secondary to-green-600 bg-clip-text text-transparent my-6">
              0
            </div>
            <div className="text-6xl">📖</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border border-gray-100 hover:border-accent/30 transform hover:-translate-y-1">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Guides</h3>
            <div className="text-6xl font-bold bg-gradient-to-r from-accent to-yellow-600 bg-clip-text text-transparent my-6">
              0
            </div>
            <div className="text-6xl">📋</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

