import { GameConfig, WeatherData } from '../types';

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const PIPE_WIDTH = 80;
export const BIRD_RADIUS = 15;

export const DEFAULT_CONFIG: GameConfig = {
  gravity: 0.6,
  jumpStrength: -10,
  pipeGap: 200,
  pipeSpeed: 2,
  theme: {
    background: 'linear-gradient(135deg, #87CEEB 0%, #98D8E8 100%)',
    bird: '#FFD700',
    pipe: '#32CD32',
    text: '#2C3E50',
    accent: '#3498DB',
  },
  weatherEffect: 'Clear sky',
};

export function getGameConfigFromWeather(weatherData: WeatherData): GameConfig {
  const weatherMain = weatherData.weather[0]?.main.toLowerCase() || 'clear';
  const weatherId = weatherData.weather[0]?.id || 800;
  
  let config: GameConfig = { ...DEFAULT_CONFIG };
  
  switch (weatherMain) {
    case 'rain':
    case 'drizzle':
      config = {
        ...config,
        gravity: 0.8,
        jumpStrength: -12,
        pipeGap: 160,
        pipeSpeed: 4,
        theme: {
          background: 'linear-gradient(135deg, #4A90E2 0%, #5A7FBB 100%)',
          bird: '#E74C3C',
          pipe: '#2C3E50',
          text: '#FFFFFF',
          accent: '#3498DB',
        },
        weatherEffect: 'Rainy weather - Increased gravity!',
      };
      break;
      
    case 'snow':
      config = {
        ...config,
        gravity: 0.4,
        jumpStrength: -8,
        pipeGap: 220,
        pipeSpeed: 2.5,
        theme: {
          background: 'linear-gradient(135deg, #E8F4F8 0%, #B8D4E3 100%)',
          bird: '#E67E22',
          pipe: '#34495E',
          text: '#2C3E50',
          accent: '#3498DB',
        },
        weatherEffect: 'Snowy weather - Reduced gravity!',
      };
      break;
      
    case 'thunderstorm':
      config = {
        ...config,
        gravity: 0.9,
        jumpStrength: -14,
        pipeGap: 140,
        pipeSpeed: 4,
        theme: {
          background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
          bird: '#F39C12',
          pipe: '#1A252F',
          text: '#FFFFFF',
          accent: '#E74C3C',
        },
        weatherEffect: 'Thunderstorm - Maximum difficulty!',
      };
      break;
      
    case 'fog':
    case 'mist':
    case 'haze':
      config = {
        ...config,
        gravity: 0.5,
        jumpStrength: -9,
        pipeGap: 180,
        pipeSpeed: 3.5,
        theme: {
          background: 'linear-gradient(135deg, #BDC3C7 0%, #95A5A6 100%)',
          bird: '#9B59B6',
          pipe: '#7F8C8D',
          text: '#2C3E50',
          accent: '#8E44AD',
        },
        weatherEffect: 'Foggy weather - Limited visibility!',
      };
      break;
      
    case 'clouds':
      if (weatherId >= 801 && weatherId <= 804) {
        config = {
          ...config,
          gravity: 0.7,
          jumpStrength: -11,
          pipeGap: 170,
          pipeSpeed: 3.5,
          theme: {
            background: 'linear-gradient(135deg, #95A5A6 0%, #7F8C8D 100%)',
            bird: '#E67E22',
            pipe: '#34495E',
            text: '#FFFFFF',
            accent: '#D35400',
          },
          weatherEffect: 'Cloudy weather - Moderate difficulty',
        };
      }
      break;
      
    default: // clear
      config = {
        ...config,
        weatherEffect: `Clear weather in ${weatherData.name} - Perfect flying conditions!`,
        theme: {
          ...config.theme,
          background: 'linear-gradient(135deg, #87CEEB 0%, #FFD700 100%)',
        },
      };
  }
  
  return config;
}

export function checkCollision(bird: { x: number; y: number; radius: number }, pipes: any[]): boolean {
  // Check ground and ceiling collision
  if (bird.y + bird.radius >= CANVAS_HEIGHT || bird.y - bird.radius <= 0) {
    return true;
  }
  
  // Check pipe collision
  for (const pipe of pipes) {
    // Check if bird is horizontally within pipe bounds
    if (
      bird.x + bird.radius > pipe.x &&
      bird.x - bird.radius < pipe.x + PIPE_WIDTH
    ) {
      // Check if bird is vertically colliding with pipe
      if (
        bird.y - bird.radius < pipe.topHeight ||
        bird.y + bird.radius > CANVAS_HEIGHT - pipe.bottomHeight
      ) {
        return true;
      }
    }
  }
  
  return false;
}

export function generatePipe(x: number, gapSize: number) {
  const minHeight = 50;
  const maxHeight = CANVAS_HEIGHT - gapSize - minHeight;
  const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
  const bottomHeight = CANVAS_HEIGHT - topHeight - gapSize;
  
  return {
    x,
    topHeight,
    bottomHeight,
    width: PIPE_WIDTH,
    passed: false,
  };
}