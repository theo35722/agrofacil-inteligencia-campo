
import { MapPin, RefreshCw, CalendarDays, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { toast } from "sonner";
import { TodayForecast } from "@/components/weather/TodayForecast";
import { DailyForecast } from "@/components/weather/DailyForecast";
import { ActivityRecommendations } from "@/components/weather/ActivityRecommendations";
import { LocationErrorAlert } from "@/components/weather/LocationErrorAlert";
import { WeatherFetchAlert } from "@/components/weather/WeatherFetchAlert";
import { WeatherDay, ActivityRecommendation } from "@/types/weather";

const Weather = () => {
  const location = useGeolocation();
  const [selectedLocation, setSelectedLocation] = useState<string>("Carregando localização...");
  const [locationFetchError, setLocationFetchError] = useState<string | null>(null);
  const [view, setView] = useState<string>("forecast");
  
  // Mock data for demo
  const forecast: WeatherDay[] = [
    {
      date: "14/05/2025",
      dayOfWeek: "Hoje",
      icon: "sun",
      temperature: { min: 22, max: 28 },
      humidity: 45,
      wind: 10,
      rainChance: 0,
      soilMoisture: 62,
      uvIndex: 7,
      recommendation: "Dia ideal para aplicação de defensivos. Baixa umidade e vento moderado."
    },
    {
      date: "15/05/2025",
      dayOfWeek: "Amanhã",
      icon: "cloud-rain",
      temperature: { min: 19, max: 24 },
      humidity: 85,
      wind: 15,
      rainChance: 80,
      soilMoisture: 78,
      uvIndex: 3,
      recommendation: "Evite pulverizar - alta chance de chuva que pode lavar os produtos aplicados."
    },
    {
      date: "16/05/2025",
      dayOfWeek: "Terça",
      icon: "cloud-drizzle",
      temperature: { min: 18, max: 23 },
      humidity: 75,
      wind: 12,
      rainChance: 60,
      soilMoisture: 75,
      uvIndex: 4,
    },
    {
      date: "17/05/2025",
      dayOfWeek: "Quarta",
      icon: "cloud-sun",
      temperature: { min: 20, max: 26 },
      humidity: 65,
      wind: 8,
      rainChance: 20,
      soilMoisture: 70,
      uvIndex: 6,
    },
    {
      date: "18/05/2025",
      dayOfWeek: "Quinta",
      icon: "sun",
      temperature: { min: 21, max: 29 },
      humidity: 50,
      wind: 5,
      rainChance: 0,
      soilMoisture: 65,
      uvIndex: 8,
    },
  ];
  
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

  // Efeito para obter o nome da localização quando as coordenadas são carregadas
  useEffect(() => {
    if (location.latitude && location.longitude) {
      setLocationFetchError(null);
      // Aqui estamos usando a API de Geocoding Reversa para obter o nome da localização
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro na resposta: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || "Local não identificado";
          const state = data.address?.state || "";
          setSelectedLocation(`${city}, ${state}`);
          toast.success("Localização obtida com sucesso");
        })
        .catch((error) => {
          console.error("Erro ao buscar nome da localização:", error);
          setLocationFetchError("Não foi possível obter o nome da sua localização");
          setSelectedLocation(`Lat: ${location.latitude.toFixed(4)}, Lon: ${location.longitude.toFixed(4)}`);
          toast.error("Erro ao buscar nome da localização");
        });
    }
  }, [location.latitude, location.longitude]);

  // Efeito para mostrar erro de localização
  useEffect(() => {
    if (location.error) {
      toast.error("Erro ao obter localização", {
        description: location.error,
      });
      setSelectedLocation("Localização não disponível");
    }
  }, [location.error]);

  const handleRetryLocation = () => {
    toast.info("Tentando obter localização novamente...");
    setSelectedLocation("Carregando localização...");
    location.retryGeolocation();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-agro-green-800 mb-2">
            Previsão do Tempo
          </h1>
          <p className="text-gray-600">
            Condições climáticas e recomendações para suas atividades agrícolas
          </p>
          <div className="flex items-center mt-2">
            <MapPin className="h-4 w-4 mr-1 text-agro-blue-600" />
            <span className="text-sm text-agro-blue-600">
              {selectedLocation}
              {(location.error || locationFetchError) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRetryLocation}
                  className="ml-2 h-6 px-2 text-xs text-agro-blue-600"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Tentar novamente
                </Button>
              )}
            </span>
          </div>
        </div>
        
        <div className="space-x-2">
          <Button 
            variant={view === "forecast" ? "default" : "outline"}
            onClick={() => setView("forecast")}
            className={view === "forecast" ? "bg-agro-green-500 hover:bg-agro-green-600" : ""}
          >
            <CalendarDays className="h-4 w-4 mr-2" />
            Previsão
          </Button>
          <Button 
            variant={view === "activities" ? "default" : "outline"}
            onClick={() => setView("activities")}
            className={view === "activities" ? "bg-agro-green-500 hover:bg-agro-green-600" : ""}
          >
            <Sun className="h-4 w-4 mr-2" />
            Atividades
          </Button>
        </div>
      </div>
      
      {location.error && (
        <LocationErrorAlert 
          error={location.error}
          permissionDenied={location.permissionDenied}
          onRetry={handleRetryLocation}
        />
      )}

      {locationFetchError && !location.error && (
        <WeatherFetchAlert error={locationFetchError} />
      )}
      
      <TodayForecast forecast={forecast[0]} location={selectedLocation} />
      
      {view === "forecast" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-agro-green-800">Próximos dias</h2>
          
          {forecast.slice(1).map((day, index) => (
            <DailyForecast key={index} day={day} />
          ))}
        </div>
      )}
      
      {view === "activities" && (
        <ActivityRecommendations recommendations={activityRecommendations} />
      )}
    </div>
  );
};

export default Weather;
