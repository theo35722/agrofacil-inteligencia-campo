
import React from "react";
import { 
  Cloud, 
  CloudDrizzle, 
  CloudRain, 
  CloudSun, 
  Sun 
} from "lucide-react";

type IconType = "sun" | "cloud" | "cloud-sun" | "cloud-rain" | "cloud-drizzle";

interface WeatherIconProps {
  icon: string;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ icon, className = "" }) => {
  const iconSize = className || "h-10 w-10";
  
  switch (icon) {
    case "sun":
      return <Sun className={`text-yellow-500 ${iconSize}`} />;
    case "cloud":
      return <Cloud className={`text-gray-400 ${iconSize}`} />;
    case "cloud-sun":
      return <CloudSun className={`text-orange-400 ${iconSize}`} />;
    case "cloud-rain":
      return <CloudRain className={`text-agro-blue-600 ${iconSize}`} />;
    case "cloud-drizzle":
      return <CloudDrizzle className={`text-agro-blue-500 ${iconSize}`} />;
    default:
      return <CloudSun className={`text-gray-400 ${iconSize}`} />;
  }
};
