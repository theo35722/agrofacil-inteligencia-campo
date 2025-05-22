
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
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower.includes("penden")) {
      return "bg-orange-500 hover:bg-orange-600";
    }
    if (statusLower.includes("conclu")) {
      return "bg-green-500 hover:bg-green-600";
    }
    if (statusLower.includes("planej")) {
      return "bg-blue-400 hover:bg-blue-500";
    }
    return "bg-gray-400 hover:bg-gray-500";
  };

  // Function to handle marking an activity as complete
  const handleMarkComplete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log(`Marcando atividade ${activity.id} como concluída...`);
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

  // Normalize status for display
  const normalizeStatus = (status: string): string => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower.includes("conclu")) {
      return "Concluída";
    }
    if (statusLower.includes("penden")) {
      return "Pendente";
    }
    if (statusLower.includes("planej")) {
      return "Planejada";
    }
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pendente";
  };

  // Check if the activity is not already completed
  const showCompleteButton = !activity.status.toLowerCase().includes("conclu");

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
          {normalizeStatus(activity.status)}
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
