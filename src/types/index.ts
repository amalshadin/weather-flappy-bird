export interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

export interface GameConfig {
  gravity: number;
  jumpStrength: number;
  pipeGap: number;
  pipeSpeed: number;
  theme: {
    background: string;
    bird: string;
    pipe: string;
    text: string;
    accent: string;
  };
  weatherEffect: string;
}

export interface Bird {
  x: number;
  y: number;
  velocity: number;
  radius: number;
}

export interface Pipe {
  x: number;
  topHeight: number;
  bottomHeight: number;
  width: number;
  passed: boolean;
}

export interface GameState {
  bird: Bird;
  pipes: Pipe[];
  score: number;
  isGameOver: boolean;
  isGameStarted: boolean;
  gameConfig: GameConfig;
}