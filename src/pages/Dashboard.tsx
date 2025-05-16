
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useAuth } from "@/contexts/AuthContext";
import { ChatButton } from "@/components/chat/ChatButton";
import { ChatDialog } from "@/components/chat/ChatDialog";
import { toast } from "sonner";
import { ActivityPreview } from "@/components/dashboard/ActivityPreview";
import { SimplifiedWeatherCard } from "@/components/dashboard/SimplifiedWeatherCard";
import { Badge } from "@/components/ui/badge";
import { PlagueAlert } from "@/components/dashboard/PlagueAlert";
import { Talhao, PlagueAlertData } from "@/types/agro";
import { getTalhoes, determinePlagueAlerts } from "@/services/agroService";

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const location = useGeolocation();
  const [showChat, setShowChat] = useState(false);
  const [weatherData, setWeatherData] = useState<{
    description: string;
    humidity: number;
  } | null>(null);
  const [plagueAlertData, setPlagueAlertData] = useState<PlagueAlertData>({
    hasAlert: false,
    message: "Nenhum alerta de pragas no momento"
  });
  const [talhoes, setTalhoes] = useState<Talhao[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar talhões do usuário
  useEffect(() => {
    const fetchTalhoes = async () => {
      try {
        setLoading(true);
        const data = await getTalhoes();
        setTalhoes(data);
        console.log("Talhões carregados:", data);
      } catch (error) {
        console.error("Erro ao buscar talhões:", error);
        toast.error("Não foi possível carregar os dados das lavouras");
      } finally {
        setLoading(false);
      }
    };

    fetchTalhoes();
  }, []);

  // Determinar alerta de pragas com base nas culturas e condições climáticas
  useEffect(() => {
    const loadPlagueAlerts = async () => {
      if (weatherData) {
        try {
          const alertData = await determinePlagueAlerts(weatherData);
          setPlagueAlertData(alertData);
          console.log("Dados de alerta:", alertData);
        } catch (error) {
          console.error("Erro ao determinar alertas de pragas:", error);
        }
      }
    };
    
    loadPlagueAlerts();
  }, [weatherData, talhoes]);

  // Manipular alteração nos dados climáticos
  const handleWeatherDataChange = (data: {
    description: string;
    humidity: number;
  } | null) => {
    setWeatherData(data);
    console.log("Dados climáticos atualizados:", data);
  };

  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };
  const greeting = `${getGreeting()}, ${profile?.nome?.split(' ')[0] || 'Produtor'}!`;

  // Função para determinar a cor da badge baseada na fase
  const getPhaseColor = (phase: string) => {
    switch (phase.toLowerCase()) {
      case "crescimento":
        return "bg-green-100 text-green-800 border-green-200";
      case "emergência":
      case "emergencia":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "florescimento":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "colheita":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  // Função para navegar para a página de detalhes do alerta (futuro)
  const handlePlagueAlertClick = () => {
    if (plagueAlertData.hasAlert) {
      // Futuramente, pode-se implementar uma navegação para detalhes 
      toast("Navegando para detalhes do alerta...");
    } else {
      toast("Nenhum alerta de pragas no momento");
    }
  };

  return (
    <div className="flex flex-col gap-3 bg-gray-50 pb-16">
      {/* Top greeting text */}
      <div className="py-4 px-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">{greeting}</h1>
      </div>

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
      <Link to="/diagnostico" className="mx-4">
        <Button className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-sm flex items-center justify-center gap-2">
          <Leaf className="w-5 h-5" />
          <div className="text-base font-medium">Fazer Diagnóstico de Planta</div>
        </Button>
      </Link>

      {/* Lavouras section - real data */}
      <div className="mx-4 mt-2">
        <h2 className="text-xl font-bold mb-2">
          <Link to="/lavouras" className="text-inherit hover:text-green-700">
            Suas Lavouras
          </Link>
        </h2>
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            Carregando lavouras...
          </div>
        ) : talhoes.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              {talhoes.slice(0, 4).map(talhao => (
                <Link key={talhao.id} to="/lavouras">
                  <Card className="p-3 h-full border border-gray-100 shadow-none bg-green-50 rounded-lg hover:shadow-sm transition-all">
                    <h3 className="font-semibold">{talhao.nome}</h3>
                    <div className="text-green-600 font-medium">{talhao.cultura}</div>
                    <div className="text-sm mt-1">
                      Fase: <Badge variant="outline" className={`ml-1 border ${getPhaseColor(talhao.fase)}`}>
                        {talhao.fase}
                      </Badge>
                    </div>
                    {talhao.status && (
                      <div className="text-xs text-gray-500 mt-1">
                        {talhao.status}
                      </div>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
            {talhoes.length > 4 && (
              <div className="mt-3 text-right">
                <Link 
                  to="/lavouras"
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Ver todas ({talhoes.length}) &rarr;
                </Link>
              </div>
            )}
          </>
        ) : (
          <Card className="p-6 text-center border border-dashed border-gray-300 bg-white">
            <p className="text-gray-600 mb-4">Nenhuma lavoura cadastrada. Adicione sua primeira lavoura!</p>
            <Link to="/lavouras/nova">
              <Button className="bg-green-500 hover:bg-green-600">
                Adicionar Lavoura
              </Button>
            </Link>
          </Card>
        )}
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
