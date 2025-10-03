import React, { useState } from 'react';

function ArticlesGuides() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const [articles] = useState([
    { 
      id: 1, 
      image: '🏔️', 
      mountainName: 'Mt. Batulao', 
      title: 'MOUNT BATULAO: W...', 
      author: 'roviewanderlist',
      link: 'https://rowie...',
      type: 'Article'
    },
    { 
      id: 2, 
      image: '⛰️', 
      mountainName: 'Mt. Batulao', 
      title: 'Guide for ...', 
      author: 'roviewanderlist',
      link: 'https://rowie...',
      type: 'Guide'
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Articles and Guides</h1>
          <p className="text-primary font-medium">{currentDate}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-2xl font-semibold text-gray-800">Manage Articles and Guides</h2>
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Search article or guide..." 
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-64" 
            />
            <button className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium text-sm transition-colors shadow-sm hover:shadow">
              FILTER
            </button>
            <button className="px-5 py-2 bg-gradient-to-r from-secondary to-green-600 hover:from-secondary hover:to-green-700 text-white rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow-md transform hover:scale-105">
              + ADD NEW
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">IMG</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mountain Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Author</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Link</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center text-2xl">
                      {article.image}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{article.mountainName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{article.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{article.author}</td>
                  <td className="px-6 py-4">
                    <a 
                      href={article.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary-dark underline"
                    >
                      {article.link}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary">
                      <option>{article.type}</option>
                      <option>Article</option>
                      <option>Guide</option>
                    </select>
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

export default ArticlesGuides;
