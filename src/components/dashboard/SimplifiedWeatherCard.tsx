
import React from "react";
import { WeatherCard } from "./weather/WeatherCard";
import { WeatherFallback } from "./WeatherFallback";
import { useWeatherData } from "@/hooks/use-weather-data";

export const SimplifiedWeatherCard = ({ onWeatherDataChange }: { 
  onWeatherDataChange?: (data: {
    description: string;
    humidity: number;
  } | null) => void 
}) => {
  const { isError, error } = useWeatherData();
  
  // Se houver um erro crítico durante a inicialização, mostrar fallback
  if (isError && error instanceof Error && error.message.includes("crítico")) {
    return <WeatherFallback error="Serviço meteorológico indisponível" />;
  }
  
  return <WeatherCard onWeatherDataChange={onWeatherDataChange} />;
};
