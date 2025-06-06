
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeatherData } from "@/hooks/use-weather-data";
import { useReverseGeocoding } from "@/hooks/use-reverse-geocoding";
import { useGeolocation } from "@/hooks/use-geolocation";
import { CloudSun } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { WeatherCardLoading } from "./WeatherCardLoading";
import { WeatherCardContent } from "./WeatherCardContent";
import { WeatherFallback } from "../WeatherFallback";
import { WeatherCardError } from "./WeatherCardError";

export interface WeatherCardProps {
  onWeatherDataChange?: (data: {
    description: string;
    humidity: number;
  } | null) => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ onWeatherDataChange }) => {
  const location = useGeolocation();
  const { 
    data, 
    isLoading, 
    isError,
    error,
    locationError,
    refetch
  } = useWeatherData();
  
  const { locationName } = useReverseGeocoding(
    location.latitude, 
    location.longitude
  );
  
  // Refetch data when component mounts
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isLoading) {
        console.log("Atualizando dados meteorológicos no montagem do componente");
        refetch();
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [refetch, isLoading]);

  // Effect for error toast
  useEffect(() => {
    if (isError && error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error("Erro na previsão do tempo", {
        description: errorMessage.includes("401") 
          ? "Erro de autenticação. Por favor, recarregue a página." 
          : "Não foi possível obter dados meteorológicos"
      });
      console.error("Erro na previsão do tempo:", errorMessage);
    }
  }, [isError, error]);

  // Notify parent component about weather data changes
  useEffect(() => {
    if (data?.current?.description && onWeatherDataChange) {
      const weatherInfo = {
        description: data.current.description,
        humidity: data.current.humidity || 0
      };
      
      console.log("Enviando dados meteorológicos para o dashboard:", weatherInfo);
      onWeatherDataChange(weatherInfo);
    } else if (!data && onWeatherDataChange) {
      onWeatherDataChange(null);
    }
  }, [data, onWeatherDataChange]);

  // Function to determine agricultural alert
  const getAgriculturalAlert = () => {
    if (!data || !data.forecast || data.forecast.length < 2) return "Monitorando condições para atividades agrícolas.";
    
    const todayIcon = data.forecast[0].icon;
    const tomorrowIcon = data.forecast[1].icon;
    const todayRainChance = data.forecast[0].rainChance;
    const tomorrowRainChance = data.forecast[1].rainChance;
    
    // Check for rain forecast
    if (
      todayIcon === "cloud-rain" || 
      todayIcon === "cloud-drizzle" || 
      tomorrowIcon === "cloud-rain" || 
      tomorrowIcon === "cloud-drizzle" ||
      todayRainChance > 50 ||
      tomorrowRainChance > 50
    ) {
      return "Alerta: Não recomendado pulverizar hoje.";
    } else {
      return "Bom dia para atividades agrícolas.";
    }
  };

  // Loading state
  if (isLoading || location.loading) {
    return <WeatherCardLoading />;
  }

  // Location error
  if (locationError || location.error) {
    return (
      <WeatherFallback error="Erro ao obter localização. Verifique as permissões." />
    );
  }

  // Error states
  if (isError || !data || !data.forecast || data.forecast.length === 0) {
    return (
      <WeatherCardError onRetry={() => refetch()} />
    );
  }

  // Extract today's forecast
  const today = data.forecast[0];
  const agriculturalAlert = getAgriculturalAlert();
  
  return (
    <Link to="/clima">
      <Card className="agro-card hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-agro-green-800 flex justify-between items-center">
            <div className="flex items-center">
              <span>Previsão do Tempo</span>
            </div>
            <CloudSun className="h-5 w-5 text-agro-blue-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WeatherCardContent 
            today={today} 
            locationName={locationName}
            agriculturalAlert={agriculturalAlert}
          />
        </CardContent>
      </Card>
    </Link>
  );
};
