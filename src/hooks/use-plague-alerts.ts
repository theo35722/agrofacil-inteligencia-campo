
import { useState, useEffect } from "react";
import { determinePlagueAlerts } from "@/services/diagnosticoService";
import { getPlagueForCulture } from "@/services/openWeatherService";
import { PlagueAlertData } from "@/types/agro";

export const usePlagueAlerts = (
  weatherData: {
    description: string;
    humidity: number;
  } | null, 
  talhoes: Array<{id: string; cultura: string}> = []
) => {
  const [plagueAlertData, setPlagueAlertData] = useState<PlagueAlertData>({
    hasAlert: false,
    message: talhoes.length > 0
      ? "Verificando monitoramento de pragas..." 
      : "Cadastre sua fazenda e talhões para receber alertas"
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Effect to manage plague alerts with weatherData and talhoes dependencies
  useEffect(() => {
    let isMounted = true;
    
    const loadPlagueAlerts = async () => {
      setIsLoading(true);
      
      // If no talhoes, show appropriate message
      if (!talhoes || talhoes.length === 0) {
        if (isMounted) {
          setPlagueAlertData({
            hasAlert: false,
            message: "Cadastre sua fazenda e talhões para receber alertas"
          });
          setIsLoading(false);
        }
        return;
      }
      
      // If no weather data, show waiting message
      if (!weatherData) {
        if (isMounted) {
          setPlagueAlertData({
            hasAlert: false,
            message: "Aguardando dados climáticos para verificar alertas"
          });
          setIsLoading(false);
        }
        return;
      }
      
      try {
        console.log("Determinando alertas de pragas com base no clima:", weatherData);
        console.log("Talhões disponíveis para verificação:", talhoes);
        
        // Get unique cultures from talhoes
        const uniqueCultures = [...new Set(talhoes
          .filter(talhao => talhao.cultura)
          .map(talhao => talhao.cultura))];
        
        console.log("Culturas únicas encontradas:", uniqueCultures);
        
        // If no valid cultures found, return early
        if (uniqueCultures.length === 0) {
          if (isMounted) {
            setPlagueAlertData({
              hasAlert: false,
              message: "Cadastre culturas em seus talhões para receber alertas"
            });
            setIsLoading(false);
          }
          return;
        }
        
        // Process each culture and find the most severe alert
        let highestSeverityAlert: PlagueAlertData | null = null;
        
        for (const cultura of uniqueCultures) {
          // Use the plague determination function for each culture
          const alertForCulture = getPlagueForCulture(cultura, weatherData.description, weatherData.humidity);
          
          console.log(`Alerta para ${cultura}:`, alertForCulture);
          
          // Update the highest severity alert if needed
          if (alertForCulture.hasAlert) {
            if (!highestSeverityAlert || 
                getSeverityValue(alertForCulture.severity) > getSeverityValue(highestSeverityAlert.severity)) {
              // Create a new alert with just this culture
              highestSeverityAlert = {
                ...alertForCulture,
                culturas: [cultura]
              };
            }
          }
        }
        
        // Use the highest severity alert or create a default no-alert message
        const finalAlert = highestSeverityAlert || {
          hasAlert: false,
          message: "Monitoramento ativo. Sem alertas de pragas no momento."
        };
        
        // Only update state if component is still mounted
        if (isMounted) {
          setPlagueAlertData(finalAlert);
          console.log("Dados de alerta de praga:", finalAlert);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erro ao determinar alertas de pragas:", error);
        if (isMounted) {
          setPlagueAlertData({
            hasAlert: false,
            message: talhoes.length > 0
              ? "Monitoramento de pragas ativo. Erro ao verificar alertas."
              : "Cadastre sua fazenda e talhões para receber alertas"
          });
          setIsLoading(false);
        }
      }
    };
    
    loadPlagueAlerts();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [weatherData, talhoes]);

  // Helper function to convert severity string to numeric value for comparison
  const getSeverityValue = (severity?: "low" | "medium" | "high"): number => {
    switch (severity) {
      case "high": return 3;
      case "medium": return 2;
      case "low": return 1;
      default: return 0;
    }
  };

  return { plagueAlertData, isLoading };
};
