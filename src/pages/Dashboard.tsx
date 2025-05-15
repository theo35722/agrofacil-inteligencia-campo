
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Sun, Leaf, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useAuth } from "@/contexts/AuthContext";
import { ChatButton } from "@/components/chat/ChatButton";
import { ChatDialog } from "@/components/chat/ChatDialog";
import { toast } from "@/components/ui/use-toast";
import { FeatureCard } from "@/components/dashboard/FeatureCard";
import { ActivityPreview } from "@/components/dashboard/ActivityPreview";
import { WeatherPreview } from "@/components/dashboard/WeatherPreview";

type LavouraProps = {
  id: string;
  name: string;
  crop: string;
  phase: string;
  status?: string;
  activity?: string;
};

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const location = useGeolocation();
  const [showChat, setShowChat] = useState(false);
  const [hasAlert, setHasAlert] = useState(true);
  const [alertMessage, setAlertMessage] = useState("lavouras de soja!");
  
  // Mock data - in a real app, this would come from Supabase
  const lavouras: LavouraProps[] = [
    {
      id: "1",
      name: "Talhão 3",
      crop: "Milho",
      phase: "Crescimento",
      status: "pendente",
      activity: "Adubação",
    },
    {
      id: "2",
      name: "Talhão 1",
      crop: "Soja",
      phase: "Emergência",
      status: "planejada",
      activity: "Pulverização",
    },
  ];

  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const greeting = `${getGreeting()}, ${profile?.nome?.split(' ')[0] || 'Produtor'}!`;

  return (
    <div className="flex flex-col gap-4 bg-gray-50 pb-16">
      {/* Top greeting text - without green background */}
      <div className="py-4 px-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">{greeting}</h1>
      </div>

      {/* Weather card - using the improved component */}
      <div className="mx-4">
        <WeatherPreview />
      </div>

      {/* Alert card - only shows if there's an alert */}
      {hasAlert && (
        <div className="mx-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm animate-fade-in">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-orange-700 font-semibold text-lg">Alerta de Praga</h3>
              <p className="text-orange-800">
                Atenção em <span className="font-semibold">{alertMessage}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Improved Diagnóstico button */}
      <Link to="/diagnostico" className="mx-4">
        <Button 
          className="w-full py-6 bg-gradient-to-r from-agro-green-500 to-agro-green-600 hover:from-agro-green-600 hover:to-agro-green-700 text-white rounded-xl shadow-md flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Leaf className="w-8 h-8" />
          <div className="text-left">
            <div className="text-xl font-semibold">Fazer Diagnóstico</div>
            <div className="text-sm">de Planta</div>
          </div>
        </Button>
      </Link>

      {/* Lavouras section - improved layout */}
      <div className="mx-4 mt-2">
        <h2 className="text-2xl font-bold mb-3">Suas Lavouras</h2>
        {lavouras.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              {lavouras.map((lavoura) => (
                <Link key={lavoura.id} to={`/lavouras/${lavoura.id}`}>
                  <Card className="p-4 h-full border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                    <h3 className="font-semibold">{lavoura.name}</h3>
                    <div className="text-agro-green-600 font-medium">{lavoura.crop}</div>
                    <div className="text-sm mt-1">
                      Fase: <span className={`px-2 py-0.5 rounded-full text-xs ${
                        lavoura.phase === "Crescimento" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>{lavoura.phase}</span>
                    </div>
                    {lavoura.activity && (
                      <div className="mt-2 py-1 px-2 rounded text-sm text-center bg-orange-100 text-orange-800">
                        {lavoura.activity} Pendente
                      </div>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Link 
                to="/lavouras" 
                className="text-sm text-agro-green-600 hover:text-agro-green-700 font-medium"
              >
                Ver todas &rarr;
              </Link>
            </div>
          </>
        ) : (
          <Card className="p-6 text-center border border-dashed border-gray-300 bg-white">
            <p className="text-gray-600 mb-4">Nenhuma lavoura cadastrada. Adicione sua primeira lavoura!</p>
            <Link to="/lavouras/nova">
              <Button className="bg-agro-green-500 hover:bg-agro-green-600">
                Adicionar Lavoura
              </Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Activities section - with improved component */}
      <div className="mx-4 mt-2">
        <ActivityPreview />
      </div>

      {/* Chat button */}
      <div className="fixed bottom-20 right-4 z-40">
        <ChatButton onClick={() => setShowChat(true)} isOpen={showChat} className="w-12 h-12 bg-white shadow-lg border-2 border-agro-green-300" />
      </div>
      <ChatDialog open={showChat} onOpenChange={setShowChat} />
    </div>
  );
};

export default Dashboard;
