
import { useState, useEffect } from "react";
import { determinePlagueAlerts } from "@/services/diagnosticoService";
import { PlagueAlertData } from "@/types/agro";

export const usePlagueAlerts = (weatherData: {
  description: string;
  humidity: number;
} | null, hasTalhoes: boolean = false) => {
  const [plagueAlertData, setPlagueAlertData] = useState<PlagueAlertData>({
    hasAlert: false,
    message: hasTalhoes 
      ? "Verificando monitoramento de pragas..." 
      : "Cadastre sua fazenda e talhões para receber alertas"
  });

  // Effect to manage plague alerts with weatherData dependency
  useEffect(() => {
    let isMounted = true;
    
    const loadPlagueAlerts = async () => {
      if (!weatherData) return;
      
      try {
        console.log("Determinando alertas de pragas com base no clima:", weatherData);
        const alertData = await determinePlagueAlerts(weatherData);
        
        // Only update state if component is still mounted
        if (isMounted) {
          setPlagueAlertData(alertData);
          console.log("Dados de alerta de praga:", alertData);
        }
      } catch (error) {
        console.error("Erro ao determinar alertas de pragas:", error);
        if (isMounted) {
          setPlagueAlertData({
            hasAlert: false,
            message: hasTalhoes
              ? "Monitoramento de pragas ativo. Erro ao verificar alertas."
              : "Cadastre sua fazenda e talhões para receber alertas"
          });
        }
      }
    };
    
    loadPlagueAlerts();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [weatherData, hasTalhoes]);

  return plagueAlertData;
};
