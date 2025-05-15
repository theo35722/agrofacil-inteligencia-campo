
import { Cloud, CloudDrizzle, CloudRain, CloudSun, Sun } from "lucide-react";

type WeatherIconType = "sun" | "cloud" | "cloud-sun" | "cloud-rain" | "cloud-drizzle";

interface WeatherIconProps {
  icon: WeatherIconType;
  size?: number;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ icon, size, className = "" }) => {
  let IconComponent;
  let iconColorClass = "text-agro-blue-500"; // Default
  
  if (icon === "sun") {
    IconComponent = Sun;
    iconColorClass = "text-yellow-500";
  } else if (icon === "cloud") {
    IconComponent = Cloud;
  } else if (icon === "cloud-sun") {
    IconComponent = CloudSun;
  } else if (icon === "cloud-rain" || icon === "cloud-drizzle") {
    IconComponent = icon === "cloud-rain" ? CloudRain : CloudDrizzle;
    iconColorClass = "text-agro-blue-600";
  } else {
    IconComponent = Sun; // Fallback
  }
  
  return <IconComponent className={`${iconColorClass} ${className}`} size={size} />;
};
