
import React, { useEffect, useState } from "react";
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

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
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

  // Buscar lavouras e talhões juntos
  useEffect(() => {
    const fetchData = async () => {
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
        
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
        setError("Não foi possível carregar os dados");
        toast.error("Não foi possível carregar os dados do dashboard");
      } finally {
        // Definir loading como false ao concluir, mesmo em caso de erro
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Determinar alerta de pragas com base nas culturas e condições climáticas
  useEffect(() => {
    const loadPlagueAlerts = async () => {
      if (weatherData) {
        try {
          console.log("Determinando alertas de pragas com base no clima:", weatherData);
          const alertData = await determinePlagueAlerts(weatherData);
          setPlagueAlertData(alertData);
          console.log("Dados de alerta de praga:", alertData);
        } catch (error) {
          console.error("Erro ao determinar alertas de pragas:", error);
          setPlagueAlertData({
            hasAlert: false,
            message: "Monitoramento de pragas ativo. Erro ao verificar alertas."
          });
        }
      } else {
        // Garantir que temos uma mensagem adequada quando não há dados climáticos
        setPlagueAlertData({
          hasAlert: false,
          message: "Monitoramento de pragas aguardando dados climáticos..."
        });
      }
    };
    
    loadPlagueAlerts();
  }, [weatherData]);

  // Manipular alteração nos dados climáticos
  const handleWeatherDataChange = (data: {
    description: string;
    humidity: number;
  } | null) => {
    console.log("Dados climáticos atualizados:", data);
    if (data && data.description) {
      setWeatherData(data);
    }
  };
  
  // Função para navegar para a página de detalhes do alerta (futuro)
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

  // Verificar se o usuário está autenticado
  useEffect(() => {
    if (!profile) {
      console.log("Usuário não autenticado. Alguns dados podem não ser exibidos corretamente.");
    } else {
      console.log("Usuário autenticado:", profile.id);
    }
  }, [profile]);

  return (
    <div className="flex flex-col gap-3 bg-gray-50 pb-16">
      {/* Top greeting text */}
      <GreetingHeader profile={profile} />

      {/* Weather card */}
      <div className="mx-4">
        <SimplifiedWeatherCard onWeatherDataChange={handleWeatherDataChange} />
      </div>

      {/* Alert card - só aparece conforme lógica de pragas */}
      <PlagueAlert 
        alertData={plagueAlertData}
        onClick={handlePlagueAlertClick}
      />

      {/* Simplified Diagnóstico button */}
      <DiagnosticButton />

      {/* Lavouras section - real data */}
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
        />
      </div>

      {/* Activities section - real data */}
      <div className="mx-4 mt-1">
        <ActivityPreview />
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
