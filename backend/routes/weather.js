const express = require('express');
const router = express.Router();

// OpenWeatherMap API configuration
const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const OPENWEATHERMAP_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Helper function to make requests to OpenWeatherMap API
async function fetchWeatherData(endpoint, params = {}) {
  if (!OPENWEATHERMAP_API_KEY) {
    throw new Error('OpenWeatherMap API key not configured');
  }

  const url = new URL(`${OPENWEATHERMAP_BASE_URL}${endpoint}`);
  url.searchParams.append('appid', OPENWEATHERMAP_API_KEY);
  url.searchParams.append('units', 'metric'); // Use Celsius
  
  // Add additional parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenWeatherMap API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Weather API request failed:', error);
    throw error;
  }
}

// Get current weather by city name
router.get('/current/city/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const { country } = req.query; // Optional country code
    
    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }

    const params = { q: city };
    if (country) {
      params.q += `,${country}`;
    }

    const weatherData = await fetchWeatherData('/weather', params);

    // Transform the data to include only what we need
    const transformedData = {
      location: {
        name: weatherData.name,
        country: weatherData.sys.country,
        coordinates: {
          lat: weatherData.coord.lat,
          lon: weatherData.coord.lon
        }
      },
      current: {
        temperature: Math.round(weatherData.main.temp),
        feelsLike: Math.round(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        visibility: weatherData.visibility ? Math.round(weatherData.visibility / 1000) : null,
        windSpeed: weatherData.wind ? Math.round(weatherData.wind.speed * 3.6) : null,
        windDirection: weatherData.wind ? weatherData.wind.deg : null,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        main: weatherData.weather[0].main
      },
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: transformedData
    });
  } catch (error) {
    console.error('Error fetching current weather by city:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch weather data'
    });
  }
});

// Get current weather by coordinates
router.get('/current/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const weatherData = await fetchWeatherData('/weather', {
      lat: parseFloat(lat),
      lon: parseFloat(lon)
    });

    // Transform the data to include only what we need
    const transformedData = {
      location: {
        name: weatherData.name,
        country: weatherData.sys.country,
        coordinates: {
          lat: weatherData.coord.lat,
          lon: weatherData.coord.lon
        }
      },
      current: {
        temperature: Math.round(weatherData.main.temp),
        feelsLike: Math.round(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        visibility: weatherData.visibility ? Math.round(weatherData.visibility / 1000) : null, // Convert to km
        windSpeed: weatherData.wind ? Math.round(weatherData.wind.speed * 3.6) : null, // Convert m/s to km/h
        windDirection: weatherData.wind ? weatherData.wind.deg : null,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        main: weatherData.weather[0].main
      },
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: transformedData
    });
  } catch (error) {
    console.error('Error fetching current weather:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch weather data'
    });
  }
});

// Get 5-day weather forecast by coordinates
router.get('/forecast/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const forecastData = await fetchWeatherData('/forecast', {
      lat: parseFloat(lat),
      lon: parseFloat(lon)
    });

    // Transform the forecast data
    const transformedData = {
      location: {
        name: forecastData.city.name,
        country: forecastData.city.country,
        coordinates: {
          lat: forecastData.city.coord.lat,
          lon: forecastData.city.coord.lon
        }
      },
      forecast: forecastData.list.map(item => ({
        date: new Date(item.dt * 1000).toISOString(),
        temperature: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        windSpeed: item.wind ? Math.round(item.wind.speed * 3.6) : null,
        windDirection: item.wind ? item.wind.deg : null,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        main: item.weather[0].main,
        precipitation: item.rain ? item.rain['3h'] : (item.snow ? item.snow['3h'] : 0)
      })),
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: transformedData
    });
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch weather forecast'
    });
  }
});

// Get weather alerts (if available)
router.get('/alerts/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const alertData = await fetchWeatherData('/onecall', {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      exclude: 'current,minutely,hourly,daily'
    });

    res.json({
      success: true,
      data: {
        alerts: alertData.alerts || [],
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching weather alerts:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch weather alerts'
    });
  }
});

module.exports = router;
