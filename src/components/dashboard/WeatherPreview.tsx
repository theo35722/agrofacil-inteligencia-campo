
import { Cloud, CloudRain, CloudSun, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WeatherDay = {
  day: string;
  icon: "sun" | "cloud" | "cloud-sun" | "cloud-rain";
  temperature: string;
  description: string;
};

export const WeatherPreview = () => {
  // Mock data for demo
  const forecast: WeatherDay[] = [
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
  ];

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
          Previsão do Tempo
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
