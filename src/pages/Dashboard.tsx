
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ActivityPreview } from "@/components/dashboard/ActivityPreview";
import { NewWeatherCard } from "@/components/weather/NewWeatherCard";
import { GreetingHeader } from "@/components/dashboard/GreetingHeader";
import { DiagnosticButton } from "@/components/dashboard/DiagnosticButton";
import { PlagueAlert } from "@/components/dashboard/PlagueAlert";
import { DashboardChatButton } from "@/components/dashboard/DashboardChatButton";
import { DashboardLavouraSection } from "@/components/dashboard/DashboardLavouraSection";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { usePlagueAlerts } from "@/hooks/use-plague-alerts";

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [weatherData, setWeatherData] = useState<{
    description: string;
    humidity: number;
  } | null>(null);
  const [dataKey, setDataKey] = useState(Date.now());
  
  // Use our custom hooks
  const { lavouras, talhoes, loading, error, fetchDashboardData } = useDashboardData();
  
  // Pass the actual talhoes to the hook for more accurate plague alerts
  const { plagueAlertData, isLoading: isPlagueAlertLoading } = usePlagueAlerts(
    weatherData, 
    talhoes
  );

  // Initial data load and refresh on navigation back
  useEffect(() => {
    let isMounted = true;
    
    console.log("Dashboard montado ou atualizado, carregando dados...");
    fetchDashboardData();
    
    // When user returns to this screen, refresh data
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Usuário retornou ao dashboard, atualizando dados...");
        // Force a refresh by updating the key
        if (isMounted) {
          setDataKey(Date.now());
          fetchDashboardData();
        }
      }
    };
    
    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      isMounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchDashboardData]);

  // Trigger refresh when dataKey changes
  useEffect(() => {
    if (dataKey) {
      // This effect runs when dataKey changes, triggering data reload without full remount
      console.log("Dashboard key changed, refreshing data...");
      fetchDashboardData();
    }
  }, [dataKey, fetchDashboardData]);

  // Handle weather data changes from the NewWeatherCard
  const handleWeatherDataChange = useCallback((data: {
    description: string;
    humidity: number;
  } | null) => {
    console.log("Dados climáticos atualizados:", data);
    setWeatherData(data);
  }, []);
  
  // Handle plague alert click with improved toast
  const handlePlagueAlertClick = () => {
    if (plagueAlertData.hasAlert) {
      const culturasText = plagueAlertData.culturas?.length 
        ? `Cultura afetada: ${plagueAlertData.culturas[0]}`
        : '';
      
      const recommendationsText = plagueAlertData.recommendations?.length
        ? `\n\nRecomendação: ${plagueAlertData.recommendations[0]}`
        : '';
        
      toast.info("Detalhes do alerta", {
        description: `${plagueAlertData.message} ${culturasText}${recommendationsText}`,
        duration: 7000
      });
    } else {
      if (talhoes.length === 0) {
        toast.info("Cadastre sua fazenda", {
          description: "Cadastre sua fazenda e talhões para começar a receber alertas de pragas específicos para suas culturas.",
          action: {
            label: "Cadastrar",
            onClick: () => window.location.href = "/lavouras",
          },
          duration: 5000
        });
      } else {
        toast.info("Monitoramento de pragas", {
          description: "Sistema de monitoramento de pragas está ativo. Continue acompanhando sua lavoura regularmente.",
          duration: 5000
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 bg-gray-50 pb-16">
      {/* Top greeting text */}
      <GreetingHeader profile={profile} />

      {/* Weather card - Using NewWeatherCard with improved error handling */}
      <div className="mx-4">
        <NewWeatherCard onWeatherDataChange={handleWeatherDataChange} />
      </div>

      {/* Alert card */}
      <PlagueAlert 
        alertData={plagueAlertData}
        onClick={handlePlagueAlertClick}
        isLoading={isPlagueAlertLoading}
      />

      {/* Simplified Diagnóstico button */}
      <DiagnosticButton />

      {/* Lavouras section */}
      <DashboardLavouraSection 
        loading={loading}
        error={error}
        talhoes={talhoes}
        lavouras={lavouras}
        dataKey={dataKey}
      />

      {/* Activities section */}
      <div className="mx-4 mt-1">
        <ActivityPreview key={`activities-${dataKey}`} /> {/* Force re-render on data change */}
      </div>

      {/* Chat button */}
      <DashboardChatButton />
    </div>
  );
};

export default Dashboard;
