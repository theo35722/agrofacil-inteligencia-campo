
import { useState, useEffect } from "react";
import { getLavouras } from "@/services/lavouraService";
import { getTalhoes } from "@/services/talhaoService";
import { Lavoura, Talhao } from "@/types/agro";
import { useIsMobile } from "@/hooks/use-mobile";
import { AddTalhaoDialog } from "@/components/talhao/AddTalhaoDialog";
import FieldsHeader from "@/components/farm/FieldsHeader";
import LoadingFarmState from "@/components/farm/LoadingFarmState";
import EmptyFarmState from "@/components/farm/EmptyFarmState";
import FarmCard from "@/components/farm/FarmCard";
import AddFarmDialog from "@/components/farm/AddFarmDialog";
import { toast } from "sonner";

interface Field extends Lavoura {
  plots: Talhao[];
}

const Fields = () => {
  const [farms, setFarms] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  
  const [expandedFarm, setExpandedFarm] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [talhaoDialogOpen, setTalhaoDialogOpen] = useState(false);
  const [currentFarmId, setCurrentFarmId] = useState<string | null>(null);
  
  // Fetch data from database
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get lavouras
      const lavourasData = await getLavouras();
      
      // Create farms array with plots
      const farmsWithPlots: Field[] = [];
      
      // For each lavoura, get its talhoes
      for (const lavoura of lavourasData) {
        const talhoesData = await getTalhoes(lavoura.id);
        
        farmsWithPlots.push({
          ...lavoura,
          plots: talhoesData
        });
      }
      
      setFarms(farmsWithPlots);
    } catch (error) {
      console.error("Erro ao carregar lavouras:", error);
      toast.error("Não foi possível carregar as lavouras");
    } finally {
      setLoading(false);
    }
  };
  
  const toggleFarmExpand = (farmId: string) => {
    setExpandedFarm(expandedFarm === farmId ? null : farmId);
  };
  
  const openAddPlotDialog = (farmId: string) => {
    setCurrentFarmId(farmId);
    setTalhaoDialogOpen(true);
  };
  
  const openAddFarmDialog = () => {
    setDialogOpen(true);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <FieldsHeader onAddFarm={openAddFarmDialog} />
      
      {loading ? (
        <LoadingFarmState />
      ) : farms.length === 0 ? (
        <EmptyFarmState />
      ) : (
        <div className={`space-y-4 ${isMobile ? "px-1" : ""}`}>
          {farms.map((farm) => (
            <FarmCard
              key={farm.id}
              id={farm.id}
              name={farm.nome}
              area={farm.area_total}
              location={farm.localizacao}
              plots={farm.plots}
              expandedFarm={expandedFarm}
              toggleFarmExpand={toggleFarmExpand}
              openAddPlotDialog={openAddPlotDialog}
              onUpdateSuccess={fetchData}
            />
          ))}
        </div>
      )}
      
      <AddFarmDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchData}
      />
      
      {currentFarmId && (
        <AddTalhaoDialog
          open={talhaoDialogOpen}
          onOpenChange={setTalhaoDialogOpen}
          farmId={currentFarmId}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default Fields;
