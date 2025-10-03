import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Mountains() {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const [mountains] = useState([
    { id: 1, name: 'Mt. Batulao', location: 'Batangas, Cavite', difficulty: 'Easy', status: 'Single' },
    { id: 2, name: 'Mt. Batulao', location: 'Batangas, Cavite', difficulty: 'Easy', status: 'Single' },
    { id: 3, name: 'Mt. Batulao', location: 'Batangas, Cavite', difficulty: 'Easy', status: 'Single' },
  ]);

  const handleEdit = (id) => {
    navigate(`/mountains/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this mountain?')) {
      console.log('Delete mountain:', id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mountains</h1>
          <p className="text-primary font-medium">{currentDate}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-2xl font-semibold text-gray-800">Manage Mountains</h2>
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Search mountain..." 
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-64" 
            />
            <button className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium text-sm transition-colors shadow-sm hover:shadow">
              FILTER
            </button>
            <button 
              className="px-5 py-2 bg-gradient-to-r from-secondary to-green-600 hover:from-secondary hover:to-green-700 text-white rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow-md transform hover:scale-105"
              onClick={() => navigate('/mountains/new')}
            >
              + ADD NEW
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mountain Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Difficulty</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mountains.map((mountain) => (
                <tr key={mountain.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{mountain.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{mountain.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{mountain.difficulty}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {mountain.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        className="px-4 py-1.5 bg-accent hover:bg-yellow-500 text-gray-900 rounded-lg font-medium text-xs transition-all shadow-sm hover:shadow"
                        onClick={() => handleEdit(mountain.id)}
                      >
                        EDIT
                      </button>
                      <button 
                        className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-xs transition-all shadow-sm hover:shadow"
                        onClick={() => handleDelete(mountain.id)}
                      >
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

export default Mountains;

