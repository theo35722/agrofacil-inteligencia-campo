
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
  try {
    console.log("Buscando atividades com opções:", options);
    
    // Construir query base
    let query = supabase
      .from('atividades')
      .select(`
        *,
        talhao:talhao_id (
          id,
          nome,
          cultura,
          fase,
          lavoura_id
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

    console.log("Atividades carregadas:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error("Falha na operação de buscar atividades:", error);
    throw error;
  }
};

// Buscar uma atividade específica por ID
export const getAtividadeById = async (id: string): Promise<Atividade | null> => {
  try {
    console.log(`Buscando atividade com ID: ${id}`);
    
    const { data, error } = await supabase
      .from('atividades')
      .select(`
        *,
        talhao:talhao_id (
          id,
          nome,
          cultura,
          fase,
          lavoura_id
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.warn(`Atividade com ID ${id} não encontrada`);
        return null;
      }
      console.error(`Erro ao buscar atividade ${id}:`, error);
      throw error;
    }

    console.log(`Atividade ${id} encontrada:`, data);
    return data;
  } catch (error) {
    console.error(`Falha na operação de buscar atividade ${id}:`, error);
    throw error;
  }
};

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
