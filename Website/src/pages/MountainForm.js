import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MountainForm() {
  const navigate = useNavigate();
  const [images, setImages] = useState([null, null, null, null, null]);
  const [thingsToBring, setThingsToBring] = useState(['']);
  const [hikeItinerary, setHikeItinerary] = useState([{ title: '', description: '', location: '', time: '' }]);
  const [transportationGuides, setTransportationGuides] = useState([{ header: '', title: '', description: '' }]);
  const [reminders] = useState([{ description: '' }]);

  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...images];
        newImages[index] = reader.result;
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const addThingToBring = () => {
    setThingsToBring([...thingsToBring, '']);
  };

  const addHikeItinerary = () => {
    setHikeItinerary([...hikeItinerary, { title: '', description: '', location: '', time: '' }]);
  };

  const addTransportationGuide = () => {
    setTransportationGuides([...transportationGuides, { header: '', title: '', description: '' }]);
  };

  const handleSave = () => {
    console.log('Saving mountain data...');
    navigate('/mountains');
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Mountains</h1>
        <button 
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm font-medium"
          onClick={() => navigate('/mountains')}
        >
          ← Back to manage mountain
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide border-b pb-3">Title</h2>
        
        {/* Image Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <label htmlFor="image-0" className="cursor-pointer">
              {images[0] ? (
                <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden group">
                  <img src={images[0]} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => { e.preventDefault(); removeImage(0); }}
                  >
                    🗑️
                  </button>
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-blue-300 hover:border-primary transition-colors">
                  <div className="text-6xl mb-2">☁️</div>
                  <div className="text-6xl">⛰️</div>
                  <p className="text-gray-500 mt-4">Click to upload main image</p>
                </div>
              )}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(0, e)}
              className="hidden"
              id="image-0"
            />
          </div>
          
          <div className="space-y-4">
            {images.slice(1).map((image, index) => (
              <div key={index + 1}>
                <label htmlFor={`image-${index + 1}`} className="cursor-pointer">
                  {image ? (
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
                      <span className="text-3xl text-gray-400">+</span>
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(index + 1, e)}
                  className="hidden"
                  id={`image-${index + 1}`}
                />
              </div>
            ))}
            <div className="text-center text-sm text-gray-500 font-medium">3/5</div>
          </div>
        </div>

        <input 
          type="text" 
          placeholder="Mountain Name" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        />
        
        <textarea 
          placeholder="Description" 
          rows="4"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
        ></textarea>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            placeholder="Difficulty" 
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
          <input 
            type="text" 
            placeholder="Duration" 
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
          <input 
            type="text" 
            placeholder="Length" 
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Things to Bring</h3>
            {thingsToBring.map((item, index) => (
              <input 
                key={index}
                type="text" 
                placeholder="Item" 
                value={item}
                onChange={(e) => {
                  const newItems = [...thingsToBring];
                  newItems[index] = e.target.value;
                  setThingsToBring(newItems);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            ))}
            <button 
              onClick={addThingToBring}
              className="w-12 h-12 bg-gradient-to-r from-secondary to-green-600 hover:from-secondary hover:to-green-700 text-white rounded-lg text-2xl font-bold transition-all shadow-sm hover:shadow-md"
            >
              +
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Fees</h3>
            <input 
              type="text" 
              placeholder="Environmental Fee" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            <input 
              type="text" 
              placeholder="Registration Fee" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            <input 
              type="text" 
              placeholder="Guide/Camping Fee" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t">
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Hike Itinerary</h2>
          {hikeItinerary.map((item, index) => (
            <div key={index} className="space-y-3 p-6 bg-gray-50 rounded-lg">
              <input 
                type="text" 
                placeholder="Title" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input 
                  type="text" 
                  placeholder="Description" 
                  className="md:col-span-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white"
                />
                <input 
                  type="text" 
                  placeholder="Location" 
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white"
                />
                <input 
                  type="text" 
                  placeholder="Time" 
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white"
                />
              </div>
            </div>
          ))}
          <button 
            onClick={addHikeItinerary}
            className="w-12 h-12 bg-gradient-to-r from-secondary to-green-600 hover:from-secondary hover:to-green-700 text-white rounded-lg text-2xl font-bold transition-all shadow-sm hover:shadow-md"
          >
            +
          </button>
        </div>

        <div className="space-y-6 pt-6 border-t">
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Transportation Guide</h2>
          {transportationGuides.map((item, index) => (
            <div key={index} className="space-y-3 p-6 bg-gray-50 rounded-lg">
              <input 
                type="text" 
                placeholder="Header" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white"
              />
              <input 
                type="text" 
                placeholder="Title" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white"
              />
              <textarea 
                placeholder="Description" 
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none bg-white"
              ></textarea>
            </div>
          ))}
          <button 
            onClick={addTransportationGuide}
            className="w-12 h-12 bg-gradient-to-r from-secondary to-green-600 hover:from-secondary hover:to-green-700 text-white rounded-lg text-2xl font-bold transition-all shadow-sm hover:shadow-md"
          >
            +
          </button>
        </div>

        <div className="space-y-4 pt-6 border-t">
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Link</h2>
          <input 
            type="text" 
            placeholder="URL" 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        <div className="space-y-4 pt-6 border-t">
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Reminders</h2>
          {reminders.map((item, index) => (
            <div key={index} className="flex gap-3">
              <textarea 
                placeholder="Description" 
                rows="2"
                defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
              ></textarea>
              <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-6">
          <div className="w-48 aspect-video bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex flex-col items-center justify-center">
            <div className="text-4xl">☁️</div>
            <div className="text-4xl">⛰️</div>
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <button 
            onClick={handleSave}
            className="px-12 py-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
}

export default MountainForm;
