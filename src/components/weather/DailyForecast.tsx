
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherIcon } from "./WeatherIcon";
import { WeatherMetrics } from "./WeatherMetrics";
import { WeatherRecommendation } from "./WeatherRecommendation";
import { WeatherDay } from "../../types/weather";

interface DailyForecastProps {
  day: WeatherDay;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ day }) => {
  return (
    <Card className="agro-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-agro-green-800 flex justify-between">
          <span>{day.dayOfWeek}</span>
          <span className="text-gray-500 text-base font-normal">{day.date}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <WeatherIcon icon={day.icon} className="h-16 w-16 mr-4" />
            <div>
              <div className="text-2xl font-bold">{day.temperature.max}°C</div>
              <div className="text-gray-500">Min: {day.temperature.min}°C</div>
            </div>
          </div>
          
          <WeatherMetrics 
            rainChance={day.rainChance}
            wind={day.wind}
            humidity={day.humidity}
            uvIndex={day.uvIndex}
            compact={true}
          />
        </div>
        
        {day.recommendation && (
          <WeatherRecommendation 
            recommendation={day.recommendation}
            rainChance={day.rainChance}
          />
        )}
      </CardContent>
    </Card>
  );
};
