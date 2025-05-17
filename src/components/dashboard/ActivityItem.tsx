
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Atividade, formatDate } from "@/types/agro";
import { Calendar } from "lucide-react";

interface ActivityItemProps {
  activity: Atividade;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
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

  return (
    <div 
      className="flex justify-between items-center p-2 rounded-md bg-white border border-gray-100 hover:bg-gray-50 mb-2 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center text-sm text-green-600 min-w-[70px]">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(activity.data_programada)}
        </div>
        <div>
          <p className="font-medium text-gray-800">{activity.tipo || "Sem tipo"}</p>
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
  );
};
