import React, { useEffect, useState } from "react";
import { CalendarCheck, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { getAtividades } from "@/services/atividadeService";
import { Atividade, formatDate } from "@/types/agro";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for when real data is not available
const mockActivities = [
  {
    id: "mock-act-1",
    tipo: "Irrigação",
    data_programada: "2025-05-20",
    status: "Pendente",
    talhao: {
      id: "mock-1-1",
      nome: "Talhão 1",
      cultura: "Soja"
    },
    user_id: "mock-user"
  },
  {
    id: "mock-act-2",
    tipo: "Adubação",
    data_programada: "2025-05-22",
    status: "Planejada",
    talhao: {
      id: "mock-1-2",
      nome: "Talhão 2",
      cultura: "Soja"
    },
    user_id: "mock-user"
  },
  {
    id: "mock-act-3",
    tipo: "Aplicação de Defensivos",
    data_programada: "2025-05-25",
    status: "Pendente",
    talhao: {
      id: "mock-1-3",
      nome: "Talhão 3",
      cultura: "Milho"
    },
    user_id: "mock-user"
  }
];

export const ActivityPreview = () => {
  const { profile } = useAuth();
  const [activities, setActivities] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAtividades({ 
          limit: 5, 
          upcoming: true 
        });
        console.log("Atividades carregadas para o dashboard:", data);
        
        // If we have real data, use it
        if (data && data.length > 0) {
          setActivities(data);
        } 
        // Otherwise, if we're authenticated, use mock data
        else if (profile) {
          console.log("Usando dados mocados para atividades");
          setActivities(mockActivities as Atividade[]);
        } else {
          console.log("Nenhuma atividade encontrada para exibir no dashboard");
          setActivities([]);
        }
      } catch (error) {
        console.error("Erro ao carregar atividades:", error);
        // On error, if authenticated, use mock data
        if (profile) {
          setActivities(mockActivities as Atividade[]);
        } else {
          setError("Não foi possível carregar as atividades");
          toast.error("Não foi possível carregar as atividades");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [profile]);

  // Function to get the color of the badge based on status
  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case "pendente":
        return "bg-orange-500 hover:bg-orange-600";
      case "concluída":
      case "concluida":
        return "bg-green-500 hover:bg-green-600";
      case "planejada":
        return "bg-blue-400 hover:bg-blue-500";
      default:
        return "bg-gray-400 hover:bg-gray-500";
    }
  };
  
  // Retry function
  const handleRetry = () => {
    setActivities([]);
    setLoading(true);
    setError(null);
  };

  return (
    <Card className="border border-gray-100 shadow-sm bg-white">
      <CardHeader className="pb-0 pt-3 px-3">
        <CardTitle className="text-xl flex justify-between items-center">
          Próximas Atividades
          <CalendarCheck className="h-5 w-5 text-gray-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-3">
        {loading ? (
          <div className="py-2 px-3 text-sm text-gray-500">Carregando atividades...</div>
        ) : error ? (
          <div className="py-2 px-3 text-sm text-red-500 flex flex-col items-center">
            <AlertCircle className="h-5 w-5 mb-1" />
            <p>{error}</p>
            <button 
              onClick={handleRetry}
              className="mt-2 text-xs text-green-600 hover:text-green-700"
            >
              Tentar novamente
            </button>
          </div>
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <div 
              key={activity.id}
              className="flex justify-between items-center p-2 rounded-md bg-white border border-gray-100 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500">
                  {formatDate(activity.data_programada)}
                </div>
                <div>
                  <p className="font-medium">{activity.tipo || "Sem tipo"}</p>
                  <p className="text-xs text-gray-500">
                    {activity.talhao ? 
                      `${activity.talhao.nome || "Talhão sem nome"} - ${activity.talhao.cultura || "Sem cultura"}` 
                      : "Talhão não encontrado"}
                  </p>
                </div>
              </div>
              <div>
                <Badge className={getStatusColor(activity.status)}>
                  {activity.status ? (activity.status.charAt(0).toUpperCase() + activity.status.slice(1)) : "Pendente"}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="py-2 px-3 text-sm text-center text-gray-500">
            <p>Nenhuma atividade programada.</p>
            <Link 
              to="/atividades" 
              className="mt-2 text-green-600 hover:text-green-700 inline-block"
            >
              Adicionar atividade
            </Link>
          </div>
        )}

        {activities.length > 0 && (
          <div className="pt-2">
            <Link 
              to="/atividades" 
              className="text-sm text-green-600 hover:text-green-700 font-medium flex justify-end"
            >
              Ver todas &rarr;
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
