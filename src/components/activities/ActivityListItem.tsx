
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle } from "lucide-react";
import { Atividade } from "@/types/agro";
import { updateAtividadeStatus } from "@/services/atividadeService";
import { toast } from "sonner";

interface ActivityListItemProps {
  activity: Atividade & {
    field?: string;
    plot?: string;
  };
  isMobile?: boolean;
  onStatusChange?: () => void;
}

export function ActivityListItem({ activity, isMobile = false, onStatusChange }: ActivityListItemProps) {
  // Format date to Brazilian format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Get status color for badge
  const getStatusColor = (status: string) => {
    if (status === "concluído") return "bg-green-500 hover:bg-green-600";
    if (status === "pendente") return "bg-orange-500 hover:bg-orange-600";
    return "bg-blue-400 hover:bg-blue-500";
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
      className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 shadow-sm transition-all"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium">{activity.tipo}</h4>
            <Badge className={`${getStatusColor(activity.status)} ${isMobile ? 'text-xs px-1.5 py-0' : ''}`}>
              {activity.status}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 mt-1">
            {activity.field ? `${activity.field} - ${activity.plot}` : activity.plot}
          </p>
          
          {activity.descricao && (
            <p className="text-sm text-gray-500 mt-2">
              {activity.descricao}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-green-600 font-medium flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {activity.data_programada ? formatDate(activity.data_programada) : ""}
          </div>
          
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
    </div>
  );
}
