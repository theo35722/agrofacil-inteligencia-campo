
import { supabase } from "@/integrations/supabase/client";
import { Lavoura } from "@/types/agro";

// Serviço para Lavouras
export const getLavouras = async (): Promise<Lavoura[]> => {
  const { data, error } = await supabase
    .from('lavouras')
    .select('*')
    .order('nome');

  if (error) {
    console.error("Erro ao buscar lavouras:", error);
    throw error;
  }

  return data || [];
};
