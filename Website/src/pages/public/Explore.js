import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../../services/api';

// Mountain Card Component
const MountainCard = ({ mountain, viewMode, onExplore }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'expert':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return '🟢';
      case 'moderate':
        return '🟡';
      case 'hard':
        return '🟠';
      case 'expert':
        return '🔴';
      default:
        return '⚪';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-96 h-56 md:h-auto bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 overflow-hidden relative">
            {mountain.image_url ? (
              <img 
                src={mountain.image_url} 
                alt={mountain.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white text-7xl opacity-50">⛰️</span>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${getDifficultyColor(mountain.difficulty)}`}>
                {getDifficultyIcon(mountain.difficulty)} {mountain.difficulty}
              </span>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-7">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">{mountain.name}</h3>
                <p className="text-gray-600 mb-5 line-clamp-2 leading-relaxed">{mountain.description || 'No description available.'}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div className="flex items-start text-sm">
                    <span className="w-7 h-7 flex items-center justify-center mr-2 text-xl flex-shrink-0">📍</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{mountain.location}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Location</div>
                    </div>
                  </div>
                  <div className="flex items-start text-sm">
                    <span className="w-7 h-7 flex items-center justify-center mr-2 text-xl flex-shrink-0">📏</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{mountain.elevation.toLocaleString()}m</div>
                      <div className="text-xs text-gray-500 mt-0.5">Elevation</div>
                    </div>
                  </div>
                  <div className="flex items-start text-sm">
                    <span className="w-7 h-7 flex items-center justify-center mr-2 text-xl flex-shrink-0">{getDifficultyIcon(mountain.difficulty)}</span>
                    <div className="flex-1">
                      <div className={`font-semibold ${getDifficultyColor(mountain.difficulty).split(' ')[1]}`}>
                        {mountain.difficulty}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">Difficulty</div>
                    </div>
                  </div>
                  <div className="flex items-start text-sm">
                    <span className="w-7 h-7 flex items-center justify-center mr-2 text-xl flex-shrink-0">🏔️</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{mountain.status || 'Single'}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Type</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 min-w-[140px]">
                <button 
                  onClick={onExplore}
                  className="px-6 py-3 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 whitespace-nowrap"
                >
                  View Details
                </button>
                <div className="text-xs text-gray-500 text-center">
                  Added {new Date(mountain.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 flex flex-col h-full">
      <div className="relative h-56 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 overflow-hidden flex-shrink-0">
        {mountain.image_url ? (
          <img 
            src={mountain.image_url} 
            alt={mountain.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-7xl opacity-50">⛰️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 group-hover:from-black/30 transition-all" />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${getDifficultyColor(mountain.difficulty)}`}>
            {getDifficultyIcon(mountain.difficulty)} {mountain.difficulty}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-900 text-xl mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">{mountain.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed h-10">{mountain.description || 'No description available.'}</p>
        
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center text-sm text-gray-700">
            <span className="w-6 h-6 flex items-center justify-center mr-2 text-lg flex-shrink-0">📍</span>
            <span className="truncate font-medium">{mountain.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <span className="w-6 h-6 flex items-center justify-center mr-2 text-lg flex-shrink-0">📏</span>
            <span className="font-medium">{mountain.elevation.toLocaleString()}m elevation</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <span className="w-6 h-6 flex items-center justify-center mr-2 text-lg flex-shrink-0">🏔️</span>
            <span className="font-medium">{mountain.status || 'Single'} trail</span>
          </div>
        </div>
        
        <button 
          onClick={onExplore}
          className="w-full px-4 py-3 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 mt-auto"
        >
          Explore Trail
        </button>
      </div>
    </div>
  );
};

function Explore() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cityQuery, setCityQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [mountains, setMountains] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch mountains from API
  useEffect(() => {
    fetchMountains();
  }, []);

  // Handle search query from navigation state
  useEffect(() => {
    if (location.state?.searchQuery) {
      setCityQuery(location.state.searchQuery);
    }
  }, [location.state]);

  const fetchMountains = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMountains();
      setMountains(response.mountains || []);
    } catch (err) {
      console.error('Error fetching mountains:', err);
      // Fallback to empty array on error
      setMountains([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let filtered = mountains.filter(m => 
      m.location.toLowerCase().includes(cityQuery.toLowerCase()) ||
      m.name.toLowerCase().includes(cityQuery.toLowerCase()) ||
      m.description?.toLowerCase().includes(cityQuery.toLowerCase())
    );

    // Filter by difficulty
    if (difficultyFilter !== 'All') {
      filtered = filtered.filter(m => m.difficulty === difficultyFilter);
    }

    // Sort mountains
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'elevation':
          return b.elevation - a.elevation; // Highest first
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Moderate': 2, 'Hard': 3, 'Expert': 4 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

    return filtered;
  }, [mountains, cityQuery, difficultyFilter, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">Explore Trails</h1>
              <p className="text-lg text-gray-600">Discover amazing mountains and plan your next adventure with detailed information.</p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                <span className="text-2xl">⛰️</span>
                <div className="text-sm">
                  <span className="font-bold text-gray-900 text-lg">{filtered.length}</span>
                  <span className="text-gray-500"> / {mountains.length} trails</span>
                </div>
              </div>
              <div className="flex gap-2 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                  title="Grid view"
                >
                  <span className="text-lg">⚏</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                  title="List view"
                >
                  <span className="text-lg">☰</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search Trails</label>
                <div className="relative">
                  <input 
                    value={cityQuery} 
                    onChange={(e)=>setCityQuery(e.target.value)} 
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:border-gray-300" 
                    placeholder="Search by name, location, or description..." 
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:border-gray-300 cursor-pointer"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">🟢 Easy</option>
                  <option value="Moderate">🟡 Moderate</option>
                  <option value="Hard">🟠 Hard</option>
                  <option value="Expert">🔴 Expert</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:border-gray-300 cursor-pointer"
                >
                  <option value="name">📝 Name (A-Z)</option>
                  <option value="elevation">📏 Elevation (High to Low)</option>
                  <option value="difficulty">⚠️ Difficulty (Easy to Hard)</option>
                  <option value="location">📍 Location (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Mountains Display */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-100 border-t-orange-500 mx-auto mb-5"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">⛰️</span>
                </div>
              </div>
              <p className="text-gray-600 font-medium text-lg">Loading trails...</p>
            </div>
          </div>
        ) : mountains.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <div className="text-7xl mb-5">⛰️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No trails available</h3>
            <p className="text-gray-600">No mountains found in the database.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <div className="text-7xl mb-5">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No trails found</h3>
            <p className="text-gray-600 mb-4">
              {cityQuery || difficultyFilter !== 'All' ? 'Try adjusting your search or filters.' : 'No mountains available yet.'}
            </p>
            {(cityQuery || difficultyFilter !== 'All') && (
              <button 
                onClick={() => {
                  setCityQuery('');
                  setDifficultyFilter('All');
                }}
                className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8' : 'space-y-5'} mb-16`}>
            {filtered.map((mountain) => (
              <MountainCard 
                key={mountain.id} 
                mountain={mountain} 
                viewMode={viewMode}
                onExplore={() => navigate(`/mountains/${mountain.id}`)}
              />
            ))}
          </div>
        )}

        {/* No "See more" button needed - all trails are shown here */}

        {/* Planning resources */}
        <div className="space-y-12 mt-20">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Plan Your Adventure</h2>
            <p className="text-lg text-gray-600">Everything you need to know before hitting the trails</p>
          </div>
          
          {/* Essential Tips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 lg:gap-8">
            {[{
              title: 'Essential Gear',
              points: ['Layers & rain jacket', '2L water minimum', 'Headlamp + spare batteries', 'First aid kit', 'Emergency whistle'],
              icon: '🎒',
              color: 'from-blue-500 to-blue-600'
            },{
              title: 'Navigation & Safety',
              points: ['Download offline maps', 'Carry power bank', 'Know bailout points', 'Share your itinerary', 'Check weather conditions'],
              icon: '🧭',
              color: 'from-green-500 to-green-600'
            },{
              title: 'Responsible Hiking',
              points: ['Support local guides', 'Respect cultural sites', 'Minimize waste', 'Stay on marked trails', 'Leave no trace'],
              icon: '🌱',
              color: 'from-purple-500 to-purple-600'
            }].map(card => (
              <div key={card.title} className="bg-white border border-gray-200 rounded-2xl p-7 hover:shadow-xl transition-all hover:border-orange-300 group hover:-translate-y-1 duration-300">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${card.color} flex items-center justify-center text-3xl text-white mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                  {card.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-4">{card.title}</h3>
                <ul className="text-sm text-gray-700 space-y-2.5">
                  {card.points.map(p => (
                    <li key={p} className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-1 font-bold">•</span>
                      <span className="leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Difficulty Guide */}
          <div className="bg-gradient-to-r from-orange-50 via-orange-50 to-orange-100 rounded-2xl p-8 lg:p-10 shadow-md border border-orange-200">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Trail Difficulty Guide</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { level: 'Easy', icon: '🟢', description: 'Well-marked trails, minimal elevation gain', time: '1-3 hours' },
                { level: 'Moderate', icon: '🟡', description: 'Some steep sections, moderate fitness required', time: '3-6 hours' },
                { level: 'Hard', icon: '🟠', description: 'Challenging terrain, good fitness essential', time: '6-10 hours' },
                { level: 'Expert', icon: '🔴', description: 'Technical sections, experienced hikers only', time: '10+ hours' }
              ].map(difficulty => (
                <div key={difficulty.level} className="bg-white rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-orange-300">
                  <div className="text-4xl mb-3">{difficulty.icon}</div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">{difficulty.level}</h4>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{difficulty.description}</p>
                  <p className="text-xs text-orange-600 font-bold">{difficulty.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 lg:gap-6">
            <div className="bg-white rounded-xl p-7 text-center border border-gray-200 hover:shadow-lg transition-all hover:border-orange-300">
              <div className="text-4xl mb-3">⛰️</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{mountains.length}</div>
              <div className="text-sm text-gray-600 font-medium">Total Trails</div>
            </div>
            <div className="bg-white rounded-xl p-7 text-center border border-gray-200 hover:shadow-lg transition-all hover:border-orange-300">
              <div className="text-4xl mb-3">📍</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {[...new Set(mountains.map(m => m.location))].length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Locations</div>
            </div>
            <div className="bg-white rounded-xl p-7 text-center border border-gray-200 hover:shadow-lg transition-all hover:border-orange-300">
              <div className="text-4xl mb-3">📏</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {mountains.length > 0 ? Math.max(...mountains.map(m => m.elevation)).toLocaleString() : 0}m
              </div>
              <div className="text-sm text-gray-600 font-medium">Highest Peak</div>
            </div>
            <div className="bg-white rounded-xl p-7 text-center border border-gray-200 hover:shadow-lg transition-all hover:border-orange-300">
              <div className="text-4xl mb-3">🟢</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {mountains.filter(m => m.difficulty === 'Easy').length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Easy Trails</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore;


