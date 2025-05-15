
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeatherErrorProps {
  onRetry: () => void;
}

export const WeatherError = ({ onRetry }: WeatherErrorProps) => {
  return (
    <div className="p-8 text-center border rounded-lg bg-red-50 border-red-200">
      <h3 className="text-lg font-medium text-red-800">Erro ao carregar dados meteorológicos</h3>
      <p className="mt-2 text-red-600">Não foi possível obter a previsão do tempo. Tente novamente mais tarde.</p>
      <Button 
        variant="outline" 
        className="mt-4 border-red-300 text-red-700 hover:bg-red-100"
        onClick={onRetry}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Tentar novamente
      </Button>
    </div>
  );
};
