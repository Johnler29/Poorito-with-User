import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';

function Home() {
  const navigate = useNavigate();
  const [cityQuery, setCityQuery] = useState('');
  const [mountains, setMountains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch mountains from API
  useEffect(() => {
    fetchMountains();
  }, []);

  const fetchMountains = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMountains();
      // Keep full list and filter in UI for sections
      setMountains(response.mountains || []);
    } catch (err) {
      console.error('Error fetching mountains:', err);
      setMountains([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine if a location is within CALABARZON (Region IV‑A)
  const isCalabarzon = (location = '') => {
    const provinces = ['Cavite', 'Laguna', 'Batangas', 'Rizal', 'Quezon', 'CALABARZON', 'Region IV-A', 'Region 4A'];
    return provinces.some(p => location.toLowerCase().includes(p.toLowerCase()));
  };

  // Derive lists for sections
  const calabarzonMountains = useMemo(() => (
    (mountains || []).filter(m => isCalabarzon(m.location))
  ), [mountains]);

  const beyondMountains = useMemo(() => (
    (mountains || []).filter(m => !isCalabarzon(m.location))
  ), [mountains]);

  // Apply search to all mountains
  const filteredMountains = useMemo(() => {
    if (!cityQuery.trim()) return mountains;
    
    const query = cityQuery.toLowerCase().trim();
    return mountains.filter(m => {
      const name = (m.name || '').toLowerCase();
      const location = (m.location || '').toLowerCase();
      const description = (m.description || '').toLowerCase();
      
      // Search in name, location, and description
      return name.includes(query) || 
             location.includes(query) || 
             description.includes(query) ||
             // Also search for partial matches in location parts
             location.split(',').some(part => part.trim().includes(query)) ||
             location.split(' ').some(part => part.trim().includes(query));
    });
  }, [mountains, cityQuery]);

  // Separate filtered results back into CALABARZON and beyond
  const filteredCalabarzon = useMemo(() => (
    filteredMountains.filter(m => isCalabarzon(m.location))
  ), [filteredMountains]);

  const filteredBeyond = useMemo(() => (
    filteredMountains.filter(m => !isCalabarzon(m.location))
  ), [filteredMountains]);

  // Generate search suggestions based on unique locations
  const searchSuggestions = useMemo(() => {
    if (!cityQuery.trim() || cityQuery.length < 2) return [];
    
    const query = cityQuery.toLowerCase().trim();
    const uniqueLocations = [...new Set(mountains.map(m => m.location))];
    
    return uniqueLocations
      .filter(location => location.toLowerCase().includes(query))
      .slice(0, 5) // Limit to 5 suggestions
      .sort((a, b) => {
        // Prioritize exact matches and matches at the beginning
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        if (aLower.startsWith(query) && !bLower.startsWith(query)) return -1;
        if (!aLower.startsWith(query) && bLower.startsWith(query)) return 1;
        return aLower.localeCompare(bLower);
      });
  }, [mountains, cityQuery]);

  const handleSearchChange = (e) => {
    setCityQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setCityQuery(suggestion);
    setShowSuggestions(false);
    // Navigate to explore page with the selected location as search query
    navigate('/explore', { state: { searchQuery: suggestion } });
  };

  const clearSearch = () => {
    setCityQuery('');
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-gray-50 pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
              Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">adventure</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">
              Discover amazing trails across CALABARZON and beyond. Start your journey today.
            </p>
            <div className="w-full max-w-2xl mb-8 relative">
              <div className="relative">
                <input 
                  value={cityQuery} 
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow clicks on suggestions
                  className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-md hover:border-gray-300" 
                  placeholder="Search by city, mountain name, or location..." 
                />
                {cityQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <span className="text-gray-400 mr-3">📍</span>
                        <span className="text-gray-900">{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 h-64 md:h-96 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-2xl overflow-hidden relative">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
              }}
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>
      </section>

      {/* Explore trails */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <button 
              onClick={() => navigate('/explore')}
              className="text-left hover:opacity-80 transition-opacity group"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                Explore trails
              </h2>
              <p className="text-gray-600 text-lg">Popular destinations for your next adventure</p>
            </button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading trails...</p>
              </div>
            </div>
          ) : filteredMountains.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⛰️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No trails found</h3>
              <p className="text-gray-600">
                {cityQuery ? 'Try adjusting your search or browse all trails.' : 'No mountains available yet.'}
              </p>
              {cityQuery && (
                <button
                  onClick={clearSearch}
                  className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Search Results Summary */}
              {cityQuery && (
                <div className="text-center">
                  <p className="text-gray-600">
                    Found <span className="font-semibold text-orange-600">{filteredMountains.length}</span> trail{filteredMountains.length !== 1 ? 's' : ''} 
                    {filteredCalabarzon.length > 0 && filteredBeyond.length > 0 && (
                      <span> ({filteredCalabarzon.length} in CALABARZON, {filteredBeyond.length} beyond)</span>
                    )}
                  </p>
                </div>
              )}
              
              {/* CALABARZON Results */}
              {filteredCalabarzon.length > 0 && (
                <div>
                  {cityQuery && (
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">CALABARZON Trails</h3>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredCalabarzon.slice(0, cityQuery ? filteredCalabarzon.length : 4).map((mountain) => (
                      <div key={mountain.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="relative h-44 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 overflow-hidden">
                          {mountain.image_url ? (
                            <img 
                              src={mountain.image_url} 
                              alt={mountain.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-white text-6xl opacity-50">⛰️</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-gray-900 text-lg mb-3">{mountain.name}</h3>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">📍</span>
                              <span>Location: <span className="font-medium text-gray-900">{mountain.location}</span></span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">📏</span>
                              <span>Elevation: <span className="font-medium text-gray-900">{mountain.elevation.toLocaleString()}m</span></span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">⚡</span>
                              <span>Difficulty: <span className={`font-semibold ${
                                mountain.difficulty === 'Easy' ? 'text-green-600' :
                                mountain.difficulty === 'Moderate' ? 'text-yellow-600' :
                                mountain.difficulty === 'Hard' ? 'text-orange-600' :
                                'text-red-600'
                              }`}>{mountain.difficulty}</span></span>
                            </div>
                          </div>
                          <button 
                            onClick={() => navigate(`/mountains/${mountain.id}`)}
                            className="w-full px-4 py-2.5 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                          >
                            Explore
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Beyond CALABARZON Results */}
              {filteredBeyond.length > 0 && (
                <div>
                  {cityQuery && (
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Beyond CALABARZON</h3>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredBeyond.slice(0, cityQuery ? filteredBeyond.length : 4).map((mountain) => (
                      <div key={mountain.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="relative h-44 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 overflow-hidden">
                          {mountain.image_url ? (
                            <img 
                              src={mountain.image_url} 
                              alt={mountain.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-white text-6xl opacity-50">⛰️</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-gray-900 text-lg mb-3">{mountain.name}</h3>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">📍</span>
                              <span>Location: <span className="font-medium text-gray-900">{mountain.location}</span></span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">📏</span>
                              <span>Elevation: <span className="font-medium text-gray-900">{mountain.elevation.toLocaleString()}m</span></span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">⚡</span>
                              <span>Difficulty: <span className={`font-semibold ${
                                mountain.difficulty === 'Easy' ? 'text-green-600' :
                                mountain.difficulty === 'Moderate' ? 'text-yellow-600' :
                                mountain.difficulty === 'Hard' ? 'text-orange-600' :
                                'text-red-600'
                              }`}>{mountain.difficulty}</span></span>
                            </div>
                          </div>
                          <button 
                            onClick={() => navigate(`/mountains/${mountain.id}`)}
                            className="w-full px-4 py-2.5 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                          >
                            Explore
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="text-center mt-12">
            <a href="/explore" className="inline-block px-8 py-3 rounded-full text-sm font-semibold bg-white border-2 border-gray-200 hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm hover:shadow-md">
              See more trails
            </a>
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-8">
          {[
            {title:'Safety Tips',text:'Hydrate, pace yourself, and check weather before heading out. Always inform someone of your plans.',icon:'🛡️'},
            {title:'Leave No Trace',text:'Pack out all trash, stay on marked trails, and respect wildlife and cultural sites.',icon:'🌿'}
          ].map((b)=>(
            <div key={b.title} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all">
              <div className="grid md:grid-cols-2 gap-8 items-center p-8">
                <div className="h-48 md:h-64 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <div className="text-8xl opacity-20">{b.icon}</div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{b.title}</h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-6">{b.text}</p>
                  <button 
                    onClick={() => navigate('/guides')}
                    className="px-6 py-3 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all"
                  >
                    Read more
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Home;


