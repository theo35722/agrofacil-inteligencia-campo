
import { Cloud, CloudRain, CloudSun, Sun, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type WeatherDay = {
  day: string;
  icon: "sun" | "cloud" | "cloud-sun" | "cloud-rain";
  temperature: string;
  description: string;
};

export const WeatherPreview = () => {
  const location = useGeolocation();
  const [locationName, setLocationName] = useState<string>("Obtendo localização...");
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
          
          toast.success("Localização obtida com sucesso!", {
            description: `${city}, ${state}`,
            duration: 3000,
          });
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

  const weatherIcons = {
    "sun": Sun,
    "cloud": Cloud,
    "cloud-sun": CloudSun,
    "cloud-rain": CloudRain,
  };

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
        
        <div className="mt-4 p-2 bg-agro-blue-50 border border-agro-blue-100 rounded-md">
          <p className="text-sm text-agro-blue-800">
            <strong>Dica:</strong> Evite pulverizar amanhã — alta chance de chuva.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
