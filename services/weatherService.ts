import { WeatherData } from '../types';

// Belfast Coordinates
const BELFAST_LAT = 54.5973;
const BELFAST_LON = -5.9301;

export const fetchBelfastWeather = async (): Promise<WeatherData> => {
  try {
    // Open-Meteo API (Free, no key required for non-commercial use)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${BELFAST_LAT}&longitude=${BELFAST_LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,cloud_cover,is_day,weather_code&wind_speed_unit=ms`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    const current = data.current;

    return {
      temperature: current.temperature_2m,
      windSpeed: current.wind_speed_10m,
      humidity: current.relative_humidity_2m,
      cloudCover: current.cloud_cover,
      isDay: !!current.is_day,
      weatherCode: current.weather_code
    };
  } catch (error) {
    console.error("Weather Fetch Error:", error);
    // Fallback data in case API fails
    return {
      temperature: 12,
      windSpeed: 5,
      humidity: 75,
      cloudCover: 50,
      isDay: true,
      weatherCode: 3
    };
  }
};