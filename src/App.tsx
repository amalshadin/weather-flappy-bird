import React from 'react';
import { MapPin, RefreshCw, AlertCircle, Gamepad2 } from 'lucide-react';
import { useWeather } from './hooks/useWeather';
import { getGameConfigFromWeather, DEFAULT_CONFIG } from './utils/gameUtils';
import FlappyBirdGame from './components/FlappyBirdGame';
import WeatherDisplay from './components/WeatherDisplay';

function App() {
  const { weatherData, loading, error, refetch } = useWeather();

  const gameConfig = weatherData ? getGameConfigFromWeather(weatherData) : DEFAULT_CONFIG;

  return (
    <div 
      className="min-h-screen p-4"
      style={{ background: gameConfig.theme.background }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Gamepad2 className="w-8 h-8 text-white" />
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              Weather Flappy Bird
            </h1>
          </div>
          <p className="text-white/90 text-lg drop-shadow">
            A dynamic Flappy Bird game that adapts to your local weather conditions
          </p>
        </div>

        {/* Weather Section */}
        <div className="mb-6">
          {loading && (
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-center gap-3">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Getting your weather data...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-red-800">Weather Error</h3>
              </div>
              <p className="text-red-700 mb-4">{error}</p>
              <div className="space-y-2 text-sm text-red-600">
                <p>• Make sure you have enabled location services</p>
                <p>• Check that you have a valid OpenWeather API key</p>
                <p>• Verify your internet connection</p>
              </div>
              <button
                onClick={refetch}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}

          {weatherData && (
            <WeatherDisplay 
              weatherData={weatherData} 
              weatherEffect={gameConfig.weatherEffect}
            />
          )}
        </div>

        {/* Game Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-2xl">
          <FlappyBirdGame gameConfig={gameConfig} />
        </div>

        {/* API Setup Notice */}
        {error && error.includes('API') && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">Setup Required</span>
            </div>
            <p className="text-yellow-700 text-sm">
              To use weather features, you need to:
            </p>
            <ol className="list-decimal list-inside text-yellow-700 text-sm mt-2 space-y-1">
              <li>Get a free API key from <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="underline">OpenWeather</a></li>
              <li>Replace 'YOUR_OPENWEATHER_API_KEY' in src/services/weatherService.ts</li>
              <li>Refresh the page</li>
            </ol>
            <p className="text-yellow-700 text-sm mt-2">
              Without weather data, the game runs with default settings.
            </p>
          </div>
        )}

        {/* Game Rules */}
        <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">How Weather Affects the Game</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-medium text-blue-600 mb-1">☀️ Clear/Sunny</h4>
              <p>Perfect conditions - Normal difficulty</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-600 mb-1">🌧️ Rain</h4>
              <p>Increased gravity - Harder to fly</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-600 mb-1">❄️ Snow</h4>
              <p>Reduced gravity - Easier flying</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-600 mb-1">⛈️ Thunderstorm</h4>
              <p>Maximum difficulty - Extreme weather!</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-600 mb-1">🌫️ Fog/Mist</h4>
              <p>Moderate difficulty with misty theme</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-600 mb-1">☁️ Cloudy</h4>
              <p>Slightly harder with closer pipes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;