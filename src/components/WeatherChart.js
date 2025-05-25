// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const WeatherChart = ({ city, unit }) => {
//   const [chartData, setChartData] = useState(null);

//   useEffect(() => {
//     const fetchWeatherHistory = async () => {
//       try {
//         const apiKey = 'a5bf6ac8ac0090d3526edfd4909f0830'; // Replace with your actual API key
//         const response = await fetch(
//           `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`
//         );
//         const data = await response.json();

//         const now = new Date();
//         const temperatures = [];
//         const dates = [];

//         for (let i = 5; i >= 1; i--) {
//           dates.push(new Date(now.getTime() - i * 86400000).toLocaleDateString());
//           const variation = (Math.random() * 4 - 2).toFixed(1); // +/- 2 degrees
//           temperatures.push((data.main.temp + parseFloat(variation)).toFixed(1));
//         }

//         dates.push(now.toLocaleDateString());
//         temperatures.push(data.main.temp.toFixed(1));

//         const unitLabel = unit === 'metric' ? '°C' : '°F';

//         setChartData({
//           labels: dates,
//           datasets: [
//             {
//               label: `Temperature (${unitLabel})`,
//               data: temperatures,
//               fill: false,
//               backgroundColor: 'rgba(75,192,192,0.4)',
//               borderColor: 'rgba(75,192,192,1)',
//               tension: 0.2,
//             },
//           ],
//         });
//       } catch (error) {
//         console.error('Error fetching weather data:', error);
//       }
//     };

//     if (city) {
//       fetchWeatherHistory();
//     }
//   }, [city, unit]);

//   if (!chartData) {
//     return <p>Loading chart...</p>;
//   }

//   return (
//     <div style={{ maxWidth: '600px', margin: '20px auto' }}>
//       <Line
//         data={chartData}
//         options={{
//           responsive: true,
//           plugins: {
//             legend: { position: 'top' },
//             title: { display: true, text: `Temperature Trend for ${city}` },
//           },
//         }}
//       />
//     </div>
//   );
// };

// export default WeatherChart;

// WeatherChart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeatherChart = ({ city }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchWeatherHistory = async () => {
      try {
        const apiKey = 'a5bf6ac8ac0090d3526edfd4909f0830'; // Replace with your actual API key

        // Always fetch data in metric (Celsius) for the chart
        const unit = 'metric';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`
        );
        const data = await response.json();

        const now = new Date();
        const temperatures = [];
        const dates = [];

        for (let i = 5; i >= 1; i--) {
          dates.push(new Date(now.getTime() - i * 86400000).toLocaleDateString());
          const variation = (Math.random() * 4 - 2).toFixed(1); // Simulated +/-2°C
          temperatures.push((data.main.temp + parseFloat(variation)).toFixed(1));
        }

        dates.push(now.toLocaleDateString());
        temperatures.push(data.main.temp.toFixed(1));

        setChartData({
          labels: dates,
          datasets: [
            {
              label: `Temperature (°C)`,
              data: temperatures,
              fill: false,
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              tension: 0.2,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    if (city) {
      fetchWeatherHistory();
    }
  }, [city]);

  if (!chartData) {
    return <p>Loading chart...</p>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: `Temperature Trend for ${city}` },
          },
        }}
      />
    </div>
  );
};

export default WeatherChart;
