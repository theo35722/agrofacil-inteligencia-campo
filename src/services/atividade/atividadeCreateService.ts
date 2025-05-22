
import { supabase } from "@/integrations/supabase/client";
import { Atividade } from "@/types/agro";

// Criar nova atividade
export const createAtividade = async (atividade: Omit<Atividade, 'id' | 'criado_em' | 'atualizado_em'>): Promise<Atividade> => {
  try {
    console.log("Dados recebidos para criar atividade:", atividade);
    
    // Verificar campos obrigatórios
    if (!atividade.tipo || !atividade.talhao_id || !atividade.data_programada) {
      console.error("Dados obrigatórios ausentes:", { 
        tipo: atividade.tipo, 
        talhao_id: atividade.talhao_id, 
        data_programada: atividade.data_programada 
      });
      throw new Error("Dados obrigatórios para criar atividade estão ausentes");
    }

    const { data, error } = await supabase
      .from('atividades')
      .insert([atividade])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar atividade:", error);
      throw error;
    }

    console.log("Atividade criada com sucesso:", data);
    return data;
  } catch (error) {
    console.error("Falha na operação de criar atividade:", error);
    throw error;
  }
};
