
import { Cloud, CloudRain, CloudSun, Sun } from "lucide-react";

type WeatherIconType = "sun" | "cloud" | "cloud-sun" | "cloud-rain";

interface WeatherForecastDayProps {
  day: string;
  icon: WeatherIconType;
  temperature: string;
}

export const WeatherForecastDay = ({ day, icon, temperature }: WeatherForecastDayProps) => {
  const weatherIcons = {
    "sun": Sun,
    "cloud": Cloud,
    "cloud-sun": CloudSun,
    "cloud-rain": CloudRain,
  };

  const WeatherIcon = weatherIcons[icon];
  let colorClass = "text-agro-blue-500";
  
  if (icon === "sun") colorClass = "text-yellow-500";
  if (icon === "cloud-rain") colorClass = "text-agro-blue-600";
  
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm font-medium text-gray-600">{day}</span>
      <WeatherIcon className={`h-8 w-8 my-1 ${colorClass}`} />
      <span className="font-semibold">{temperature}</span>
    </div>
  );
};
