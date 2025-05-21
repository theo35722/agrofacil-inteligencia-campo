
import { MapPin } from "lucide-react";
import { WeatherForecastDay } from "./WeatherForecastDay";

type WeatherDay = {
  day: string;
  icon: "sun" | "cloud" | "cloud-sun" | "cloud-rain";
  temperature: string;
  description: string;
};

interface WeatherPreviewContentProps {
  currentWeather: {
    description: string;
    temperature: string;
    icon: string;
  };
  forecast: WeatherDay[];
  locationName: string;
  recommendation?: string;
}

export const WeatherPreviewContent = ({ 
  currentWeather, 
  forecast, 
  locationName, 
  recommendation 
}: WeatherPreviewContentProps) => {
  // Helper function to map OpenWeather icon to our icon types
  const mapIconToType = (iconCode: string): "sun" | "cloud" | "cloud-sun" | "cloud-rain" => {
    if (!iconCode) return "cloud-sun";
    
    if (iconCode.includes("01")) return "sun"; // clear sky
    if (iconCode.includes("02") || iconCode.includes("03")) return "cloud-sun"; // few/scattered clouds
    if (iconCode.includes("04")) return "cloud"; // broken clouds
    if (iconCode.includes("09") || iconCode.includes("10") || iconCode.includes("11")) return "cloud-rain"; // rain/thunder
    
    return "cloud-sun";
  };

  return (
    <>
      {/* Main weather display */}
      <div className="flex items-center justify-between mb-4">
        {/* Left side: Location and description */}
        <div className="flex flex-col">
          {locationName && (
            <div className="flex items-center text-sm text-agro-blue-600 mb-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{locationName}</span>
            </div>
          )}
          <p className="text-base text-gray-800">
            {currentWeather.description.charAt(0).toUpperCase() + currentWeather.description.slice(1)}
          </p>
        </div>
        
        {/* Right side: Current temperature */}
        <div className="flex items-center">
          <WeatherForecastDay 
            day=""
            icon={mapIconToType(currentWeather.icon)}
            temperature=""
          />
          <span className="text-4xl font-semibold">
            {Math.round(parseFloat(currentWeather.temperature))}°C
          </span>
        </div>
      </div>
      
      {/* Forecast for next days in a compact row */}
      <div className="flex justify-between border-t border-gray-100 pt-3">
        {forecast.map((day, index) => (
          <WeatherForecastDay
            key={index}
            day={day.day}
            icon={day.icon}
            temperature={day.temperature}
          />
        ))}
      </div>
      
      {/* Weather recommendation banner */}
      {recommendation && (
        <div className="mt-4 p-2 bg-amber-50 border border-amber-100 rounded-md">
          <p className="text-sm text-amber-800">
            <strong>Dica:</strong> {recommendation}
          </p>
        </div>
      )}
    </>
  );
};
