
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, CloudSun, Sun, MapPin, Loader2 } from "lucide-react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useWeatherFetch } from "@/hooks/use-weather-fetch";
import { toast } from "sonner";

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
  const location = useGeolocation();
  const [locationName, setLocationName] = useState<string>("Obtendo localização...");
  const { weatherData, loading, error, refetch } = useWeatherFetch();
  const [forecast, setForecast] = useState<WeatherDay[]>([
    {
      day: "Hoje",
      icon: "sun",
      temperature: "28°C",
      description: "Ensolarado",
    },
    {
      day: "Amanhã",
      icon: "cloud-rain",
      temperature: "22°C",
      description: "Chuva",
    },
    {
      day: "Ter",
      icon: "cloud-sun",
      temperature: "25°C",
      description: "Parcialmente nublado",
    },
  ]);

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

  // Efeito para obter o nome da localização quando as coordenadas são carregadas
  useEffect(() => {
    if (location.latitude && location.longitude) {
      // Aqui estamos usando a API de Geocoding Reversa para obter o nome da localização
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`)
        .then(response => response.json())
        .then(data => {
          const city = data.address?.city || data.address?.town || data.address?.village || "Local não identificado";
          const state = data.address?.state || "";
          setLocationName(`${city}, ${state}`);
        })
        .catch(() => {
          setLocationName("Não foi possível obter o local");
        });
    }
  }, [location.latitude, location.longitude]);

  // Efeito para mostrar erro de localização
  useEffect(() => {
    if (location.error) {
      toast.error("Erro ao obter localização", {
        description: location.error,
        duration: 5000,
      });
      setLocationName("Localização não disponível");
    }
  }, [location.error]);

  // Helper function to map OpenWeather icon to our icon types
  const mapIconToType = (iconCode: string): "sun" | "cloud" | "cloud-sun" | "cloud-rain" => {
    if (!iconCode) return "cloud-sun";
    
    if (iconCode.includes("01")) return "sun"; // clear sky
    if (iconCode.includes("02") || iconCode.includes("03")) return "cloud-sun"; // few/scattered clouds
    if (iconCode.includes("04")) return "cloud"; // broken clouds
    if (iconCode.includes("09") || iconCode.includes("10") || iconCode.includes("11")) return "cloud-rain"; // rain/thunder
    
    return "cloud-sun";
  };

  const weatherIcons = {
    "sun": Sun,
    "cloud": Cloud,
    "cloud-sun": CloudSun,
    "cloud-rain": CloudRain,
  };

  // Handle retry button click
  const handleRetry = () => {
    refetch();
    toast.info("Atualizando previsão do tempo...");
  };

  // If loading, show loading state
  if (loading) {
    return (
      <Card className="agro-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-agro-green-800 flex justify-between items-center">
            <span>Previsão do Tempo</span>
            <CloudSun className="h-5 w-5 text-agro-blue-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-8 w-8 text-agro-blue-500 animate-spin mb-3" />
            <p className="text-sm text-gray-600">Carregando previsão do tempo...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If error, show error state with retry button
  if (error) {
    return (
      <Card className="agro-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-agro-green-800 flex justify-between items-center">
            <span>Previsão do Tempo</span>
            <CloudSun className="h-5 w-5 text-agro-blue-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-4">
            <p className="text-gray-600 text-center mb-3">Não foi possível obter a previsão do tempo.</p>
            <button 
              className="bg-agro-blue-50 border border-agro-blue-200 text-agro-blue-600 px-3 py-1 rounded-md text-sm flex items-center"
              onClick={handleRetry}
            >
              <CloudSun className="h-4 w-4 mr-1" /> Tentar novamente
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="agro-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-agro-green-800 flex justify-between items-center">
          <div className="flex items-center">
            <span>Previsão do Tempo</span>
            {locationName !== "Obtendo localização..." && (
              <div className="flex items-center ml-2 text-sm font-normal text-agro-blue-500">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{locationName}</span>
              </div>
            )}
          </div>
          <CloudSun className="h-5 w-5 text-agro-blue-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          {forecast.map((day, index) => {
            const WeatherIcon = weatherIcons[day.icon];
            let colorClass = "text-agro-blue-500"; // Default
            
            if (day.icon === "sun") colorClass = "text-yellow-500";
            if (day.icon === "cloud-rain") colorClass = "text-agro-blue-600";
            
            return (
              <div key={index} className="flex flex-col items-center">
                <span className="text-sm font-medium text-gray-600">{day.day}</span>
                <WeatherIcon className={`h-10 w-10 my-2 ${colorClass}`} />
                <span className="font-semibold">{day.temperature}</span>
                <span className="text-xs text-gray-500">{day.description}</span>
              </div>
            );
          })}
        </div>
        
        {weatherData?.forecast?.[0]?.recommendation && (
          <div className="mt-4 p-2 bg-agro-blue-50 border border-agro-blue-100 rounded-md">
            <p className="text-sm text-agro-blue-800">
              <strong>Dica:</strong> {weatherData.forecast[0].recommendation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
