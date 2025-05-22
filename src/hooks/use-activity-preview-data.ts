
import { useState, useEffect, useCallback } from "react";
import { getAtividades } from "@/services/atividade";
import { Atividade } from "@/types/agro";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useActivityPreviewData = () => {
  const { profile } = useAuth();
  const [activities, setActivities] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Buscando atividades para o dashboard...");
      
      // Buscar atividades pendentes e planejadas para a dashboard
      const data = await getAtividades({ 
        limit: 5, 
        upcoming: true,
        includeConcluidas: false, // Excluir atividades concluídas
        includeStatus: ['pendente', 'planejado', 'Planejado', 'Pendente'] // Garantir que busque pendentes e planejadas com case insensitive
      });
      
      console.log("Atividades carregadas para o dashboard:", data);
      
      if (data && data.length > 0) {
        setActivities(data);
      } else {
        console.log("Nenhuma atividade encontrada para o dashboard");
        setActivities([]);
      }
    } catch (error) {
      console.error("Erro ao carregar atividades:", error);
      setError("Não foi possível carregar as atividades");
      toast.error("Não foi possível carregar as atividades");
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    loading,
    error,
    handleRetry: fetchActivities,
    fetchActivities
  };
};
