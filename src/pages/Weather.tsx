
import { Cloud, CloudDrizzle, CloudRain, CloudSun, Sun, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface WeatherDay {
  date: string;
  dayOfWeek: string;
  icon: "sun" | "cloud" | "cloud-sun" | "cloud-rain" | "cloud-drizzle";
  temperature: { min: number; max: number };
  humidity: number;
  wind: number;
  rainChance: number;
  recommendation?: string;
}

const Weather = () => {
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
    },
    {
      date: "17/05/2025",
      dayOfWeek: "Quarta",
      icon: "cloud-sun",
      temperature: { min: 20, max: 26 },
      humidity: 65,
      wind: 8,
      rainChance: 20,
    },
    {
      date: "18/05/2025",
      dayOfWeek: "Quinta",
      icon: "sun",
      temperature: { min: 21, max: 29 },
      humidity: 50,
      wind: 5,
      rainChance: 0,
    },
  ];

  const weatherIcons = {
    "sun": Sun,
    "cloud": Cloud,
    "cloud-sun": CloudSun,
    "cloud-rain": CloudRain,
    "cloud-drizzle": CloudDrizzle,
  };

  const getColorByRainChance = (chance: number) => {
    if (chance >= 70) return "text-agro-blue-600";
    if (chance >= 30) return "text-agro-blue-400";
    return "text-gray-400";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-agro-green-800 mb-2">
          Previsão do Tempo
        </h1>
        <p className="text-gray-600">
          Informações climáticas para os próximos 5 dias
        </p>
      </div>
      
      <div className="space-y-4">
        {forecast.map((day, index) => {
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
                      <CloudDrizzle className="h-5 w-5 mr-2 text-agro-blue-300" />
                      <span>{day.humidity}% umidade</span>
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
    </div>
  );
};

export default Weather;
