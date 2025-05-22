
import { supabase } from "@/integrations/supabase/client";

// Excluir atividade
export const deleteAtividade = async (id: string): Promise<void> => {
  try {
    console.log(`Excluindo atividade ${id}`);
    
    const { error } = await supabase
      .from('atividades')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Erro ao excluir atividade ${id}:`, error);
      throw error;
    }
    
    console.log(`Atividade ${id} excluída com sucesso`);
  } catch (error) {
    console.error(`Falha na operação de excluir atividade ${id}:`, error);
    throw error;
  }
};
