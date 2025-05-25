// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherChart from './components/WeatherChart';

import './App.css';

const API_KEY = 'a5bf6ac8ac0090d3526edfd4909f0830';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [unit, setUnit] = useState('metric');

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  const fetchWeather = async () => {
    if (!city) return;
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
      );
      setWeather(response.data);
      const { coord } = response.data;
      fetchHistoricalData(coord.lat, coord.lon);
    } catch (err) {
      alert('Error fetching weather. Check the city name.');
      console.error(err);
    }
  };

  const fetchHistoricalData = async (lat, lon) => {
    const oneDayInSec = 86400;
    const now = Math.floor(Date.now() / 1000);
    const promises = [];

    for (let i = 1; i <= 5; i++) {
      const timestamp = now - i * oneDayInSec;
      promises.push(
        axios.get(
          `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestamp}&appid=${API_KEY}&units=${unit}`
        )
      );
    }

    try {
      const results = await Promise.all(promises);
      const formatted = results.map((res) => {
        const firstHour = res.data.data?.[0];
        return {
          dt: firstHour?.dt || 0,
          temp: firstHour?.temp || 0,
        };
      });
      setHistoricalData(formatted.reverse());
    } catch (err) {
      console.error('Error fetching historical data', err);
    }
  };

  useEffect(() => {
    if (city) {
      fetchWeather();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  const formatTime = (timestamp, timezone) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toUTCString().split(' ')[4]; // returns HH:MM:SS
  };

  return (
    <div className="app-container">
      <h1>Weather App ⛅</h1>
      <div className="input-group">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />
        <button onClick={fetchWeather}>Search</button>
        <button onClick={toggleUnit}>
          {unit === 'metric' ? '°F' : '°C'}
        </button>
      </div>

      {weather && (
        <div className="weather-box">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="icon"
          />
          <p>{weather.weather[0].description}</p>
          <p>
            🌡 Temperature: {weather.main.temp}°{unit === 'metric' ? 'C' : 'F'}
          </p>
          <p>
            💨 Wind: {weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}
          </p>
          <p>
            🌅 Sunrise: {formatTime(weather.sys.sunrise, weather.timezone)}
          </p>
          <p>
            🌇 Sunset: {formatTime(weather.sys.sunset, weather.timezone)}
          </p>
        </div>
      )}
      {weather && <WeatherChart city={weather.name} />}

      {historicalData.length > 0 && (
        <WeatherChart data={historicalData} unit={unit} />
      )}
    </div>
  );
}

export default App;
