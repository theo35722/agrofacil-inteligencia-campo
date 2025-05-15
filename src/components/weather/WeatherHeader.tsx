
import { MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeatherHeaderProps {
  selectedLocation: string;
  locationError: string | null;
  locationFetchError: string | null;
  onRetryLocation: () => void;
  isLoading: boolean;
}

export const WeatherHeader = ({ 
  selectedLocation, 
  locationError, 
  locationFetchError,
  onRetryLocation,
  isLoading
}: WeatherHeaderProps) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-agro-green-800 mb-2">
        Previsão do Tempo
      </h1>
      <p className="text-gray-600">
        Condições climáticas e recomendações para suas atividades agrícolas
      </p>
      <div className="flex items-center mt-2">
        <MapPin className="h-4 w-4 mr-1 text-agro-blue-600" />
        <span className="text-sm text-agro-blue-600">
          {selectedLocation}
          {(locationError || locationFetchError) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRetryLocation}
              className="ml-2 h-6 px-2 text-xs text-agro-blue-600"
              disabled={isLoading}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Tentar novamente
            </Button>
          )}
        </span>
      </div>
    </div>
  );
};
