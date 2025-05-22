
import { useState, useEffect, useCallback } from "react";
import { getAtividades } from "@/services/atividadeService";
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
      
      // Buscar atividades pendentes e planejadas para a dashboard
      // Importante: incluir explicitamente atividades pendentes
      const data = await getAtividades({ 
        limit: 5, 
        upcoming: true,
        includeConcluidas: false, // Excluir atividades concluídas
        includeStatus: ['pendente', 'planejado'] // Garantir que busque pendentes e planejadas
      });
      
      console.log("Atividades carregadas para o dashboard:", data);
      setActivities(data || []);
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
