
import React, { useEffect, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { getAtividades } from "@/services/atividadeService"; // Fixed import to use specific service
import { Atividade, formatDate } from "@/types/agro";
import { toast } from "sonner";

export const ActivityPreview = () => {
  const [activities, setActivities] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await getAtividades({ 
          limit: 5, 
          upcoming: true 
        });
        console.log("Atividades carregadas para o dashboard:", data);
        setActivities(data);
      } catch (error) {
        console.error("Erro ao carregar atividades:", error);
        toast.error("Não foi possível carregar as atividades");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Function to get the color of the badge based on status
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
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
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <div 
              key={activity.id}
              className="flex justify-between items-center p-2 rounded-md bg-white border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500">
                  {formatDate(activity.data_programada)}
                </div>
                <div>
                  <p className="font-medium">{activity.tipo}</p>
                  <p className="text-xs text-gray-500">
                    {activity.talhao ? `${activity.talhao.nome} - ${activity.talhao.cultura}` : "Talhão não encontrado"}
                  </p>
                </div>
              </div>
              <div>
                <Badge className={getStatusColor(activity.status)}>
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="py-2 px-3 text-sm text-gray-500">
            Nenhuma atividade programada.
          </div>
        )}

        <div className="pt-2">
          <Link 
            to="/atividades" 
            className="text-sm text-green-600 hover:text-green-700 font-medium flex justify-end"
          >
            Ver todas &rarr;
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
