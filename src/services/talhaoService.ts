
import { supabase } from "@/integrations/supabase/client";
import { Talhao } from "@/types/agro";

// Serviço para Talhões
export const getTalhoes = async (lavouraId?: string): Promise<Talhao[]> => {
  try {
    let query = supabase
      .from('talhoes')
      .select(`
        *,
        lavoura:lavoura_id (
          id,
          nome
        )
      `)
      .order('nome');

    if (lavouraId) {
      query = query.eq('lavoura_id', lavouraId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar talhões:", error);
      throw error;
    }

    console.log("Talhões carregados:", data);
    return data || [];
  } catch (error) {
    console.error("Falha na operação de buscar talhões:", error);
    throw error;
  }
};

// Buscar um talhão específico por ID
export const getTalhaoById = async (id: string): Promise<Talhao | null> => {
  try {
    const { data, error } = await supabase
      .from('talhoes')
      .select(`
        *,
        lavoura:lavoura_id (
          id,
          nome
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.warn(`Talhão com ID ${id} não encontrado`);
        return null;
      }
      console.error(`Erro ao buscar talhão ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Falha na operação de buscar talhão ${id}:`, error);
    throw error;
  }
};

// Criar um novo talhão
export const createTalhao = async (talhaoData: Omit<Talhao, 'id' | 'criado_em' | 'atualizado_em'>): Promise<Talhao> => {
  try {
    console.log("Criando talhão:", talhaoData);

    const { data, error } = await supabase
      .from('talhoes')
      .insert(talhaoData)
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar talhão:", error);
      throw error;
    }

    console.log("Talhão criado com sucesso:", data);
    return data;
  } catch (error) {
    console.error("Falha na operação de criar talhão:", error);
    throw error;
  }
};
