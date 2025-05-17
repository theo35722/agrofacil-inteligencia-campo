import { useState, useEffect } from "react";
import { getAtividades } from "@/services/atividadeService";
import { Atividade } from "@/types/agro";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for when real data is not available
const mockActivities = [
  {
    id: "mock-act-1",
    tipo: "Irrigação",
    data_programada: "2025-05-20",
    status: "Pendente",
    talhao: {
      id: "mock-1-1",
      nome: "Talhão 1",
      cultura: "Soja"
    },
    user_id: "mock-user"
  },
  {
    id: "mock-act-2",
    tipo: "Adubação",
    data_programada: "2025-05-22",
    status: "Planejada",
    talhao: {
      id: "mock-1-2",
      nome: "Talhão 2",
      cultura: "Soja"
    },
    user_id: "mock-user"
  },
  {
    id: "mock-act-3",
    tipo: "Aplicação de Defensivos",
    data_programada: "2025-05-25",
    status: "Pendente",
    talhao: {
      id: "mock-1-3",
      nome: "Talhão 3",
      cultura: "Milho"
    },
    user_id: "mock-user"
  }
] as Atividade[];

export const useActivityPreviewData = () => {
  const { profile } = useAuth();
  const [activities, setActivities] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Pequeno atraso para evitar conflito de recursos com outras requisições do dashboard
      const data = await getAtividades({ 
        limit: 5, 
        upcoming: true 
      });
      console.log("Atividades carregadas para o dashboard:", data);
      
      // If we have real data, use it
      if (data && data.length > 0) {
        setActivities(data);
      } 
      // Otherwise, if we're authenticated, use mock data
      else if (profile) {
        console.log("Usando dados mocados para atividades");
        setActivities(mockActivities);
      } else {
        console.log("Nenhuma atividade encontrada para exibir no dashboard");
        setActivities([]);
      }
    } catch (error) {
      console.error("Erro ao carregar atividades:", error);
      // On error, if authenticated, use mock data
      if (profile) {
        setActivities(mockActivities);
        toast.error("Usando dados de exemplo para atividades");
      } else {
        setError("Não foi possível carregar as atividades");
        toast.error("Não foi possível carregar as atividades");
      }
    } finally {
      // Definir loading como false ao concluir, mesmo em caso de erro
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
