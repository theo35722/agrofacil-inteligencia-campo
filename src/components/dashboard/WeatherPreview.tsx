
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun } from "lucide-react";
import { useWeatherFetch } from "@/hooks/use-weather-fetch";
import { useWeatherProcessor } from "@/hooks/use-weather-processor";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { WeatherPreviewLoading } from "./weather/WeatherPreviewLoading";
import { WeatherPreviewError } from "./weather/WeatherPreviewError";
import { WeatherPreviewContent } from "./weather/WeatherPreviewContent";

interface WeatherPreviewProps {
  onWeatherDataChange?: (data: {
    description: string;
    humidity: number;
  } | null) => void;
}

export const WeatherPreview = ({ onWeatherDataChange }: WeatherPreviewProps) => {
  const { weatherData, loading, error, refetch, locationName: fetchedLocation } = useWeatherFetch();
  const { currentWeather, recommendation } = useWeatherProcessor(weatherData);
  const [locationName, setLocationName] = useState<string>("Obtendo localização...");

  // Update weather data when it changes
  useEffect(() => {
    if (weatherData?.current) {
      // Notify parent component about weather data
      if (onWeatherDataChange) {
        onWeatherDataChange({
          description: weatherData.current.description,
          humidity: Number(weatherData.current.humidity) || 0
        });
      }
    }
  }, [weatherData, onWeatherDataChange]);
  
  // Update location name from fetched data
  useEffect(() => {
    if (fetchedLocation) {
      setLocationName(fetchedLocation);
    }
  }, [fetchedLocation]);

  // Handle retry button click
  const handleRetry = () => {
    refetch();
    toast.info("Atualizando previsão do tempo...");
  };

  // If loading, show loading state
  if (loading) {
    return <WeatherPreviewLoading />;
  }

  // If error, show error state with retry button
  if (error) {
    return <WeatherPreviewError onRetry={handleRetry} />;
  }

  // Main render with weather data
  return (
    <Link to="/clima" className="block">
      <Card className="agro-card hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-agro-green-800 flex justify-between items-center">
            <span>Previsão do Tempo</span>
            <CloudSun className="h-5 w-5 text-agro-blue-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentWeather && (
            <WeatherPreviewContent
              currentWeather={currentWeather}
              locationName={locationName}
              recommendation={recommendation}
            />
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
