
import { useCallback, useState } from "react";
import { getLavouras } from "@/services/lavouraService";
import { getTalhoes } from "@/services/talhaoService";
import { Lavoura, Talhao } from "@/types/agro";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const useDashboardData = () => {
  const queryClient = useQueryClient();
  const [lavouras, setLavouras] = useState<Lavoura[]>([]);
  const [talhoes, setTalhoes] = useState<Talhao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data function using useCallback to prevent unnecessary rerenders
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Buscando dados para o dashboard...");
      
      // Carregar dados em paralelo para melhor performance
      const [lavourasData, talhoesData] = await Promise.all([
        getLavouras(),
        getTalhoes()
      ]);
      
      console.log("Lavouras carregadas:", lavourasData);
      setLavouras(lavourasData);
      
      console.log("Talhões carregados:", talhoesData);
      setTalhoes(talhoesData);

      // Also update the React Query cache for other components
      queryClient.setQueryData(['lavouras'], lavourasData);
      queryClient.setQueryData(['talhoes'], talhoesData);
      
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      setError("Não foi possível carregar os dados");
      toast.error("Não foi possível carregar os dados do dashboard");
    } finally {
      setLoading(false);
    }
  }, [queryClient]);

  return {
    lavouras,
    talhoes,
    loading,
    error,
    fetchDashboardData
  };
};
