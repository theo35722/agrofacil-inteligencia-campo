
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useWeatherFetch } from "@/hooks/use-weather-fetch";
import { WeatherCardHeader } from "./WeatherCardHeader";
import { ForecastItem } from "./ForecastItem";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";

export interface NewWeatherCardProps {
  onWeatherDataChange?: (data: {
    description: string;
    humidity: number;
  } | null) => void;
}

export const NewWeatherCard = ({ onWeatherDataChange }: NewWeatherCardProps = {}) => {
  const { weatherData, loading, error, locationName } = useWeatherFetch();

  // Notify parent component about weather data changes
  useEffect(() => {
    if (onWeatherDataChange && weatherData?.current) {
      onWeatherDataChange({
        description: weatherData.current.description,
        humidity: weatherData.current.humidity || 0
      });
    } else if (onWeatherDataChange && error) {
      onWeatherDataChange(null);
    }
  }, [weatherData, error, onWeatherDataChange]);

  // Render loading state
  if (loading) {
    return <LoadingState />;
  }

  // Render error state
  if (error || !weatherData) {
    return <ErrorState message={error || "Não foi possível obter a previsão do tempo no momento."} />;
  }

  // Make sure forecast exists and has items before trying to access them
  const hasForecast = weatherData.forecast && weatherData.forecast.length > 0;
  
  // Extract data for today and tomorrow only if they exist
  const today = hasForecast ? weatherData.forecast[0] : null;
  const tomorrow = hasForecast && weatherData.forecast.length > 1 ? weatherData.forecast[1] : null;

  // If we don't have even today's forecast data, show an error
  if (!today) {
    return <ErrorState message="Dados de previsão incompletos. Tentando atualizar..." />;
  }

  return (
    <Card className="w-full bg-white shadow-md">
      <WeatherCardHeader locationName={locationName} />
      <CardContent>
        <div className="space-y-4">
          {/* Today's forecast */}
          <ForecastItem
            title="Hoje"
            temperature={today.temperature}
            description={today.description}
            icon={today.icon}
            rainChance={today.rainChance}
          />
          
          {/* Divider */}
          <div className="border-t border-gray-200 my-2"></div>
          
          {/* Tomorrow's forecast - only render if data exists */}
          {tomorrow && (
            <ForecastItem
              title="Amanhã"
              temperature={tomorrow.temperature}
              description={tomorrow.description}
              icon={tomorrow.icon}
              rainChance={tomorrow.rainChance}
              isCompact={true}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
