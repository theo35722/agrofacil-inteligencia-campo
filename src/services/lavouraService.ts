
import { supabase } from "@/integrations/supabase/client";
import { Lavoura } from "@/types/agro";

// Serviço para Lavouras
export const getLavouras = async (): Promise<Lavoura[]> => {
  try {
    const { data, error } = await supabase
      .from('lavouras')
      .select('*')
      .order('nome');

    if (error) {
      console.error("Erro ao buscar lavouras:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Falha na operação de buscar lavouras:", error);
    throw error;
  }
};

// Buscar uma lavoura específica por ID
export const getLavouraById = async (id: string): Promise<Lavoura | null> => {
  try {
    const { data, error } = await supabase
      .from('lavouras')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.warn(`Lavoura com ID ${id} não encontrada`);
        return null;
      }
      console.error(`Erro ao buscar lavoura ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Falha na operação de buscar lavoura ${id}:`, error);
    throw error;
  }
};

// Criar nova lavoura
export const createLavoura = async (lavoura: Omit<Lavoura, 'id' | 'criado_em' | 'atualizado_em'>): Promise<Lavoura> => {
  try {
    const { data, error } = await supabase
      .from('lavouras')
      .insert([lavoura])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar lavoura:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Falha na operação de criar lavoura:", error);
    throw error;
  }
};
