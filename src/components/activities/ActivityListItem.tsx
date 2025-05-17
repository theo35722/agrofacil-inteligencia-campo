
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { Atividade } from "@/types/agro";

interface ActivityListItemProps {
  activity: Atividade & {
    field?: string;
    plot?: string;
  }
}

export function ActivityListItem({ activity }: ActivityListItemProps) {
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

  return (
    <div 
      className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 shadow-sm"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{activity.tipo}</h4>
            <Badge className={getStatusColor(activity.status)}>
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
        
        <div className="text-sm text-green-600 font-medium flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {activity.data_programada ? formatDate(activity.data_programada) : ""}
        </div>
      </div>
    </div>
  );
}
