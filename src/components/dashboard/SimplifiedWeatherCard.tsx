
import { Sun, CloudRain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { WeatherIcon } from "@/components/weather/WeatherIcon";
import { useWeatherData } from "@/hooks/use-weather-data";

export const SimplifiedWeatherCard = () => {
  const location = useGeolocation();
  const [locationName, setLocationName] = useState<string>("Obtendo localização...");
  const { data: weatherData, isLoading, isError } = useWeatherData();

  // Efeito para obter o nome da localização quando as coordenadas são carregadas
  useEffect(() => {
    if (location.latitude && location.longitude) {
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`)
        .then(response => response.json())
        .then(data => {
          const city = data.address?.city || data.address?.town || data.address?.village || "Local não identificado";
          setLocationName(city);
        })
        .catch(() => {
          setLocationName("Localização não disponível");
        });
    }
  }, [location.latitude, location.longitude]);

  // Componente de carregamento
  if (isLoading || location.loading) {
    return (
      <Link to="/clima" className="block">
        <Card className="border border-gray-100 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="text-right">
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Componente de erro
  if (isError || !weatherData) {
    return (
      <Link to="/clima" className="block">
        <Card className="border border-gray-100 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <CloudRain className="h-14 w-14 text-gray-400" />
              <div className="text-right">
                <div className="text-xl font-bold text-gray-500">Dados indisponíveis</div>
                <div className="text-sm text-gray-400">Toque para tentar novamente</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Obter o ícone do tempo atual do primeiro dia de previsão (hoje)
  const currentWeatherIcon = weatherData.forecast.length > 0 ? weatherData.forecast[0].icon : "sun";

  return (
    <Link to="/clima" className="block">
      <Card className="border border-gray-100 shadow-sm bg-white transition-all hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <WeatherIcon icon={currentWeatherIcon} className="h-14 w-14" />
            
            <div className="text-right">
              <div className="text-3xl font-bold">{weatherData.current.temperature}</div>
              <div className="text-gray-600">{weatherData.current.description}</div>
              <div className="text-sm text-gray-500 mt-1">
                Amanhã: {weatherData.tomorrow.high} • {weatherData.tomorrow.low}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
