import React from 'react';
import WeatherWidget from '../../components/WeatherWidget';
import LandscapeView from '../../components/LandscapeView';

function Guides() {
  const sections = [
    {
      title: 'Trip planning',
      items: ['Pick a route that matches your ability', 'Check weather and advisories', 'Arrange transport and permits'],
    },
    {
      title: 'Gear essentials',
      items: ['Footwear with grip', 'First-aid + blister care', 'Layers, rain shell, thermal'],
    },
    {
      title: 'Emergency readiness',
      items: ['Share itinerary & ETA', 'Carry whistle and headlamp', 'Know local emergency numbers'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Guides</h1>
      <p className="text-gray-600 mt-2">Step-by-step references to help you plan safe and memorable hikes.</p>

      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {sections.map((s) => (
          <div key={s.title} className="bg-white border border-gray-100 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900">{s.title}</h3>
            <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
              {s.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 grid lg:grid-cols-4 gap-8">
        {/* Landscape View - Takes up 3/4 of the space */}
        <div className="lg:col-span-3">
          <LandscapeView className="h-full min-h-[600px] w-full" />
        </div>
        
        {/* Weather Widget - Takes up 1/4 of the space */}
        <div className="lg:col-span-1">
          <WeatherWidget 
            city="Davao" 
            country="PH" 
            showForecast={true}
            className="h-full"
          />
        </div>
      </div>
      
      {/* Leave No Trace section moved below */}
      <div className="mt-12">
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="font-extrabold text-gray-900 mb-4">Leave No Trace (LNT)</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Plan Ahead & Prepare</h3>
              <p className="text-sm text-gray-600">Research your route, check weather conditions, and pack appropriately for your adventure.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Travel & Camp on Durable Surfaces</h3>
              <p className="text-sm text-gray-600">Stay on established trails and camp in designated areas to minimize environmental impact.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Dispose of Waste Properly</h3>
              <p className="text-sm text-gray-600">Pack out all trash, including food scraps and hygiene products. Leave no trace behind.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Leave What You Find</h3>
              <p className="text-sm text-gray-600">Preserve the natural environment by not taking rocks, plants, or other natural objects.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Minimize Campfire Impacts</h3>
              <p className="text-sm text-gray-600">Use a camp stove for cooking and only build fires in designated fire rings when permitted.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Respect Wildlife</h3>
              <p className="text-sm text-gray-600">Observe wildlife from a distance and never feed animals. Store food securely.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Guides;


