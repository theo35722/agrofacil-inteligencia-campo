
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Atividade, formatDate } from "@/types/agro";
import { Calendar, CheckCircle } from "lucide-react";
import { updateAtividadeStatus } from "@/services/atividade";
import { toast } from "sonner";

interface ActivityItemProps {
  activity: Atividade;
  onStatusChange?: () => void;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onStatusChange }) => {
  // Function to get the color of the badge based on status
  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case "pendente":
        return "bg-orange-500 hover:bg-orange-600";
      case "concluída":
      case "concluido":
      case "concluída":
      case "concluído":
        return "bg-green-500 hover:bg-green-600";
      case "planejada":
      case "planejado":
        return "bg-blue-400 hover:bg-blue-500";
      default:
        return "bg-gray-400 hover:bg-gray-500";
    }
  };

  // Function to handle marking an activity as complete
  const handleMarkComplete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await updateAtividadeStatus(activity.id, "concluído");
      toast.success("Atividade marcada como concluída!");
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error("Erro ao marcar atividade como concluída:", error);
      toast.error("Erro ao atualizar atividade");
    }
  };

  // Check if the activity is not already completed
  const showCompleteButton = activity.status.toLowerCase() !== "concluído" && 
                             activity.status.toLowerCase() !== "concluida" &&
                             activity.status.toLowerCase() !== "concluída";

  return (
    <div 
      className="flex justify-between items-center p-2 rounded-md bg-white border border-gray-100 hover:bg-gray-50 mb-2 shadow-sm relative"
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
      <div className="flex items-center gap-2">
        <Badge className={getStatusColor(activity.status)}>
          {activity.status ? (activity.status.charAt(0).toUpperCase() + activity.status.slice(1)) : "Pendente"}
        </Badge>
        
        {showCompleteButton && (
          <button 
            onClick={handleMarkComplete} 
            className="text-green-600 hover:text-green-700 ml-1 p-1"
            title="Marcar como concluída"
          >
            <CheckCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};
