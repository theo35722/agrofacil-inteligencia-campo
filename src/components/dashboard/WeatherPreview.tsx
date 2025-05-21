
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun } from "lucide-react";
import { useWeatherFetch } from "@/hooks/use-weather-fetch";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { WeatherPreviewLoading } from "./weather/WeatherPreviewLoading";
import { WeatherPreviewError } from "./weather/WeatherPreviewError";
import { WeatherPreviewContent } from "./weather/WeatherPreviewContent";

type WeatherDay = {
  day: string;
  icon: "sun" | "cloud" | "cloud-sun" | "cloud-rain";
  temperature: string;
  description: string;
};

interface WeatherPreviewProps {
  onWeatherDataChange?: (data: {
    description: string;
    humidity: number;
  } | null) => void;
}

export const WeatherPreview = ({ onWeatherDataChange }: WeatherPreviewProps) => {
  const { weatherData, loading, error, refetch, locationName: fetchedLocation } = useWeatherFetch();
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [locationName, setLocationName] = useState<string>("Obtendo localização...");

  // Update weather data when it changes
  useEffect(() => {
    if (weatherData) {
      const updatedForecast: WeatherDay[] = [];
      
      // Process today and add to forecast
      if (weatherData.forecast && weatherData.forecast.length > 0) {
        const today = weatherData.forecast[0];
        updatedForecast.push({
          day: "Hoje",
          icon: mapIconToType(today.icon),
          temperature: `${Math.round(today.temperature.max)}°C`,
          description: today.description || "Sem descrição",
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
          });
        }
      }
      
      setForecast(updatedForecast);
      
      // Notify parent component about weather data
      if (onWeatherDataChange && weatherData.current) {
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

  // Helper function to map OpenWeather icon to our icon types
  const mapIconToType = (iconCode: string): "sun" | "cloud" | "cloud-sun" | "cloud-rain" => {
    if (!iconCode) return "cloud-sun";
    
    if (iconCode.includes("01")) return "sun"; // clear sky
    if (iconCode.includes("02") || iconCode.includes("03")) return "cloud-sun"; // few/scattered clouds
    if (iconCode.includes("04")) return "cloud"; // broken clouds
    if (iconCode.includes("09") || iconCode.includes("10") || iconCode.includes("11")) return "cloud-rain"; // rain/thunder
    
    return "cloud-sun";
  };

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
          {weatherData?.current && (
            <WeatherPreviewContent
              currentWeather={{
                description: weatherData.current.description,
                temperature: weatherData.current.temperature,
                icon: weatherData.current.icon
              }}
              forecast={forecast}
              locationName={locationName}
              recommendation={weatherData.forecast?.[0]?.recommendation}
            />
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
