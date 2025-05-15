
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherIcon } from "./WeatherIcon";
import { WeatherMetrics } from "./WeatherMetrics";
import { WeatherRecommendation } from "./WeatherRecommendation";
import { WeatherDay } from "../../types/weather";

interface TodayForecastProps {
  forecast: WeatherDay;
  location: string;
  lastUpdated?: Date;
}

export const TodayForecast: React.FC<TodayForecastProps> = ({ forecast, location, lastUpdated }) => {
  // Format last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    
    return lastUpdated.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Card className="agro-card mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between">
          <span>Hoje em {location}</span>
          <div className="flex flex-col items-end">
            <span className="text-gray-500 text-base font-normal">{forecast.date}</span>
            {lastUpdated && (
              <span className="text-xs text-gray-400">
                Atualizado às {formatLastUpdated()}
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <WeatherIcon icon={forecast.icon} className="h-20 w-20 mr-6" />
            <div>
              <div className="text-3xl font-bold">{forecast.temperature.max}°C</div>
              <div className="text-gray-500">Min: {forecast.temperature.min}°C</div>
            </div>
          </div>
          
          <WeatherMetrics 
            rainChance={forecast.rainChance}
            wind={forecast.wind}
            humidity={forecast.humidity}
            uvIndex={forecast.uvIndex}
          />
        </div>
        
        {forecast.recommendation && (
          <WeatherRecommendation 
            recommendation={forecast.recommendation}
            rainChance={forecast.rainChance}
          />
        )}
      </CardContent>
    </Card>
  );
};
