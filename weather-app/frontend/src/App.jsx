import React, { useState } from 'react';

const API_URL = '/api';

// Open-Meteo WMO weather codes -> emoji + description
const WEATHER_CODES = {
  0: { desc: 'Clear sky', icon: '☀️' },
  1: { desc: 'Mainly clear', icon: '🌤️' },
  2: { desc: 'Partly cloudy', icon: '⛅' },
  3: { desc: 'Overcast', icon: '☁️' },
  45: { desc: 'Fog', icon: '🌫️' },
  48: { desc: 'Depositing rime fog', icon: '🌫️' },
  51: { desc: 'Light drizzle', icon: '🌦️' },
  53: { desc: 'Moderate drizzle', icon: '🌦️' },
  55: { desc: 'Dense drizzle', icon: '🌧️' },
  61: { desc: 'Slight rain', icon: '🌧️' },
  63: { desc: 'Moderate rain', icon: '🌧️' },
  65: { desc: 'Heavy rain', icon: '🌧️' },
  71: { desc: 'Slight snow', icon: '🌨️' },
  73: { desc: 'Moderate snow', icon: '🌨️' },
  75: { desc: 'Heavy snow', icon: '❄️' },
  80: { desc: 'Rain showers', icon: '🌦️' },
  95: { desc: 'Thunderstorm', icon: '⛈️' },
  96: { desc: 'Thunderstorm with hail', icon: '⛈️' }
};

function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { desc: 'Unknown', icon: '🌡️' };
}

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const searchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const res = await fetch(`${API_URL}/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Kuch galat ho gaya');
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError('Backend se connect nahi ho pa raha. Kya backend chal raha hai?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🌦️ Weather App</h1>

      <form onSubmit={searchWeather} className="weather-form">
        <input
          type="text"
          placeholder="Shehar ka naam likhein (e.g. Mumbai)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Search ho raha hai...' : 'Search'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>
            {weather.location.name}
            {weather.location.region ? `, ${weather.location.region}` : ''}
          </h2>
          <p className="country">{weather.location.country}</p>

          <div className="weather-main">
            <span className="icon">{getWeatherInfo(weather.current.weather_code).icon}</span>
            <span className="temp">{weather.current.temperature_2m}°C</span>
          </div>
          <p className="desc">{getWeatherInfo(weather.current.weather_code).desc}</p>

          <div className="weather-details">
            <div>
              <span className="label">Humidity</span>
              <span>{weather.current.relative_humidity_2m}%</span>
            </div>
            <div>
              <span className="label">Wind Speed</span>
              <span>{weather.current.wind_speed_10m} km/h</span>
            </div>
          </div>
        </div>
      )}

      {!weather && !error && !loading && (
        <p className="hint">Kisi bhi shehar ka naam likhkar weather dekhein.</p>
      )}
    </div>
  );
}

export default App;
