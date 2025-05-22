
import { useState, useEffect, useCallback } from "react";
import { CalendarCheck, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import { getAtividades } from "@/services/atividadeService";
import { getLavouras } from "@/services/lavouraService";
import { getTalhoes } from "@/services/talhaoService";
import { Atividade } from "@/types/agro";

// Import our components
import { ActivityForm } from "@/components/activities/ActivityForm";
import { ActivityList } from "@/components/activities/ActivityList";
import { ActivityHeader } from "@/components/activities/ActivityHeader";

interface Activity extends Atividade {
  field?: string;
  plot?: string;
}

interface Field {
  name: string;
  id: string;
  plots: {
    name: string;
    id: string;
  }[];
}

const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const isMobile = useIsMobile();
  
  // Função para buscar dados
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get real activities from database
      const atividadesData = await getAtividades();
      console.log("Atividades carregadas:", atividadesData);
      
      // Get lavouras for the form
      const lavourasData = await getLavouras();
      
      // Create fields array with plots for the form
      const fieldsWithPlots: Field[] = [];
      
      // For each lavoura, get its talhoes
      for (const lavoura of lavourasData) {
        const talhoesData = await getTalhoes(lavoura.id);
        console.log(`Talhões da lavoura ${lavoura.nome}:`, talhoesData);
        
        fieldsWithPlots.push({
          name: lavoura.nome,
          id: lavoura.id,
          plots: talhoesData.map(talhao => ({
            name: talhao.nome,
            id: talhao.id
          }))
        });
      }
      
      // Process activities to include field and plot names
      const processedActivities = await Promise.all(atividadesData.map(async (activity) => {
        // Get talhao details if available
        let field = "";
        let plot = "";
        
        if (activity.talhao?.id) {
          plot = activity.talhao.nome || "";
          
          // Get lavoura details
          if (activity.talhao.lavoura_id) {
            const lavoura = lavourasData.find(l => l.id === activity.talhao?.lavoura_id);
            field = lavoura?.nome || "";
          }
        }
        
        return {
          ...activity,
          field,
          plot
        };
      }));
      
      setActivities(processedActivities);
      setFields(fieldsWithPlots);
    } catch (error) {
      console.error("Erro ao carregar atividades:", error);
      toast.error("Não foi possível carregar as atividades");
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch actual data instead of using mock data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-4 animate-fade-in pb-16">
      <ActivityHeader 
        onNewActivity={() => setDialogOpen(true)}
        isMobile={isMobile}
      />
      
      <ActivityForm 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        fields={fields}
        onSuccess={fetchData}
      />
      
      <Card className="shadow-sm">
        <CardHeader className={`pb-2 ${isMobile ? 'px-3 pt-3' : ''}`}>
          <CardTitle className="flex justify-between items-center text-lg md:text-xl">
            <div className="flex items-center">
              <CalendarCheck className="h-5 w-5 mr-2 text-green-600" />
              <span className="text-green-800">Atividades</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <Filter className="h-4 w-4 mr-1" />
                  Filtrar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white shadow-md">
                {/* Conteúdo do dropdown será implementado conforme necessidade */}
                <div className="p-2 text-sm text-gray-500 text-center">
                  Filtros em breve
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
        </CardHeader>
        <CardContent className={isMobile ? 'px-3 py-2' : ''}>
          <Tabs defaultValue="all" value={activeTab} className="w-full">
            <ActivityList 
              activities={activities}
              loading={loading}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isMobile={isMobile}
              onStatusChange={fetchData}
            />
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Activities;
