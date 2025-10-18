import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function MountainDetailForm({ detail, onSave, onCancel, mountains }) {
  const [formData, setFormData] = useState({
    mountain_id: '',
    section_type: 'what_to_bring',
    item_name: '',
    item_description: '',
    item_icon: '',
    item_amount: '',
    item_unit: '',
    item_time: '',
    item_duration: '',
    item_transport_type: '',
    sort_order: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (detail) {
      setFormData({
        mountain_id: detail.mountain_id || '',
        section_type: detail.section_type || 'what_to_bring',
        item_name: detail.item_name || '',
        item_description: detail.item_description || '',
        item_icon: detail.item_icon || '',
        item_amount: detail.item_amount || '',
        item_unit: detail.item_unit || '',
        item_time: detail.item_time || '',
        item_duration: detail.item_duration || '',
        item_transport_type: detail.item_transport_type || '',
        sort_order: detail.sort_order || 0
      });
    }
  }, [detail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        mountain_id: parseInt(formData.mountain_id, 10), // Convert to number
        item_amount: formData.section_type === 'budgeting' ? parseFloat(formData.item_amount) : null,
        item_unit: formData.section_type === 'budgeting' ? formData.item_unit : null,
        item_icon: formData.section_type === 'what_to_bring' ? formData.item_icon : null,
        item_time: formData.section_type === 'itinerary' ? formData.item_time : null,
        item_duration: formData.section_type === 'itinerary' ? formData.item_duration : null,
        item_transport_type: formData.section_type === 'how_to_get_there' ? formData.item_transport_type : null
      };

      console.log('Submitting mountain detail:', submitData);

      if (detail) {
        console.log('Updating mountain detail with ID:', detail.id);
        await apiService.updateMountainDetail(detail.id, submitData);
      } else {
        console.log('Creating new mountain detail');
        await apiService.createMountainDetail(submitData);
      }

      console.log('Mountain detail saved successfully');
      onSave();
    } catch (err) {
      console.error('Error saving mountain detail:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError(err.message || 'Failed to save mountain detail');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {detail ? 'Edit Mountain Detail' : 'Add Mountain Detail'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mountain *
            </label>
            <select
              name="mountain_id"
              value={formData.mountain_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            >
              <option value="">Select a mountain</option>
              {mountains.map(mountain => (
                <option key={mountain.id} value={mountain.id}>
                  {mountain.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Type *
            </label>
            <select
              name="section_type"
              value={formData.section_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            >
              <option value="what_to_bring">What to Bring</option>
              <option value="budgeting">Budgeting</option>
              <option value="itinerary">Itinerary</option>
              <option value="how_to_get_there">How to Get There</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              required
              placeholder="Enter item name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="item_description"
              value={formData.item_description}
              onChange={handleChange}
              placeholder="Enter item description"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
          </div>

          {formData.section_type === 'what_to_bring' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon (Emoji)
              </label>
              <input
                type="text"
                name="item_icon"
                value={formData.item_icon}
                onChange={handleChange}
                placeholder="e.g., 🎒"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter an emoji to represent this item
              </p>
            </div>
          )}

          {formData.section_type === 'budgeting' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₱) *
                </label>
                <input
                  type="number"
                  name="item_amount"
                  value={formData.item_amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <input
                  type="text"
                  name="item_unit"
                  value={formData.item_unit}
                  onChange={handleChange}
                  placeholder="e.g., per person, per group"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>
            </>
          )}

          {formData.section_type === 'itinerary' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="text"
                  name="item_time"
                  value={formData.item_time}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 06:00 AM"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  name="item_duration"
                  value={formData.item_duration}
                  onChange={handleChange}
                  placeholder="e.g., 2-3 hours"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>
            </>
          )}

          {formData.section_type === 'how_to_get_there' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transport Type *
              </label>
              <select
                name="item_transport_type"
                value={formData.item_transport_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              >
                <option value="">Select transport type</option>
                <option value="private">Private Vehicle</option>
                <option value="public">Public Transportation</option>
                <option value="both">Both Options</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort Order
            </label>
            <input
              type="number"
              name="sort_order"
              value={formData.sort_order}
              onChange={handleChange}
              min="0"
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
            <p className="text-sm text-gray-500 mt-1">
              Lower numbers appear first
            </p>
          </div>

          <div className="flex space-x-3 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold text-white transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {loading ? 'Saving...' : (detail ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MountainDetailForm;
