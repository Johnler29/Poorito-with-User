import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import apiService from '../services/api';

function PublicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    apiService.logout();
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" onClick={scrollToTop} className="flex items-center space-x-3">
            <img
              src="/poorito-logo.jpg"
              alt="Poorito"
              className="h-12 w-12 object-contain rounded-full shadow-md"
              onError={(e)=>{
                e.currentTarget.style.display='none';
                const fallback=document.createElement('div');
                fallback.className='w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark shadow-md flex items-center justify-center';
                fallback.innerHTML='<span class="text-white font-bold text-sm">P</span>';
                e.currentTarget.parentElement?.prepend(fallback);
              }}
            />
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">Poorito</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-2 bg-gray-50/60 px-2 py-1 rounded-full shadow-sm border border-gray-100">
            <Link
              to="/"
              onClick={scrollToTop}
              className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                isActive('/')
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-700 hover:text-primary hover:bg-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              onClick={scrollToTop}
              className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                isActive('/explore')
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-700 hover:text-primary hover:bg-white'
              }`}
            >
              Explore
            </Link>
            <Link
              to="/guides"
              onClick={scrollToTop}
              className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                isActive('/guides')
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-700 hover:text-primary hover:bg-white'
              }`}
            >
              Guides
            </Link>
            <Link
              to="/about"
              onClick={scrollToTop}
              className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                isActive('/about')
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-700 hover:text-primary hover:bg-white'
              }`}
            >
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:block">{user.username}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setShowUserMenu(false);
                        scrollToTop();
                      }}
                    >
                      📊 Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  onClick={scrollToTop}
                  className="text-xs md:text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  onClick={scrollToTop}
                  className="text-xs md:text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center md:justify-between mb-6">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img
                src="/poorito-logo.jpg"
                alt="Poorito"
                className="h-10 w-10 object-contain rounded-full shadow-sm"
              />
              <span className="font-bold text-lg">Poorito</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Privacy</a>
              <a href="#" className="hover:text-gray-900">Terms</a>
              <a href="#" className="hover:text-gray-900">Contact</a>
              <Link to="/admin-login" className="hover:text-gray-900">Admin Portal</Link>
            </div>
          </div>
          <div className="text-center md:text-left text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Poorito. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;


