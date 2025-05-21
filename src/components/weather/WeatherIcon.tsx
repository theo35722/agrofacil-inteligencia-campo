
import React from "react";
import { 
  Cloud, 
  CloudDrizzle, 
  CloudRain, 
  CloudSun, 
  Sun,
  CloudSnow,
  CloudLightning,
  CloudFog
} from "lucide-react";

export const WeatherIcon: React.FC<{ icon: string; className?: string }> = ({ 
  icon, 
  className = "h-10 w-10" 
}) => {
  // Map OpenWeatherMap icon codes to our icon types
  const mapWeatherIcon = (iconCode: string) => {
    // Extract the icon code without the day/night suffix
    const code = iconCode.substring(0, 2);
    
    switch (code) {
      case "01": // clear sky
        return <Sun className={`text-yellow-500 ${className}`} />;
      case "02": // few clouds
      case "03": // scattered clouds
        return <CloudSun className={`text-blue-400 ${className}`} />;
      case "04": // broken clouds, overcast
        return <Cloud className={`text-gray-400 ${className}`} />;
      case "09": // shower rain
        return <CloudDrizzle className={`text-blue-500 ${className}`} />;
      case "10": // rain
        return <CloudRain className={`text-blue-600 ${className}`} />;
      case "11": // thunderstorm
        return <CloudLightning className={`text-purple-600 ${className}`} />;
      case "13": // snow
        return <CloudSnow className={`text-blue-200 ${className}`} />;
      case "50": // mist, fog
        return <CloudFog className={`text-gray-400 ${className}`} />;
      default:
        return <CloudSun className={`text-blue-400 ${className}`} />;
    }
  };

  // Handle icon codes from OpenWeatherMap API (like "01d", "02n")
  if (icon && (icon.length === 2 || icon.length === 3)) {
    return mapWeatherIcon(icon);
  }
  
  // Handle full icon URLs or our custom icon types
  if (icon && icon.includes("openweathermap.org")) {
    // Extract the icon code from the URL
    const matches = icon.match(/\/([a-z0-9]+)(@[0-9]+x)?\.png$/i);
    if (matches && matches[1]) {
      return mapWeatherIcon(matches[1]);
    }
  }
  
  // Default icon if nothing else matches
  return <CloudSun className={`text-blue-400 ${className}`} />;
};
