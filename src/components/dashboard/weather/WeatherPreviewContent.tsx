
import React from "react";
import { WeatherForecastDay } from "./WeatherForecastDay";

interface CurrentWeather {
  temperature: string;
  description: string;
  icon: string;
}

interface WeatherDayData {
  day: string;
  icon: "sun" | "cloud" | "cloud-sun" | "cloud-rain";
  temperature: string;
  description: string;
}

interface WeatherPreviewContentProps {
  currentWeather: CurrentWeather;
  forecast: WeatherDayData[];
  locationName: string;
  recommendation?: string;
}

export const WeatherPreviewContent: React.FC<WeatherPreviewContentProps> = ({
  currentWeather,
  forecast,
  locationName,
  recommendation
}) => {
  return (
    <div className="animate-fade-in">
      {/* Location */}
      <div className="mb-2">
        <span className="text-sm text-gray-600">{locationName}</span>
      </div>
      
      {/* Current weather */}
      <div className="mb-3">
        <div className="flex items-center mb-1">
          <span className="text-3xl font-semibold mr-2">{currentWeather.temperature}</span>
          <span className="text-gray-700">{currentWeather.description}</span>
        </div>
      </div>
      
      {/* Weather forecast */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {forecast.map((day, index) => (
          <WeatherForecastDay
            key={index}
            day={day.day}
            icon={day.icon}
            temperature={day.temperature}
          />
        ))}
      </div>
      
      {/* Recommendation banner if available */}
      {recommendation && (
        <div className="bg-agro-blue-50 text-agro-blue-700 text-sm p-2 rounded-md">
          <p>{recommendation}</p>
        </div>
      )}
    </div>
  );
};
