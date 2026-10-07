const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// GET /weather?city=CityName
// Uses Open-Meteo (free, no API key required):
//  1. Geocoding API to turn city name -> lat/lon
//  2. Forecast API to get current weather for that lat/lon
app.get('/weather', async (req, res) => {
  const { city } = req.query;

  if (!city || !city.trim()) {
    return res.status(400).json({ error: 'city query param is required' });
  }

  try {
    // Step 1: Geocode the city name
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return res.status(404).json({ error: `City "${city}" not found` });
    }

    const { latitude, longitude, name, country, admin1 } = geoData.results[0];

    // Step 2: Get current weather for that location
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
    );
    const weatherData = await weatherRes.json();

    res.json({
      location: {
        name,
        region: admin1 || '',
        country
      },
      current: weatherData.current
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(PORT, () => {
  console.log(`Weather backend running on http://localhost:${PORT}`);
});
