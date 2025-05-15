
import { useState, useEffect } from "react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { toast } from "sonner";
import { ActivityRecommendation } from "@/types/weather";
import { useWeatherData } from "@/hooks/use-weather-data";
import { WeatherHeader } from "@/components/weather/WeatherHeader";
import { WeatherViewToggle } from "@/components/weather/WeatherViewToggle";
import { WeatherContentManager } from "@/components/weather/WeatherContentManager";
import { useReverseGeocoding } from "@/hooks/use-reverse-geocoding";

const Weather = () => {
  const location = useGeolocation();
  const [view, setView] = useState<string>("forecast");
  const { data, isLoading, isError, refetch } = useWeatherData();
  const { 
    locationName: selectedLocation, 
    error: locationFetchError, 
    retryFetch: retryLocationFetch
  } = useReverseGeocoding(location.latitude, location.longitude);
  
  // Dados de atividades recomendadas (mantidos como mock por enquanto)
  const activityRecommendations: ActivityRecommendation[] = [
    {
      activity: "Aplicação de defensivos",
      status: "ideal",
      reason: "Condições climáticas favoráveis com baixa chance de chuva e vento moderado"
    },
    {
      activity: "Pulverização de fungicidas",
      status: "ideal",
      reason: "Baixa umidade relativa do ar e temperatura adequada"
    },
    {
      activity: "Semeadura",
      status: "caution",
      reason: "Umidade do solo adequada, mas prevista chuva nos próximos dias"
    },
    {
      activity: "Colheita",
      status: "ideal",
      reason: "Sem previsão de chuva nos próximos 3 dias"
    },
    {
      activity: "Irrigação",
      status: "avoid",
      reason: "Solo com boa umidade e previsão de chuva para amanhã"
    },
  ];

  // Efeito para mostrar erro de localização
  useEffect(() => {
    if (location.error) {
      toast.error("Erro ao obter localização", {
        description: location.error,
      });
    }
  }, [location.error]);

  const handleRetryLocation = () => {
    toast.info("Tentando obter localização novamente...");
    location.retryGeolocation();
  };

  const handleRefreshWeather = () => {
    toast.info("Atualizando dados meteorológicos...");
    refetch();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <WeatherHeader 
          selectedLocation={selectedLocation}
          locationError={location.error}
          locationFetchError={locationFetchError}
          onRetryLocation={locationFetchError ? retryLocationFetch : handleRetryLocation}
          isLoading={location.loading}
        />
        
        <WeatherViewToggle 
          view={view}
          setView={setView}
          onRefreshWeather={handleRefreshWeather}
          isLoading={isLoading}
        />
      </div>
      
      <WeatherContentManager 
        isLoading={isLoading || location.loading}
        isError={isError}
        locationError={location.error}
        locationFetchError={locationFetchError}
        permissionDenied={location.permissionDenied}
        view={view}
        selectedLocation={selectedLocation}
        data={data}
        activityRecommendations={activityRecommendations}
        onRetryLocation={handleRetryLocation}
        onRefreshWeather={handleRefreshWeather}
      />
    </div>
  );
};

export default Weather;
