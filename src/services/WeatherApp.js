import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherChart from './components/WeatherChart'; // Adjust the path if needed

const API_KEY = 'a5bf6ac8ac0090d3526edfd4909f0830';

const WeatherApp = () => {
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
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
      );
      setWeather(res.data);
      const { lat, lon } = res.data.coord;
      fetchHistoricalData(lat, lon);
    } catch (err) {
      alert('Failed to fetch weather');
      console.error(err);
    }
  };

  const fetchHistoricalData = async (lat, lon) => {
    const now = Math.floor(Date.now() / 1000);
    const oneDay = 86400;
    const promises = [];

    for (let i = 1; i <= 5; i++) {
      const dt = now - i * oneDay;
      const url = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dt}&appid=${API_KEY}&units=${unit}`;
      promises.push(axios.get(url));
    }

    try {
      const results = await Promise.all(promises);
      const data = results.map((res) => {
        const firstHour = res.data.data?.[0];
        return {
          dt: firstHour?.dt || 0,
          temp: firstHour?.temp || 0,
        };
      });
      setHistoricalData(data.reverse());
    } catch (err) {
      console.error('Failed to fetch historical data:', err);
    }
  };

  useEffect(() => {
    if (city) {
      fetchWeather();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h1>🌤 Weather App</h1>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>Get Weather</button>
      <button onClick={toggleUnit}>
        {unit === 'metric' ? '°F' : '°C'}
      </button>

      {weather && (
        <div style={{ marginTop: '20px' }}>
          <h2>{weather.name}</h2>
          <p>🌡 Temperature: {weather.main.temp}°{unit === 'metric' ? 'C' : 'F'}</p>
          <p>🌥 Description: {weather.weather[0].description}</p>
          <p>💨 Wind: {weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
        </div>
      )}

      {historicalData.length > 0 && (
        <WeatherChart data={historicalData} unit={unit} />
      )}
    </div>
  );
};

export default WeatherApp;
