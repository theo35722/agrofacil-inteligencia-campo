
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeatherData } from "@/hooks/use-weather-data";
import { useReverseGeocoding } from "@/hooks/use-reverse-geocoding";
import { useGeolocation } from "@/hooks/use-geolocation";
import { CloudSun, MapPin } from "lucide-react";
import { WeatherIcon } from "@/components/weather/WeatherIcon";
import { WeatherLoading } from "@/components/weather/WeatherLoading";
import { Link } from "react-router-dom";

export const SimplifiedWeatherCard = ({ onWeatherDataChange }: { 
  onWeatherDataChange?: (data: {
    description: string;
    humidity: number;
  } | null) => void 
}) => {
  const location = useGeolocation();
  const { 
    data, 
    isLoading, 
    isError,
    locationError
  } = useWeatherData();
  
  const { locationName } = useReverseGeocoding(
    location.latitude, 
    location.longitude
  );

  // Use ref to track if weather data has been sent to parent
  const dataWasSent = useRef(false);
  
  // Efeito para notificar o componente pai sobre alterações nos dados do tempo
  useEffect(() => {
    if (data?.current?.description && onWeatherDataChange && !dataWasSent.current) {
      console.log("Sending weather data to dashboard:", {
        description: data.current.description,
        humidity: data.current.humidity || 0
      });
      
      onWeatherDataChange({
        description: data.current.description,
        humidity: data.current.humidity || 0
      });
      
      // Mark that we've sent the data to prevent infinite updates
      dataWasSent.current = true;
    } else if (!data && onWeatherDataChange && !dataWasSent.current) {
      onWeatherDataChange(null);
      dataWasSent.current = true;
    }
  }, [data, onWeatherDataChange]);

  // Função para determinar a mensagem de alerta agrícola
  const getAgriculturalAlert = () => {
    if (!data || !data.forecast || data.forecast.length < 2) return "";
    
    const todayIcon = data.forecast[0].icon;
    const tomorrowIcon = data.forecast[1].icon;
    const todayRainChance = data.forecast[0].rainChance;
    const tomorrowRainChance = data.forecast[1].rainChance;
    
    // Verificar se hoje ou amanhã tem previsão de chuva
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

  // Verificação de carregamento
  if (isLoading || location.loading) {
    return (
      <Card className="agro-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-agro-green-800 flex justify-between items-center">
            <span>Previsão do Tempo</span>
            <CloudSun className="h-5 w-5 text-agro-blue-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WeatherLoading simplified />
        </CardContent>
      </Card>
    );
  }

  // Verificação de erro ou dados ausentes
  if (isError || !data || !data.forecast || data.forecast.length === 0) {
    return (
      <Card className="agro-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-agro-green-800 flex justify-between items-center">
            <span>Previsão do Tempo</span>
            <CloudSun className="h-5 w-5 text-agro-blue-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">N/A</p>
              <p className="text-sm text-gray-500">Dados indisponíveis</p>
              <p className="text-sm text-gray-500">Amanhã: -- / --</p>
            </div>
            <div className="h-12 w-12 text-gray-300">
              <WeatherIcon icon="cloud" className="h-12 w-12" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Verificar erro de localização
  if (locationError || location.error) {
    return (
      <Card className="agro-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-agro-green-800 flex justify-between items-center">
            <span>Previsão do Tempo</span>
            <CloudSun className="h-5 w-5 text-agro-blue-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-amber-600">
            <p>Erro ao obter localização</p>
            <p className="text-sm mt-1">Verifique as permissões de localização</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Extrair dados do clima do primeiro dia (hoje)
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
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center mb-2">
                <span className="text-2xl font-bold">{today.temperature.max}°C</span>
                <span className="text-sm text-gray-500 ml-2">
                  {today.temperature.min}°C / {today.temperature.max}°C
                </span>
              </div>
              
              {locationName && (
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{locationName}</span>
                </div>
              )}
              
              <p className="text-sm mb-2">{data.current?.description || "Condições atuais"}</p>
            </div>
            
            <WeatherIcon icon={today.icon} className="h-16 w-16" />
          </div>
          
          <div className={`mt-2 p-2 rounded-md ${
            agriculturalAlert.includes("Alerta")
              ? "bg-amber-50 text-amber-800"
              : "bg-green-50 text-green-800"
          }`}>
            <p className="text-sm font-medium">
              {agriculturalAlert}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
