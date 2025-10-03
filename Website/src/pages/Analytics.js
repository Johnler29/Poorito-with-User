import React from 'react';

function Analytics() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const mountains = [
    { id: 1, name: 'Mt. Batulao', views: 3, clicks: 1 },
    { id: 2, name: 'Mt. Batulao', views: 3, clicks: 1 },
    { id: 3, name: 'Mt. Batulao', views: 3, clicks: 1 },
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-primary font-medium">{currentDate}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Overview</h2>

        <div className="flex gap-3 mb-6">
          {['Last 7 days', 'Last 30 days', 'Month', 'Year', 'All time'].map((filter, index) => (
            <button 
              key={filter}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filter === 'Year' 
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <svg viewBox="0 0 1000 300" className="w-full h-64">
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f5c842" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#f5c842" stopOpacity="0.1"/>
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d2691e" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#d2691e" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            
            {/* Yellow wave */}
            <path 
              d="M0,100 Q100,80 200,90 T400,85 T600,95 T800,90 T1000,100 L1000,300 L0,300 Z" 
              fill="url(#gradient1)" 
            />
            
            {/* Orange wave */}
            <path 
              d="M0,150 Q100,130 200,140 T400,135 T600,145 T800,140 T1000,150 L1000,300 L0,300 Z" 
              fill="url(#gradient2)" 
            />
            
            {/* Month labels */}
            {months.map((month, index) => (
              <text 
                key={month} 
                x={50 + index * 80} 
                y="290" 
                fontSize="14" 
                fill="#666" 
                textAnchor="middle"
              >
                {month}
              </text>
            ))}
          </svg>

          <div className="text-center mt-4 text-gray-600 font-medium">← 2025</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100 hover:border-primary/30 transition-all">
            <div className="text-sm text-gray-600 font-medium mb-2">Visitors</div>
            <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              101
            </div>
            <div className="text-green-500 font-semibold mt-2">↑</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100 hover:border-accent/30 transition-all">
            <div className="text-sm text-gray-600 font-medium mb-2">Article Clicks</div>
            <div className="text-5xl font-bold bg-gradient-to-r from-accent to-yellow-600 bg-clip-text text-transparent">
              2
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100 hover:border-secondary/30 transition-all">
            <div className="text-sm text-gray-600 font-medium mb-2">Guide Clicks</div>
            <div className="text-5xl font-bold bg-gradient-to-r from-secondary to-green-600 bg-clip-text text-transparent">
              0
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Mountains</h2>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Image</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mountain</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Views</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mountains.map((mountain) => (
                <tr key={mountain.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex flex-col items-center justify-center">
                      <div className="text-xl">☁️</div>
                      <div className="text-xl">⛰️</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{mountain.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{mountain.views}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{mountain.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
