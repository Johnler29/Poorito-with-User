import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import MountainDetailForm from '../components/MountainDetailForm';
import MountainEditForm from '../components/MountainEditForm';

function Admin() {
  const [activeTab, setActiveTab] = useState('mountains');
  const [mountains, setMountains] = useState([]);
  const [articles, setArticles] = useState([]);
  const [mountainDetails, setMountainDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [editingItem, setEditingItem] = useState(null);

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchMountains = async () => {
    try {
      const data = await apiService.getMountains();
      setMountains(data.mountains || []);
    } catch (err) {
      console.error('Failed to fetch mountains:', err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (activeTab === 'mountains') {
        const data = await apiService.getMountains();
        setMountains(data.mountains || []);
      } else if (activeTab === 'articles') {
        const data = await apiService.getAdminArticles();
        setArticles(data.articles || []);
      } else if (activeTab === 'mountain-details') {
        const data = await apiService.getMountains();
        // Transform the integrated mountain data into mountain-details format
        const details = [];
        if (data.mountains) {
          data.mountains.forEach(mountain => {
            // Extract details from each section
            const sections = ['what_to_bring', 'budgeting', 'itinerary', 'how_to_get_there'];
            sections.forEach(sectionType => {
              const items = mountain[sectionType] || [];
              if (Array.isArray(items)) {
                items.forEach(item => {
                  details.push({
                    id: item.id,
                    mountain_id: mountain.id,
                    mountain_name: mountain.name,
                    section_type: sectionType,
                    item_name: item.item_name,
                    item_description: item.item_description,
                    item_icon: item.item_icon,
                    item_amount: item.item_amount,
                    item_unit: item.item_unit,
                    item_time: item.item_time,
                    item_duration: item.item_duration,
                    item_transport_type: item.item_transport_type,
                    sort_order: item.sort_order
                  });
                });
              }
            });
          });
        }
        setMountainDetails(details);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      if (type === 'mountain') {
        await apiService.deleteMountain(id);
        setMountains(mountains.filter(m => m.id !== id));
      } else if (type === 'article') {
        await apiService.deleteArticle(id);
        setArticles(articles.filter(a => a.id !== id));
      } else if (type === 'mountain-detail') {
        // For mountain details, we need mountain_id, section_type, and item_id
        const detail = mountainDetails.find(d => d.id === id);
        if (detail) {
          await apiService.deleteMountainDetail(detail.mountain_id, detail.section_type, detail.id);
          setMountainDetails(mountainDetails.filter(d => d.id !== id));
        }
      }
    } catch (err) {
      console.error('Failed to delete:', err);
      setError('Failed to delete item');
    }
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setModalType('edit');
    setShowModal(true);
  };

  const handleCreate = (type) => {
    // Ensure mountains are loaded when creating mountain details
    if (type === 'mountain-details' && mountains.length === 0) {
      fetchMountains();
    }
    setEditingItem(null);
    setModalType('create');
    setShowModal(true);
  };

  const handleSave = () => {
    setShowModal(false);
    setEditingItem(null);
    fetchData();
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const filteredMountains = mountains.filter(mountain =>
    mountain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mountain.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMountainDetails = mountainDetails.filter(detail =>
    detail.mountain_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    detail.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    detail.section_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">Admin Panel</h1>
          <p className="text-orange-600 font-semibold text-lg flex items-center gap-2">
            <span>📅</span>
            {currentDate}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleCreate(activeTab)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            + Add {activeTab === 'mountains' ? 'Mountain' : activeTab === 'articles' ? 'Article' : 'Mountain Detail'}
          </button>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('mountains')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'mountains'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Mountains ({mountains.length})
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'articles'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Articles ({articles.length})
          </button>
        </nav>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-400 mr-3">⚠️</div>
            <div>
              <h3 className="text-red-800 font-semibold">Error</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center p-6 border-b border-gray-200 gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Manage {activeTab === 'mountains' ? 'Mountains' : activeTab === 'articles' ? 'Articles' : 'Mountain Details'}
          </h2>
          <div className="flex flex-wrap gap-3">
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all w-full lg:w-64" 
            />
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                {activeTab === 'mountains' ? (
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Elevation</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Difficulty</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                ) : activeTab === 'articles' ? (
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mountain</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Section</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activeTab === 'mountains' ? (
                  filteredMountains.map((mountain) => (
                    <tr key={mountain.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{mountain.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{mountain.location}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{mountain.elevation}m</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          mountain.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          mountain.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                          mountain.difficulty === 'Hard' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {mountain.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(mountain.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(mountain, 'mountain')}
                            className="px-3 py-1.5 text-orange-600 hover:text-orange-700 border border-orange-300 hover:border-orange-400 rounded-md text-xs font-medium transition-all"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(mountain.id, 'mountain')}
                            className="px-3 py-1.5 text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400 rounded-md text-xs font-medium transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : activeTab === 'articles' ? (
                  filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{article.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{article.author}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{article.category || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          article.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(article.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(article, 'article')}
                            className="px-3 py-1.5 text-orange-600 hover:text-orange-700 border border-orange-300 hover:border-orange-400 rounded-md text-xs font-medium transition-all"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(article.id, 'article')}
                            className="px-3 py-1.5 text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400 rounded-md text-xs font-medium transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredMountainDetails.map((detail) => {
                    const getSectionColor = (sectionType) => {
                      switch (sectionType) {
                        case 'what_to_bring': return 'bg-blue-100 text-blue-800';
                        case 'budgeting': return 'bg-green-100 text-green-800';
                        case 'itinerary': return 'bg-purple-100 text-purple-800';
                        case 'how_to_get_there': return 'bg-orange-100 text-orange-800';
                        default: return 'bg-gray-100 text-gray-800';
                      }
                    };

                    const getSectionName = (sectionType) => {
                      switch (sectionType) {
                        case 'what_to_bring': return 'What to Bring';
                        case 'budgeting': return 'Budgeting';
                        case 'itinerary': return 'Itinerary';
                        case 'how_to_get_there': return 'How to Get There';
                        default: return sectionType;
                      }
                    };

                    const getDetails = () => {
                      switch (detail.section_type) {
                        case 'what_to_bring':
                          return detail.item_icon ? `${detail.item_icon} ${detail.item_name}` : detail.item_name;
                        case 'budgeting':
                          return `${detail.item_name} - ₱${parseFloat(detail.item_amount || 0).toFixed(2)} ${detail.item_unit || ''}`;
                        case 'itinerary':
                          return `${detail.item_time || ''} - ${detail.item_name} ${detail.item_duration ? `(${detail.item_duration})` : ''}`;
                        case 'how_to_get_there':
                          return `${detail.item_name} (${detail.item_transport_type || 'N/A'})`;
                        default:
                          return detail.item_name;
                      }
                    };

                    return (
                      <tr key={detail.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{detail.mountain_name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSectionColor(detail.section_type)}`}>
                            {getSectionName(detail.section_type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {detail.item_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {getDetails()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEdit(detail, 'mountain-detail')}
                              className="px-3 py-1.5 text-orange-600 hover:text-orange-700 border border-orange-300 hover:border-orange-400 rounded-md text-xs font-medium transition-all"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(detail.id, 'mountain-detail')}
                              className="px-3 py-1.5 text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400 rounded-md text-xs font-medium transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            
            {((activeTab === 'mountains' && filteredMountains.length === 0) || 
              (activeTab === 'articles' && filteredArticles.length === 0) ||
              (activeTab === 'mountain-details' && filteredMountainDetails.length === 0)) && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab.replace('-', ' ')} found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : `Get started by adding your first ${activeTab === 'mountain-details' ? 'mountain detail' : activeTab.slice(0, -1)}`}
                </p>
                <button
                  onClick={() => handleCreate(activeTab)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Add {activeTab === 'mountains' ? 'Mountain' : activeTab === 'articles' ? 'Article' : 'Mountain Detail'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && activeTab === 'mountain-details' && (
        <MountainDetailForm
          detail={editingItem}
          onSave={handleSave}
          onCancel={handleCancel}
          mountains={mountains}
        />
      )}

      {showModal && activeTab === 'mountains' && (
        <MountainEditForm
          mountain={editingItem}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default Admin;
