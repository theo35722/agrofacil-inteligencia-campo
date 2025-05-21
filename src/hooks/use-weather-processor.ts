
import { useState, useEffect } from 'react';

// Define the type for weather day data used in the UI
type WeatherDay = {
  day: string;
  icon: "sun" | "cloud" | "cloud-sun" | "cloud-rain";
  temperature: string;
  description: string;
  rainChance?: number;
  wind?: number;
};

// Interface to define what the source weather data looks like
interface WeatherSourceData {
  current: {
    temperature: string;
    description: string;
    icon: string;
    humidity: number;
  };
  forecast: Array<{
    date: string;
    dayOfWeek: string;
    icon: string;
    temperature: {
      min: number;
      max: number;
    };
    humidity: number;
    wind: number;
    rainChance: number;
    description?: string;
    recommendation?: string;
  }>;
}

// Interface for the processed weather data that will be returned
interface ProcessedWeatherData {
  forecast: WeatherDay[];
  currentWeather: {
    temperature: string;
    description: string;
    icon: string;
    humidity: number;
  } | null;
  recommendation: string | undefined;
}

/**
 * Custom hook to process weather data into a format suitable for UI components
 */
export function useWeatherProcessor(weatherData: WeatherSourceData | null) {
  const [processedData, setProcessedData] = useState<ProcessedWeatherData>({
    forecast: [],
    currentWeather: null,
    recommendation: undefined
  });

  // Update processed data when source data changes
  useEffect(() => {
    if (!weatherData) return;

    const updatedForecast: WeatherDay[] = [];
    
    // Process today and add to forecast
    if (weatherData.forecast && weatherData.forecast.length > 0) {
      const today = weatherData.forecast[0];
      updatedForecast.push({
        day: "Hoje",
        icon: mapIconToType(today.icon),
        temperature: `${Math.round(today.temperature.max)}°C`,
        description: today.description || "Sem descrição",
        rainChance: today.rainChance,
        wind: today.wind
      });

      // Add the next two days if available
      for (let i = 1; i < Math.min(3, weatherData.forecast.length); i++) {
        const day = weatherData.forecast[i];
        let dayLabel = "Amanhã";
        if (i === 2) {
          // Get day of week for the third day
          const date = new Date();
          date.setDate(date.getDate() + 2);
          const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'short' });
          dayLabel = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1, 3);
        }
        
        updatedForecast.push({
          day: dayLabel,
          icon: mapIconToType(day.icon),
          temperature: `${Math.round(day.temperature.max)}°C`,
          description: day.description || "Sem descrição",
          rainChance: day.rainChance,
          wind: day.wind
        });
      }
    }

    setProcessedData({
      forecast: updatedForecast,
      currentWeather: weatherData.current ? {
        temperature: weatherData.current.temperature,
        description: weatherData.current.description,
        icon: weatherData.current.icon,
        humidity: weatherData.current.humidity
      } : null,
      recommendation: weatherData.forecast?.[0]?.recommendation
    });
  }, [weatherData]);

  return processedData;
}

// Helper function to map OpenWeather icon to our icon types
export const mapIconToType = (iconCode: string): "sun" | "cloud" | "cloud-sun" | "cloud-rain" => {
  if (!iconCode) return "cloud-sun";
  
  if (iconCode.includes("01")) return "sun"; // clear sky
  if (iconCode.includes("02") || iconCode.includes("03")) return "cloud-sun"; // few/scattered clouds
  if (iconCode.includes("04")) return "cloud"; // broken clouds
  if (iconCode.includes("09") || iconCode.includes("10") || iconCode.includes("11")) return "cloud-rain"; // rain/thunder
  
  return "cloud-sun";
};
