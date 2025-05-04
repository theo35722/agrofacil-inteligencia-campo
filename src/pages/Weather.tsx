
import { Cloud, CloudDrizzle, CloudRain, CloudSun, Sun, Wind, Droplet, Thermometer, CalendarDays, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { toast } from "sonner";

interface WeatherDay {
  date: string;
  dayOfWeek: string;
  icon: "sun" | "cloud" | "cloud-sun" | "cloud-rain" | "cloud-drizzle";
  temperature: { min: number; max: number };
  humidity: number;
  wind: number;
  rainChance: number;
  recommendation?: string;
  soilMoisture?: number;
  uvIndex?: number;
}

interface ActivityRecommendation {
  activity: string;
  status: "ideal" | "caution" | "avoid";
  reason: string;
}

const Weather = () => {
  const location = useGeolocation();
  const [selectedLocation, setSelectedLocation] = useState<string>("Carregando localização...");
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

  const weatherIcons = {
    "sun": Sun,
    "cloud": Cloud,
    "cloud-sun": CloudSun,
    "cloud-rain": CloudRain,
    "cloud-drizzle": CloudDrizzle,
  };

  // Efeito para obter o nome da localização quando as coordenadas são carregadas
  useEffect(() => {
    if (location.latitude && location.longitude) {
      // Aqui estamos usando a API de Geocoding Reversa para obter o nome da localização
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`)
        .then(response => response.json())
        .then(data => {
          const city = data.address?.city || data.address?.town || data.address?.village || "Local não identificado";
          const state = data.address?.state || "";
          setSelectedLocation(`${city}, ${state}`);
        })
        .catch(() => {
          setSelectedLocation("Localização não disponível");
          toast.error("Não foi possível obter sua localização");
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

  const getColorByRainChance = (chance: number) => {
    if (chance >= 70) return "text-agro-blue-600";
    if (chance >= 30) return "text-agro-blue-400";
    return "text-gray-400";
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ideal": return "bg-green-100 text-green-800 border-green-200";
      case "caution": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "avoid": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "ideal": return "Ideal";
      case "caution": return "Cautela";
      case "avoid": return "Evitar";
      default: return "Desconhecido";
    }
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
          <div className="flex items-center mt-2 text-agro-blue-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{selectedLocation}</span>
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
      
      <Card className="agro-card mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between">
            <span>Hoje em {selectedLocation}</span>
            <span className="text-gray-500 text-base font-normal">{forecast[0].date}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              {(() => {
                const WeatherIcon = weatherIcons[forecast[0].icon];
                let iconColorClass = "text-agro-blue-500"; // Default
                
                if (forecast[0].icon === "sun") iconColorClass = "text-yellow-500";
                if (forecast[0].icon === "cloud-rain" || forecast[0].icon === "cloud-drizzle") {
                  iconColorClass = "text-agro-blue-600";
                }
                
                return <WeatherIcon className={`h-20 w-20 mr-6 ${iconColorClass}`} />;
              })()}
              <div>
                <div className="text-3xl font-bold">{forecast[0].temperature.max}°C</div>
                <div className="text-gray-500">Min: {forecast[0].temperature.min}°C</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <CloudRain className={`h-6 w-6 mb-1 ${getColorByRainChance(forecast[0].rainChance)}`} />
                <span className="text-sm text-gray-500">Chuva</span>
                <span className="font-medium">{forecast[0].rainChance}%</span>
              </div>
              <div className="flex flex-col items-center">
                <Wind className="h-6 w-6 mb-1 text-gray-400" />
                <span className="text-sm text-gray-500">Vento</span>
                <span className="font-medium">{forecast[0].wind} km/h</span>
              </div>
              <div className="flex flex-col items-center">
                <Droplet className="h-6 w-6 mb-1 text-agro-blue-300" />
                <span className="text-sm text-gray-500">Umidade</span>
                <span className="font-medium">{forecast[0].humidity}%</span>
              </div>
              <div className="flex flex-col items-center">
                <Thermometer className="h-6 w-6 mb-1 text-red-400" />
                <span className="text-sm text-gray-500">UV</span>
                <span className="font-medium">{forecast[0].uvIndex}</span>
              </div>
            </div>
          </div>
          
          {forecast[0].recommendation && (
            <>
              <Separator className="my-4" />
              <div className={`p-3 rounded-md ${forecast[0].rainChance >= 50 ? "bg-agro-blue-50 border border-agro-blue-100" : "bg-agro-green-50 border border-agro-green-100"}`}>
                <p className={`text-sm ${forecast[0].rainChance >= 50 ? "text-agro-blue-800" : "text-agro-green-800"}`}>
                  <strong>Recomendação:</strong> {forecast[0].recommendation}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {view === "forecast" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-agro-green-800">Próximos dias</h2>
          
          {forecast.slice(1).map((day, index) => {
            const WeatherIcon = weatherIcons[day.icon];
            let iconColorClass = "text-agro-blue-500"; // Default
            
            if (day.icon === "sun") iconColorClass = "text-yellow-500";
            if (day.icon === "cloud-rain" || day.icon === "cloud-drizzle") {
              iconColorClass = "text-agro-blue-600";
            }
            
            return (
              <Card key={index} className="agro-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-agro-green-800 flex justify-between">
                    <span>{day.dayOfWeek}</span>
                    <span className="text-gray-500 text-base font-normal">{day.date}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="flex items-center mb-4 sm:mb-0">
                      <WeatherIcon className={`h-16 w-16 mr-4 ${iconColorClass}`} />
                      <div>
                        <div className="text-2xl font-bold">{day.temperature.max}°C</div>
                        <div className="text-gray-500">Min: {day.temperature.min}°C</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                      <div className="flex items-center">
                        <CloudRain className={`h-5 w-5 mr-2 ${getColorByRainChance(day.rainChance)}`} />
                        <span>{day.rainChance}% chuva</span>
                      </div>
                      <div className="flex items-center">
                        <Wind className="h-5 w-5 mr-2 text-gray-400" />
                        <span>{day.wind} km/h</span>
                      </div>
                      <div className="flex items-center">
                        <Droplet className="h-5 w-5 mr-2 text-agro-blue-300" />
                        <span>{day.humidity}% umidade</span>
                      </div>
                      <div className="flex items-center">
                        <Thermometer className="h-5 w-5 mr-2 text-red-400" />
                        <span>UV {day.uvIndex}</span>
                      </div>
                    </div>
                  </div>
                  
                  {day.recommendation && (
                    <>
                      <Separator className="my-4" />
                      <div className={`p-2 rounded-md ${day.rainChance >= 50 ? "bg-agro-blue-50 border border-agro-blue-100" : "bg-agro-green-50 border border-agro-green-100"}`}>
                        <p className={`text-sm ${day.rainChance >= 50 ? "text-agro-blue-800" : "text-agro-green-800"}`}>
                          <strong>Recomendação:</strong> {day.recommendation}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      {view === "activities" && (
        <Card className="agro-card">
          <CardHeader>
            <CardTitle>Recomendações para Atividades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityRecommendations.map((activity, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-md border ${getStatusColor(activity.status)}`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg">{activity.activity}</h3>
                    <span className={`px-2 py-1 text-sm rounded-full ${getStatusColor(activity.status)}`}>
                      {getStatusText(activity.status)}
                    </span>
                  </div>
                  <p className="text-sm mt-2">{activity.reason}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Weather;
