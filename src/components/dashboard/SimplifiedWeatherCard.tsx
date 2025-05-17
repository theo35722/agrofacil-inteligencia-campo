
import React from "react";
import { WeatherCard } from "./weather/WeatherCard";

export const SimplifiedWeatherCard = ({ onWeatherDataChange }: { 
  onWeatherDataChange?: (data: {
    description: string;
    humidity: number;
  } | null) => void 
}) => {
  return <WeatherCard onWeatherDataChange={onWeatherDataChange} />;
};
