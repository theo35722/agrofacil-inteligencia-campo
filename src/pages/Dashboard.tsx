
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Sun, Leaf } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useAuth } from "@/contexts/AuthContext";
import { ChatButton } from "@/components/chat/ChatButton";
import { ChatDialog } from "@/components/chat/ChatDialog";
import { toast } from "@/components/ui/use-toast";
import { FeatureCard } from "@/components/dashboard/FeatureCard";
import { ActivityPreview } from "@/components/dashboard/ActivityPreview";
import { SimplifiedWeatherCard } from "@/components/dashboard/SimplifiedWeatherCard";
import { Badge } from "@/components/ui/badge";
import { PlagueAlert } from "@/components/dashboard/PlagueAlert";
import { determinePlaguePotential } from "@/services/openWeatherService";

type LavouraProps = {
  id: string;
  name: string;
  crop: string;
  phase: string;
  status?: string;
  activity?: string;
};

const Dashboard: React.FC = () => {
  const {
    profile
  } = useAuth();
  const location = useGeolocation();
  const [showChat, setShowChat] = useState(false);
  const [weatherData, setWeatherData] = useState<{
    description: string;
    humidity: number;
  } | null>(null);
  const [plagueAlertData, setPlagueAlertData] = useState({
    hasAlert: false,
    message: "Nenhum alerta de pragas no momento"
  });

  // Mock data - in a real app, this would come from Supabase
  const lavouras: LavouraProps[] = [{
    id: "1",
    name: "Talhão 3",
    crop: "Milho",
    phase: "Crescimento",
    status: "pendente",
    activity: "Adubação"
  }, {
    id: "2",
    name: "Talhão 1",
    crop: "Soja",
    phase: "Emergência",
    status: "planejada",
    activity: "Pulverização"
  }];

  // Determinar alerta de pragas com base nas culturas e condições climáticas
  useEffect(() => {
    if (weatherData && lavouras.length > 0) {
      // Pegar a primeira cultura como exemplo (poderia ser mais sofisticado)
      // Em uma implementação real, você poderia verificar todas as culturas
      const primaryCrop = lavouras[0].crop;
      
      const alertData = determinePlaguePotential(
        primaryCrop,
        weatherData.description,
        weatherData.humidity
      );
      
      setPlagueAlertData(alertData);
    }
  }, [weatherData, lavouras]);

  // Manipular alteração nos dados climáticos
  const handleWeatherDataChange = (data: {
    description: string;
    humidity: number;
  } | null) => {
    setWeatherData(data);
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
    switch (phase) {
      case "Crescimento":
        return "bg-green-100 text-green-800 border-green-200";
      case "Emergência":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Florescimento":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Colheita":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  // Função para navegar para a página de detalhes do alerta (futuro)
  const handlePlagueAlertClick = () => {
    // Futuramente, pode-se implementar uma navegação para detalhes 
    toast({
      title: "Detalhes de alerta",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  return <div className="flex flex-col gap-3 bg-gray-50 pb-16">
      {/* Top greeting text - without green background */}
      <div className="py-4 px-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">{greeting}</h1>
      </div>

      {/* Weather card - using the simplified component */}
      <div className="mx-4">
        <SimplifiedWeatherCard onWeatherDataChange={handleWeatherDataChange} />
      </div>

      {/* Alert card - só aparece conforme lógica de pragas */}
      <PlagueAlert 
        hasAlert={plagueAlertData.hasAlert} 
        message={plagueAlertData.message}
        onClick={handlePlagueAlertClick}
      />

      {/* Simplified Diagnóstico button */}
      <Link to="/diagnostico" className="mx-4">
        <Button className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-sm flex items-center justify-center gap-2">
          <Leaf className="w-5 h-5" />
          <div className="text-base font-medium">Fazer Diagnóstico de Planta</div>
        </Button>
      </Link>

      {/* Lavouras section - simplified layout */}
      <div className="mx-4 mt-2">
        <h2 className="text-xl font-bold mb-2">
          <Link to="/lavouras" className="text-inherit hover:text-green-700">
            Suas Lavouras
          </Link>
        </h2>
        {lavouras.length > 0 ? <>
            <div className="grid grid-cols-2 gap-3">
              {lavouras.map(lavoura => <Link key={lavoura.id} to="/lavouras">
                  <Card className="p-3 h-full border border-gray-100 shadow-none bg-green-50 rounded-lg hover:shadow-sm transition-all">
                    <h3 className="font-semibold">{lavoura.name}</h3>
                    <div className="text-green-600 font-medium">{lavoura.crop}</div>
                    <div className="text-sm mt-1">
                      Fase: <Badge variant="outline" className={`ml-1 border ${getPhaseColor(lavoura.phase)}`}>
                        {lavoura.phase}
                      </Badge>
                    </div>
                  </Card>
                </Link>)}
            </div>
            <div className="mt-3 text-right">
              
            </div>
          </> : <Card className="p-6 text-center border border-dashed border-gray-300 bg-white">
            <p className="text-gray-600 mb-4">Nenhuma lavoura cadastrada. Adicione sua primeira lavoura!</p>
            <Link to="/lavouras/nova">
              <Button className="bg-green-500 hover:bg-green-600">
                Adicionar Lavoura
              </Button>
            </Link>
          </Card>}
      </div>

      {/* Activities section - will replace with simplified version */}
      <div className="mx-4 mt-1">
        <ActivityPreview />
      </div>

      {/* Chat button */}
      <div className="fixed bottom-20 right-4 z-40">
        <ChatButton onClick={() => setShowChat(true)} isOpen={showChat} className="w-12 h-12 bg-white shadow-lg border-2 border-green-300" />
      </div>
      <ChatDialog open={showChat} onOpenChange={setShowChat} />
    </div>;
};
export default Dashboard;
