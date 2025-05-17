
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ActivityHeaderProps {
  onNewActivity: () => void;
  isMobile: boolean;
}

export function ActivityHeader({ onNewActivity, isMobile }: ActivityHeaderProps) {
  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'justify-between'} items-start md:items-center gap-2 md:gap-0`}>
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-green-800 mb-1">
          Registro de Atividades
        </h1>
        <p className="text-sm text-gray-600">
          Gerencie as atividades da sua lavoura
        </p>
      </div>
      
      <Button 
        className="bg-green-500 hover:bg-green-600 w-full md:w-auto mt-2 md:mt-0"
        onClick={onNewActivity}
      >
        <Plus className="h-4 w-4 mr-2" /> Nova Atividade
      </Button>
    </div>
  );
}
