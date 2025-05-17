
import { supabase } from "@/integrations/supabase/client";
import { Atividade } from "@/types/agro";

// Serviço para Atividades
export const getAtividades = async (
  options: { 
    limit?: number; 
    talhaoId?: string; 
    status?: string;
    upcoming?: boolean;
  } = {}
): Promise<Atividade[]> => {
  // Construir query base
  let query = supabase
    .from('atividades')
    .select(`
      *,
      talhao:talhao_id (
        id,
        nome,
        cultura,
        fase
      )
    `)
    .order('data_programada');

  // Aplicar filtros conforme opções
  if (options.upcoming) {
    // Buscar apenas atividades futuras ou de hoje
    const today = new Date().toISOString().split('T')[0];
    query = query.gte('data_programada', today);
  }

  if (options.talhaoId) {
    query = query.eq('talhao_id', options.talhaoId);
  }

  if (options.status) {
    query = query.eq('status', options.status);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao buscar atividades:", error);
    throw error;
  }

  return data || [];
};
