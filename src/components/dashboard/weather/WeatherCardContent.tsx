
import React from "react";
import { WeatherDay } from "@/types/weather";
import { WeatherIcon } from "@/components/weather/WeatherIcon";
import { MapPin } from "lucide-react";

interface WeatherCardContentProps {
  today: WeatherDay;
  locationName: string | null;
  agriculturalAlert: string;
}

export const WeatherCardContent: React.FC<WeatherCardContentProps> = ({ 
  today, 
  locationName,
  agriculturalAlert 
}) => {
  const isAlertWarning = agriculturalAlert.includes("Alerta");

  return (
    <>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center mb-2">
            <span className="text-2xl font-bold">{today.temperature.max}°C</span>
            <span className="text-sm text-gray-500 ml-2">
              {today.temperature.min}°C / {today.temperature.max}°C
            </span>
          </div>
          
          {locationName && (
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{locationName}</span>
            </div>
          )}
          
          <p className="text-sm mb-2">{today.description || "Condições atuais"}</p>
        </div>
        
        <WeatherIcon icon={today.icon} className="h-16 w-16" />
      </div>
      
      <div className={`mt-2 p-2 rounded-md ${
        isAlertWarning
          ? "bg-amber-50 text-amber-800"
          : "bg-green-50 text-green-800"
      }`}>
        <p className="text-sm font-medium">
          {agriculturalAlert}
        </p>
      </div>
    </>
  );
};
