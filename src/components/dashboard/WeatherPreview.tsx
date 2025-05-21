
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun } from "lucide-react";
import { useWeatherFetch } from "@/hooks/use-weather-fetch";
import { useWeatherProcessor, WeatherSourceData } from "@/hooks/use-weather-processor";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { WeatherPreviewLoading } from "./weather/WeatherPreviewLoading";
import { WeatherPreviewError } from "./weather/WeatherPreviewError";
import { WeatherPreviewContent } from "./weather/WeatherPreviewContent";
import { useIsMobile } from "@/hooks/use-mobile";

interface WeatherPreviewProps {
  onWeatherDataChange?: (data: {
    description: string;
    humidity: number;
  } | null) => void;
}

export const WeatherPreview = ({ onWeatherDataChange }: WeatherPreviewProps) => {
  const { weatherData, loading, error, refetch, locationName: fetchedLocation } = useWeatherFetch();
  const { currentWeather, recommendation, forecast } = useWeatherProcessor(weatherData as WeatherSourceData | null);
  const [locationName, setLocationName] = useState<string>("Obtendo localização...");
  const isMobile = useIsMobile();

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

  // Get today's forecast data for additional metrics
  const todayForecast = forecast && forecast.length > 0 ? forecast[0] : null;

  // Main render with weather data
  return (
    <Link to="/clima" className="block">
      <div className="flex justify-center">
        <Card className={`hover:shadow-md transition-shadow rounded-lg shadow-md ${isMobile ? 'max-w-[90%] mx-auto' : 'w-full'}`}>
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-agro-green-800 flex justify-between items-center text-lg">
              <span>Previsão do Tempo</span>
              <CloudSun className="h-5 w-5 text-agro-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {currentWeather && (
              <WeatherPreviewContent
                currentWeather={{
                  ...currentWeather,
                  rainChance: todayForecast?.rainChance,
                  wind: todayForecast?.wind
                }}
                locationName={locationName}
                recommendation={recommendation}
                showMetrics={true}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Link>
  );
};
