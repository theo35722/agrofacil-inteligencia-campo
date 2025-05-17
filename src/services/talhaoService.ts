
import { supabase } from "@/integrations/supabase/client";
import { Talhao } from "@/types/agro";

// Serviço para Talhões
export const getTalhoes = async (lavouraId?: string): Promise<Talhao[]> => {
  let query = supabase
    .from('talhoes')
    .select('*')
    .order('nome');

  if (lavouraId) {
    query = query.eq('lavoura_id', lavouraId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao buscar talhões:", error);
    throw error;
  }

  return data || [];
};
