const API_KEY = '450fabebe2a4a971d6d7d68056d7880e';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export class WeatherService {
  static async getCurrentLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
      );
    });
  }

  static async getWeatherData(lat: number, lon: number): Promise<any> {
    const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  static async getWeatherByLocation(): Promise<any> {
    try {
      const location = await this.getCurrentLocation();
      const weatherData = await this.getWeatherData(location.lat, location.lon);
      return weatherData;
    } catch (error) {
      console.error('Error getting weather by location:', error);
      throw error;
    }
  }
}