
import React from "react";
import { WeatherCard } from "./weather/WeatherCard";
import { WeatherFallback } from "./WeatherFallback";
import { useWeatherData } from "@/hooks/use-weather-data";
import { toast } from "sonner";

export const SimplifiedWeatherCard = ({ onWeatherDataChange }: { 
  onWeatherDataChange?: (data: {
    description: string;
    humidity: number;
  } | null) => void 
}) => {
  const { isError, error, refetch } = useWeatherData();
  
  // Mostrar toast de erro apenas uma vez
  React.useEffect(() => {
    if (isError && error) {
      toast.error("Erro ao carregar previsão do tempo", {
        description: "Não foi possível obter dados meteorológicos. Verifique sua conexão.",
        duration: 5000,
        action: {
          label: "Tentar novamente",
          onClick: () => refetch()
        }
      });
    }
  }, [isError, error, refetch]);
  
  // Se houver um erro crítico durante a inicialização, mostrar fallback
  if (isError) {
    return (
      <WeatherFallback 
        error="Serviço meteorológico indisponível" 
        onRetry={() => refetch()}
      />
    );
  }
  
  return <WeatherCard onWeatherDataChange={onWeatherDataChange} />;
};
