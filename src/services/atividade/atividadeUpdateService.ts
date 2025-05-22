
import { supabase } from "@/integrations/supabase/client";
import { Atividade } from "@/types/agro";

// Função específica para atualizar apenas o status de uma atividade
export const updateAtividadeStatus = async (id: string, status: string): Promise<Atividade | null> => {
  try {
    console.log(`Atualizando status da atividade ${id} para ${status}`);
    
    const { data, error } = await supabase
      .from('atividades')
      .update({ status: status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Erro ao atualizar status da atividade ${id}:`, error);
      return null;
    }

    console.log(`Status da atividade ${id} atualizado com sucesso para ${status}`);
    return data;
  } catch (error) {
    console.error(`Falha na operação de atualizar status da atividade ${id}:`, error);
    return null;
  }
};

// Atualizar atividade existente
export const updateAtividade = async (id: string, atividade: Partial<Omit<Atividade, 'id' | 'criado_em' | 'atualizado_em'>>): Promise<Atividade> => {
  try {
    console.log(`Atualizando atividade ${id}:`, atividade);
    
    const { data, error } = await supabase
      .from('atividades')
      .update(atividade)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Erro ao atualizar atividade ${id}:`, error);
      throw error;
    }

    console.log(`Atividade ${id} atualizada com sucesso:`, data);
    return data;
  } catch (error) {
    console.error(`Falha na operação de atualizar atividade ${id}:`, error);
    throw error;
  }
};
