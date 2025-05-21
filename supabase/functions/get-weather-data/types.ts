
export interface RequestBody {
  latitude: number;
  longitude: number;
}

export interface OpenWeatherResponse {
  current: {
    temperature: string;
    description: string;
    cityName: string;
    humidity: number;
    icon: "sun" | "cloud" | "cloud-sun" | "cloud-rain" | "cloud-drizzle";
  };
  tomorrow: {
    high: string;
    low: string;
  };
  forecast: WeatherDay[];
}

export interface WeatherDay {
  date: string;
  dayOfWeek: string;
  icon: "sun" | "cloud" | "cloud-sun" | "cloud-rain" | "cloud-drizzle";
  temperature: {
    min: number;
    max: number;
  };
  humidity: number;
  wind: number;
  rainChance: number;
  uvIndex?: number;
  recommendation?: string;
  description?: string;
}

export interface RawOpenWeatherCurrent {
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    icon: string;
    description: string;
  }[];
  wind: {
    speed: number;
  };
  name: string;
}

export interface RawOpenWeatherForecast {
  list: {
    dt: number;
    main: {
      temp: number;
      humidity: number;
    };
    weather: {
      icon: string;
      description: string;
    }[];
    wind: {
      speed: number;
    };
    pop: number;
  }[];
}
