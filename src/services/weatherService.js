import axios from "axios";

const API_KEY = "a5bf6ac8ac0090d3526edfd4909f0830";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const getCurrentWeather = async (city, unit = "metric") => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: unit, // Supports both metric and imperial
      },
    });
    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    throw error;
  }
};
