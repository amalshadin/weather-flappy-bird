import { useState, useEffect } from 'react';
import { WeatherData } from '../types';
import { WeatherService } from '../services/weatherService';

export function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await WeatherService.getWeatherByLocation();
      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return {
    weatherData,
    loading,
    error,
    refetch: fetchWeather,
  };
}