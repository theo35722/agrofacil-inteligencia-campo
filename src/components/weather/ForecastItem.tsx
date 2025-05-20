
import React from "react";

interface Temperature {
  min: number;
  max: number;
}

interface ForecastItemProps {
  title: string;
  temperature: Temperature;
  description: string;
  icon: string;
  rainChance: number;
  isCompact?: boolean;
}

export const ForecastItem: React.FC<ForecastItemProps> = ({
  title,
  temperature,
  description,
  icon,
  rainChance,
  isCompact = false
}) => {
  // Helper function to get the weather icon URL
  const getWeatherIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className={isCompact ? "text-lg font-bold" : "text-2xl font-bold"}>
          {temperature.max}°C
        </p>
        <p className="text-sm text-gray-500">Min: {temperature.min}°C</p>
        <p className="text-sm">{description}</p>
      </div>
      <div className="flex flex-col items-center">
        <img 
          src={getWeatherIconUrl(icon)} 
          alt={description} 
          className={isCompact ? "w-12 h-12" : "w-16 h-16"}
        />
        <span className="text-xs text-gray-500">
          {rainChance > 0 ? `${rainChance}% chuva` : "Sem chuva"}
        </span>
      </div>
    </div>
  );
};
