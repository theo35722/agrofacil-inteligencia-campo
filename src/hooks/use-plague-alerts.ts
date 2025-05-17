
import { useState, useEffect } from "react";
import { determinePlagueAlerts } from "@/services/diagnosticoService";
import { PlagueAlertData } from "@/types/agro";

export const usePlagueAlerts = (weatherData: {
  description: string;
  humidity: number;
} | null) => {
  const [plagueAlertData, setPlagueAlertData] = useState<PlagueAlertData>({
    hasAlert: false,
    message: "Verificando monitoramento de pragas..."
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
            message: "Monitoramento de pragas ativo. Erro ao verificar alertas."
          });
        }
      }
    };
    
    loadPlagueAlerts();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [weatherData]);

  return plagueAlertData;
};
