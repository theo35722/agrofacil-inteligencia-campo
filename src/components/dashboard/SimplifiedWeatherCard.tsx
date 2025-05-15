
import { Sun } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useEffect, useState } from "react";

export const SimplifiedWeatherCard = () => {
  const location = useGeolocation();
  const [locationName, setLocationName] = useState<string>("Obtendo localização...");
  
  // Dados simplificados de clima
  const weatherData = {
    current: {
      temperature: "28°C",
      description: "Ensolarado"
    },
    tomorrow: {
      high: "30°",
      low: "21°"
    }
  };

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

  return (
    <Card className="border border-gray-100 shadow-sm bg-white">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <Sun className="h-14 w-14 text-yellow-500" />
          
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
  );
};
