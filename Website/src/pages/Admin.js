import React, { useState } from 'react';

function Admin() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const [activities] = useState([
    { 
      id: 1234, 
      name: 'Admin One', 
      description: 'Mt. Batulao article', 
      url: '', 
      date: '01/12/2025', 
      status: 'Deleted' 
    },
    { 
      id: 1234, 
      name: 'Admin One', 
      description: 'New MT.', 
      url: '', 
      date: '01/12/2025', 
      status: 'Edited' 
    },
    { 
      id: 1234, 
      name: 'Admin One', 
      description: '', 
      url: '', 
      date: '01/12/2025', 
      status: 'New post' 
    },
  ]);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Deleted':
        return 'text-red-600 font-semibold';
      case 'Edited':
        return 'text-yellow-600 font-semibold';
      case 'New post':
        return 'text-green-600 font-semibold';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin</h1>
          <p className="text-primary font-medium">{currentDate}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-2xl font-semibold text-gray-800">Activity log</h2>
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Search..." 
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-64" 
            />
            <button className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium text-sm transition-colors shadow-sm hover:shadow">
              FILTER
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">URL</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activities.map((activity, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">{activity.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{activity.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{activity.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{activity.url}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{activity.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${getStatusStyle(activity.status)}`}>
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="px-4 py-1.5 bg-accent hover:bg-yellow-500 text-gray-900 rounded-lg font-medium text-xs transition-all shadow-sm hover:shadow">
                        EDIT
                      </button>
                      <button className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-xs transition-all shadow-sm hover:shadow">
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Admin;
