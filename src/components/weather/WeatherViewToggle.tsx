
import { CalendarDays, Sun, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeatherViewToggleProps {
  view: string;
  setView: (view: string) => void;
  onRefreshWeather: () => void;
  isLoading: boolean;
}

export const WeatherViewToggle = ({ 
  view, 
  setView, 
  onRefreshWeather, 
  isLoading 
}: WeatherViewToggleProps) => {
  return (
    <div className="space-x-2">
      <Button 
        variant={view === "forecast" ? "default" : "outline"}
        onClick={() => setView("forecast")}
        className={view === "forecast" ? "bg-agro-green-500 hover:bg-agro-green-600" : ""}
      >
        <CalendarDays className="h-4 w-4 mr-2" />
        Previsão
      </Button>
      <Button 
        variant={view === "activities" ? "default" : "outline"}
        onClick={() => setView("activities")}
        className={view === "activities" ? "bg-agro-green-500 hover:bg-agro-green-600" : ""}
      >
        <Sun className="h-4 w-4 mr-2" />
        Atividades
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onRefreshWeather}
        className="ml-2"
        disabled={isLoading}
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
};
