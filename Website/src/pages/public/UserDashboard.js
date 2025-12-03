import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';

function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchBookings();
  }, []);

  const checkAuth = () => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role === 'admin') {
      navigate('/admin');
      return;
    }

    setUser(parsedUser);
  };

  const fetchBookings = async () => {
    try {
      const response = await apiService.getMyBookings();
      setBookings(response.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const openCancelModal = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    if (cancelLoading) return;
    setShowCancelModal(false);
    setBookingToCancel(null);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;

    try {
      setCancelLoading(true);
      await apiService.cancelBooking(bookingToCancel.id);
      await fetchBookings();
      closeCancelModal();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    localStorage.removeItem('user');
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img
                src="/poorito-logo.jpg"
                alt="Poorito"
                className="w-10 h-10 rounded-full mr-3"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mr-3';
                  fallback.innerHTML = '<span class="text-white font-bold text-xs">P</span>';
                  e.target.parentElement?.appendChild(fallback);
                }}
              />
              <h1 className="text-2xl font-bold text-gray-900">Poorito</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                <p className="text-sm text-gray-600">{user?.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h2>
          <p className="text-gray-600">Manage your trail bookings and explore new adventures</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/explore')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="text-3xl mb-3">🗺️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Explore Trails</h3>
            <p className="text-gray-600 text-sm">Discover new mountains and hiking trails</p>
          </button>

          <button
            onClick={() => navigate('/mountains')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="text-3xl mb-3">⛰️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Mountains</h3>
            <p className="text-gray-600 text-sm">Browse all available mountains</p>
          </button>

          <button
            onClick={() => navigate('/guides')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hiking Guides</h3>
            <p className="text-gray-600 text-sm">Learn tips and techniques</p>
          </button>
        </div>

        {/* Bookings Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">My Bookings</h3>
            <p className="text-sm text-gray-600">Manage your trail bookings</p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-red-500 mr-3">⚠️</div>
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              </div>
            )}

            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Yet</h4>
                <p className="text-gray-600 mb-6">Start exploring trails and book your first adventure!</p>
                <button
                  onClick={() => navigate('/explore')}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                >
                  Explore Trails
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          {booking.mountains?.image_url ? (
                            <img
                              src={booking.mountains.image_url}
                              alt={booking.mountains.name}
                              className="w-16 h-16 rounded-lg object-cover mr-4"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-4">
                              <span className="text-white text-2xl">⛰️</span>
                            </div>
                          )}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{booking.mountains?.name}</h4>
                            <p className="text-gray-600">{booking.mountains?.location}</p>
                            <div className="flex items-center mt-1">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                              <span className="ml-2 text-sm text-gray-500">
                                {booking.mountains?.difficulty} • {booking.mountains?.elevation}m
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <p><strong>Booking Date:</strong> {formatDate(booking.booking_date)}</p>
                          {booking.number_of_participants && (
                            <p><strong>Participants:</strong> {booking.number_of_participants} {booking.number_of_participants === 1 ? 'person' : 'people'}</p>
                          )}
                          <p><strong>Booked On:</strong> {formatDate(booking.created_at)}</p>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => navigate(`/receipt/${booking.id}`)}
                          className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          📄 View Receipt
                        </button>
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => openCancelModal(booking)}
                            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                          >
                            Cancel Booking
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/mountain/${booking.mountain_id}`)}
                          className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cancel Booking Modal */}
        {showCancelModal && bookingToCancel && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Cancel booking?</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    This will free up your slot on this trail and cannot be undone.
                  </p>
                </div>
                <button
                  onClick={closeCancelModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6 rounded-lg bg-gray-50 border border-gray-200 p-4 text-sm text-gray-700">
                <p className="font-semibold text-gray-900 mb-1">
                  {bookingToCancel.mountains?.name || 'Selected trail'}
                </p>
                <p>
                  <span className="font-medium">Booking Date:</span>{' '}
                  {formatDate(bookingToCancel.booking_date)}
                </p>
                {bookingToCancel.number_of_participants && (
                  <p className="mt-1">
                    <span className="font-medium">Participants:</span>{' '}
                    {bookingToCancel.number_of_participants}{' '}
                    {bookingToCancel.number_of_participants === 1 ? 'person' : 'people'}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeCancelModal}
                  disabled={cancelLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={cancelLoading}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
                >
                  {cancelLoading ? 'Cancelling...' : 'Yes, Cancel Booking'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
