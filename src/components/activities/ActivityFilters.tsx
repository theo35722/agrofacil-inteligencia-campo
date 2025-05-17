
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ActivityFiltersProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  isMobile: boolean;
}

export function ActivityFilters({ activeTab, onTabChange, isMobile }: ActivityFiltersProps) {
  return (
    <TabsList className="mb-4 w-full grid grid-cols-4 h-auto">
      <TabsTrigger 
        value="all" 
        className="text-xs md:text-sm py-1" 
        onClick={() => onTabChange('all')}
        data-state={activeTab === "all" ? "active" : ""}
      >
        Todas
      </TabsTrigger>
      <TabsTrigger 
        value="pendente" 
        className="text-xs md:text-sm py-1"
        onClick={() => onTabChange('pendente')}
        data-state={activeTab === "pendente" ? "active" : ""}
      >
        Pendentes
      </TabsTrigger>
      <TabsTrigger 
        value="concluído" 
        className="text-xs md:text-sm py-1"
        onClick={() => onTabChange('concluído')}
        data-state={activeTab === "concluído" ? "active" : ""}
      >
        Concluídas
      </TabsTrigger>
      <TabsTrigger 
        value="planejado" 
        className="text-xs md:text-sm py-1"
        onClick={() => onTabChange('planejado')}
        data-state={activeTab === "planejado" ? "active" : ""}
      >
        Planejadas
      </TabsTrigger>
    </TabsList>
  );
}
