import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function WeatherWidget({ lat, lon, city, country, showForecast = false, className = '', landscape = false }) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeatherData();
  }, [lat, lon, city, country]);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current weather
      let currentWeather;
      if (lat && lon) {
        currentWeather = await apiService.getCurrentWeatherByCoords(lat, lon);
      } else if (city) {
        // Map mountain locations to nearby major cities for weather data
        const cityMappings = {
          'Davao del Sur': 'Davao',
          'Davao': 'Davao',
          'Batangas': 'Batangas',
          'Laguna': 'Calamba',
          'Quezon': 'Lucena',
          'Rizal': 'Antipolo',
          'Cavite': 'Cavite',
          'Bulacan': 'Malolos',
          'Pampanga': 'San Fernando',
          'Zambales': 'Olongapo',
          'Bataan': 'Balanga',
          'Tarlac': 'Tarlac',
          'Nueva Ecija': 'Cabanatuan',
          'Aurora': 'Baler',
          'Nueva Vizcaya': 'Bayombong',
          'Quirino': 'Cabarroguis',
          'Isabela': 'Ilagan',
          'Cagayan': 'Tuguegarao',
          'Batanes': 'Basco',
          'Kalinga': 'Tabuk',
          'Apayao': 'Kabugao',
          'Abra': 'Bangued',
          'Mountain Province': 'Bontoc',
          'Ifugao': 'Lagawe',
          'Benguet': 'La Trinidad',
          'Ilocos Norte': 'Laoag',
          'Ilocos Sur': 'Vigan',
          'La Union': 'San Fernando',
          'Pangasinan': 'Lingayen',
          'Zambales': 'Iba',
          'Tarlac': 'Tarlac City',
          'Nueva Ecija': 'Cabanatuan City',
          'Aurora': 'Baler',
          'Nueva Vizcaya': 'Bayombong',
          'Quirino': 'Cabarroguis',
          'Isabela': 'Ilagan City',
          'Cagayan': 'Tuguegarao City',
          'Batanes': 'Basco',
          'Kalinga': 'Tabuk City',
          'Apayao': 'Kabugao',
          'Abra': 'Bangued',
          'Mountain Province': 'Bontoc',
          'Ifugao': 'Lagawe',
          'Benguet': 'La Trinidad',
          'Ilocos Norte': 'Laoag City',
          'Ilocos Sur': 'Vigan City',
          'La Union': 'San Fernando City',
          'Pangasinan': 'Lingayen'
        };

        // Try multiple city name variations for better matching
        const cityVariations = [
          city,
          city.split(',')[0].trim(), // Remove any comma-separated parts
          city.split(' ')[0], // Just the first word
          city.replace(/\s+/g, ' ').trim(), // Clean up spaces
          cityMappings[city], // Try mapped city
          cityMappings[city.split(',')[0].trim()], // Try mapped city from first part
          'Manila' // Fallback to Manila
        ].filter(Boolean); // Remove any undefined values
        
        let weatherFound = false;
        for (const cityName of cityVariations) {
          if (!cityName) continue;
          
          try {
            currentWeather = await apiService.getCurrentWeatherByCity(cityName, country);
            weatherFound = true;
            break;
          } catch (cityError) {
            console.warn(`Weather not found for city: ${cityName}`, cityError.message);
            continue;
          }
        }
        
        if (!weatherFound) {
          throw new Error(`Weather data not available for "${city}". Showing weather for Manila instead.`);
        }
      } else {
        throw new Error('Either coordinates or city name is required');
      }

      setWeather(currentWeather.data);

      // Fetch forecast if requested
      if (showForecast && currentWeather.data.location.coordinates) {
        try {
          const forecastData = await apiService.getWeatherForecast(
            currentWeather.data.location.coordinates.lat,
            currentWeather.data.location.coordinates.lon
          );
          setForecast(forecastData.data);
        } catch (forecastError) {
          console.warn('Failed to fetch forecast:', forecastError);
          // Don't set error for forecast failure, just continue without it
        }
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🌤️</div>
          <p className="text-sm">Weather data unavailable</p>
          <p className="text-xs text-gray-400 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Current Weather */}
      <div className={landscape ? "mb-4" : "mb-6"}>
        {landscape ? (
          // Landscape Layout
          <div className="flex items-center justify-between">
            {/* Left: Location and Description */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {weather.location.name}, {weather.location.country}
              </h3>
              <p className="text-sm text-gray-500">
                {weather.current.description}
              </p>
            </div>
            
            {/* Center: Temperature and Icon */}
            <div className="flex items-center mx-6">
              <img 
                src={getWeatherIcon(weather.current.icon)} 
                alt={weather.current.description}
                className="w-12 h-12"
              />
              <div className="ml-3">
                <span className="text-3xl font-bold text-gray-900">
                  {weather.current.temperature}°C
                </span>
                <p className="text-sm text-gray-500">
                  Feels like {weather.current.feelsLike}°C
                </p>
              </div>
            </div>
            
            {/* Right: Weather Details */}
            <div className="flex space-x-4 text-sm">
              <div className="text-center">
                <div className="text-gray-500 text-xs mb-1">Humidity</div>
                <div className="font-semibold">{weather.current.humidity}%</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500 text-xs mb-1">Pressure</div>
                <div className="font-semibold">{weather.current.pressure} hPa</div>
              </div>
              {weather.current.windSpeed && (
                <div className="text-center">
                  <div className="text-gray-500 text-xs mb-1">Wind</div>
                  <div className="font-semibold">
                    {weather.current.windSpeed} km/h
                    {weather.current.windDirection && (
                      <span className="text-xs ml-1">
                        {getWindDirection(weather.current.windDirection)}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {weather.current.visibility && (
                <div className="text-center">
                  <div className="text-gray-500 text-xs mb-1">Visibility</div>
                  <div className="font-semibold">{weather.current.visibility} km</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Portrait Layout (original)
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {weather.location.name}, {weather.location.country}
                </h3>
                <p className="text-sm text-gray-500">
                  {weather.current.description}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center">
                  <img 
                    src={getWeatherIcon(weather.current.icon)} 
                    alt={weather.current.description}
                    className="w-12 h-12"
                  />
                  <span className="text-3xl font-bold text-gray-900 ml-2">
                    {weather.current.temperature}°C
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Feels like {weather.current.feelsLike}°C
                </p>
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-500 mb-1">Humidity</div>
                <div className="font-semibold">{weather.current.humidity}%</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-500 mb-1">Pressure</div>
                <div className="font-semibold">{weather.current.pressure} hPa</div>
              </div>
              {weather.current.windSpeed && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-500 mb-1">Wind</div>
                  <div className="font-semibold">
                    {weather.current.windSpeed} km/h
                    {weather.current.windDirection && (
                      <span className="text-xs ml-1">
                        {getWindDirection(weather.current.windDirection)}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {weather.current.visibility && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-500 mb-1">Visibility</div>
                  <div className="font-semibold">{weather.current.visibility} km</div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Forecast */}
      {showForecast && forecast && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">5-Day Forecast</h4>
          {landscape ? (
            // Landscape Forecast - Horizontal layout
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {forecast.forecast.slice(0, 5).map((day, index) => (
                <div key={index} className="flex-shrink-0 w-32 p-3 bg-gray-50 rounded-lg text-center">
                  <img 
                    src={getWeatherIcon(day.icon)} 
                    alt={day.description}
                    className="w-8 h-8 mx-auto mb-2"
                  />
                  <div className="font-medium text-xs mb-1">
                    {formatDate(day.date)}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {day.description}
                  </div>
                  <div className="font-semibold text-sm">
                    {day.temperature}°C
                  </div>
                  <div className="text-xs text-gray-500">
                    {day.humidity}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Portrait Forecast - Vertical layout (original)
            <div className="space-y-2">
              {forecast.forecast.slice(0, 5).map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <img 
                      src={getWeatherIcon(day.icon)} 
                      alt={day.description}
                      className="w-8 h-8 mr-3"
                    />
                    <div>
                      <div className="font-medium text-sm">
                        {formatDate(day.date)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {day.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">
                      {day.temperature}°C
                    </div>
                    <div className="text-xs text-gray-500">
                      {day.humidity}% humidity
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Last Updated */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">
          Last updated: {new Date(weather.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

export default WeatherWidget;
