
import { useState, useEffect } from "react";
import { getAtividades } from "@/services/atividadeService";
import { Atividade } from "@/types/agro";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useActivityPreviewData = () => {
  const { profile } = useAuth();
  const [activities, setActivities] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Small delay to avoid resource conflicts with other dashboard requests
      const data = await getAtividades({ 
        limit: 5, 
        upcoming: true 
      });
      console.log("Atividades carregadas para o dashboard:", data);
      
      setActivities(data || []);
    } catch (error) {
      console.error("Erro ao carregar atividades:", error);
      setError("Não foi possível carregar as atividades");
      toast.error("Não foi possível carregar as atividades");
    } finally {
      // Always set loading to false when done, even if there was an error
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [profile]);

  return {
    activities,
    loading,
    error,
    handleRetry: fetchActivities
  };
};
