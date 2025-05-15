
import { DailyForecast } from "@/components/weather/DailyForecast";
import { WeatherDay } from "@/types/weather";

interface ForecastViewProps {
  forecast: WeatherDay[];
}

export const ForecastView = ({ forecast }: ForecastViewProps) => {
  // Skip first day as it's displayed in TodayForecast
  const upcomingDays = forecast.slice(1);
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-agro-green-800">Próximos dias</h2>
      
      {upcomingDays.map((day, index) => (
        <DailyForecast key={index} day={day} />
      ))}
    </div>
  );
};
