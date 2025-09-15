import React from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Zap, Eye } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherDisplayProps {
  weatherData: WeatherData;
  weatherEffect: string;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData, weatherEffect }) => {
  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-6 h-6" />;
      case 'snow':
        return <CloudSnow className="w-6 h-6" />;
      case 'thunderstorm':
        return <Zap className="w-6 h-6" />;
      case 'fog':
      case 'mist':
      case 'haze':
        return <Eye className="w-6 h-6" />;
      case 'clouds':
        return <Cloud className="w-6 h-6" />;
      default:
        return <Sun className="w-6 h-6" />;
    }
  };

  const weather = weatherData.weather[0];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getWeatherIcon(weather.main)}
          <span className="font-semibold text-gray-800">
            {weatherData.name}, {weatherData.sys.country}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">
            {Math.round(weatherData.main.temp)}°C
          </div>
          <div className="text-sm text-gray-600 capitalize">
            {weather.description}
          </div>
        </div>
      </div>
      <div className="text-sm text-blue-600 font-medium bg-blue-50 rounded-md p-2">
        🎮 {weatherEffect}
      </div>
    </div>
  );
};

export default WeatherDisplay;