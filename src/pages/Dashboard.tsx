
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ChatButton } from "@/components/chat/ChatButton";
import { ChatDialog } from "@/components/chat/ChatDialog";
import { toast } from "sonner";
import { ActivityPreview } from "@/components/dashboard/ActivityPreview";
import { SimplifiedWeatherCard } from "@/components/dashboard/SimplifiedWeatherCard";
import { GreetingHeader } from "@/components/dashboard/GreetingHeader";
import { DiagnosticButton } from "@/components/dashboard/DiagnosticButton";
import { LavouraSection } from "@/components/dashboard/LavouraSection";
import { PlagueAlert } from "@/components/dashboard/PlagueAlert";
import { Lavoura, Talhao, PlagueAlertData } from "@/types/agro";
import { getLavouras } from "@/services/lavouraService";
import { getTalhoes } from "@/services/talhaoService";
import { determinePlagueAlerts } from "@/services/diagnosticoService";
import { useQueryClient } from "@tanstack/react-query";

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [showChat, setShowChat] = useState(false);
  const [weatherData, setWeatherData] = useState<{
    description: string;
    humidity: number;
  } | null>(null);
  const [plagueAlertData, setPlagueAlertData] = useState<PlagueAlertData>({
    hasAlert: false,
    message: "Verificando monitoramento de pragas..."
  });
  const [lavouras, setLavouras] = useState<Lavoura[]>([]);
  const [talhoes, setTalhoes] = useState<Talhao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataKey, setDataKey] = useState(Date.now());

  // Fetch data function using useCallback to prevent unnecessary rerenders
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Buscando dados para o dashboard...");
      
      // Carregar dados em paralelo para melhor performance
      const [lavourasData, talhoesData] = await Promise.all([
        getLavouras(),
        getTalhoes()
      ]);
      
      console.log("Lavouras carregadas:", lavourasData);
      setLavouras(lavourasData);
      
      console.log("Talhões carregados:", talhoesData);
      setTalhoes(talhoesData);

      // Also update the React Query cache for other components
      queryClient.setQueryData(['lavouras'], lavourasData);
      queryClient.setQueryData(['talhoes'], talhoesData);
      
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      setError("Não foi possível carregar os dados");
      toast.error("Não foi possível carregar os dados do dashboard");
    } finally {
      setLoading(false);
    }
  }, [queryClient]);

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

  // Handle weather data changes
  const handleWeatherDataChange = useCallback((data: {
    description: string;
    humidity: number;
  } | null) => {
    console.log("Dados climáticos atualizados:", data);
    if (data && data.description) {
      setWeatherData(data);
    }
  }, []);
  
  // Handle plague alert click
  const handlePlagueAlertClick = () => {
    if (plagueAlertData.hasAlert) {
      toast.info("Detalhes do alerta", {
        description: plagueAlertData.message,
        duration: 5000
      });
    } else {
      toast.info("Monitoramento de pragas", {
        description: "Sistema de monitoramento de pragas está ativo. Continue acompanhando sua lavoura regularmente.",
        duration: 5000
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 bg-gray-50 pb-16">
      {/* Top greeting text */}
      <GreetingHeader profile={profile} />

      {/* Weather card */}
      <div className="mx-4">
        <SimplifiedWeatherCard onWeatherDataChange={handleWeatherDataChange} />
      </div>

      {/* Alert card */}
      <PlagueAlert 
        alertData={plagueAlertData}
        onClick={handlePlagueAlertClick}
      />

      {/* Simplified Diagnóstico button */}
      <DiagnosticButton />

      {/* Lavouras section */}
      <div className="mx-4 mt-2">
        <h2 className="text-xl font-bold mb-2 flex items-center justify-between">
          <Link to="/lavouras" className="text-inherit hover:text-green-700">
            Suas Lavouras
          </Link>
          <Link to="/lavouras/nova" className="text-sm text-green-600 hover:text-green-700">
            + Nova Lavoura
          </Link>
        </h2>
        <LavouraSection 
          loading={loading}
          error={error}
          talhoes={talhoes}
          lavouras={lavouras}
          key={`lavouras-${dataKey}`} // Force re-render on data change
        />
      </div>

      {/* Activities section */}
      <div className="mx-4 mt-1">
        <ActivityPreview key={`activities-${dataKey}`} /> {/* Force re-render on data change */}
      </div>

      {/* Chat button */}
      <div className="fixed bottom-20 right-4 z-40">
        <ChatButton onClick={() => setShowChat(true)} isOpen={showChat} className="w-12 h-12 bg-white shadow-lg border-2 border-green-300" />
      </div>
      <ChatDialog open={showChat} onOpenChange={setShowChat} />
    </div>
  );
};

export default Dashboard;
