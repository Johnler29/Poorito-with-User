const express = require('express');
const router = express.Router();

// Mock weather data for development/testing
const mockWeatherData = {
  location: {
    name: "Manila",
    country: "PH",
    coordinates: {
      lat: 14.5995,
      lon: 120.9842
    }
  },
  current: {
    temperature: 28,
    feelsLike: 32,
    humidity: 75,
    pressure: 1013,
    visibility: 10,
    windSpeed: 15,
    windDirection: 180,
    description: "partly cloudy",
    icon: "02d",
    main: "Clouds"
  },
  timestamp: new Date().toISOString()
};

const mockForecastData = {
  location: {
    name: "Manila",
    country: "PH",
    coordinates: {
      lat: 14.5995,
      lon: 120.9842
    }
  },
  forecast: [
    {
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      temperature: 29,
      feelsLike: 33,
      humidity: 70,
      pressure: 1012,
      windSpeed: 12,
      windDirection: 190,
      description: "sunny",
      icon: "01d",
      main: "Clear",
      precipitation: 0
    },
    {
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      temperature: 27,
      feelsLike: 31,
      humidity: 80,
      pressure: 1014,
      windSpeed: 18,
      windDirection: 170,
      description: "light rain",
      icon: "10d",
      main: "Rain",
      precipitation: 2.5
    },
    {
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      temperature: 26,
      feelsLike: 30,
      humidity: 85,
      pressure: 1015,
      windSpeed: 20,
      windDirection: 160,
      description: "heavy rain",
      icon: "09d",
      main: "Rain",
      precipitation: 8.0
    },
    {
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      temperature: 30,
      feelsLike: 34,
      humidity: 65,
      pressure: 1011,
      windSpeed: 14,
      windDirection: 200,
      description: "clear sky",
      icon: "01d",
      main: "Clear",
      precipitation: 0
    },
    {
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      temperature: 31,
      feelsLike: 35,
      humidity: 60,
      pressure: 1010,
      windSpeed: 16,
      windDirection: 210,
      description: "few clouds",
      icon: "02d",
      main: "Clouds",
      precipitation: 0
    }
  ],
  timestamp: new Date().toISOString()
};

// Get current weather by coordinates (mock)
router.get('/current/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    res.json({
      success: true,
      data: {
        ...mockWeatherData,
        location: {
          ...mockWeatherData.location,
          coordinates: {
            lat: parseFloat(lat),
            lon: parseFloat(lon)
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching mock weather:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch weather data'
    });
  }
});

// Get current weather by city name (mock)
router.get('/current/city/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const { country } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    res.json({
      success: true,
      data: {
        ...mockWeatherData,
        location: {
          name: city,
          country: country || "PH",
          coordinates: mockWeatherData.location.coordinates
        }
      }
    });
  } catch (error) {
    console.error('Error fetching mock weather by city:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch weather data'
    });
  }
});

// Get 5-day weather forecast (mock)
router.get('/forecast/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    res.json({
      success: true,
      data: {
        ...mockForecastData,
        location: {
          ...mockForecastData.location,
          coordinates: {
            lat: parseFloat(lat),
            lon: parseFloat(lon)
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching mock forecast:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch weather forecast'
    });
  }
});

// Get weather alerts (mock)
router.get('/alerts/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    res.json({
      success: true,
      data: {
        alerts: [
          {
            sender_name: "Philippine Atmospheric, Geophysical and Astronomical Services Administration",
            event: "Heavy Rainfall Warning",
            description: "Heavy rainfall expected in the next 6 hours. Please take necessary precautions.",
            start: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            end: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
          }
        ],
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching mock alerts:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch weather alerts'
    });
  }
});

module.exports = router;
