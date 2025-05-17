
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticoPraga, PlagueAlertData } from "@/types/agro";
import { determinePlaguePotential } from "@/services/openWeatherService";

// Buscar diagnósticos de pragas
export const getDiagnosticosPragas = async (options: { 
  limit?: number; 
  talhaoId?: string;
}): Promise<DiagnosticoPraga[]> => {
  try {
    let query = supabase
      .from('diagnosticos_pragas')
      .select(`
        *,
        talhao:talhao_id (
          id,
          nome,
          cultura,
          fase
        )
      `)
      .order('data_diagnostico', { ascending: false });

    if (options.talhaoId) {
      query = query.eq('talhao_id', options.talhaoId);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar diagnósticos de pragas:", error);
      throw error;
    }

    console.log("Diagnósticos carregados:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error("Falha na operação de buscar diagnósticos:", error);
    throw error;
  }
};

// Buscar um diagnóstico específico por ID
export const getDiagnosticoById = async (id: string): Promise<DiagnosticoPraga | null> => {
  try {
    const { data, error } = await supabase
      .from('diagnosticos_pragas')
      .select(`
        *,
        talhao:talhao_id (
          id,
          nome,
          cultura,
          fase
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.warn(`Diagnóstico com ID ${id} não encontrado`);
        return null;
      }
      console.error(`Erro ao buscar diagnóstico ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Falha na operação de buscar diagnóstico ${id}:`, error);
    throw error;
  }
};

// Determinar alertas de pragas com base no clima atual e nas culturas cadastradas
export const determinePlagueAlerts = async (weatherData: {
  description: string;
  humidity: number;
}): Promise<PlagueAlertData> => {
  try {
    console.log("Verificando alertas de pragas com dados:", weatherData);
    
    if (!weatherData || !weatherData.description) {
      console.log("Dados climáticos insuficientes para verificar alertas");
      return {
        hasAlert: false,
        message: "Aguardando dados climáticos para verificar alertas"
      };
    }
    
    // Buscar talhões para verificar culturas
    const { data: talhoes, error } = await supabase
      .from('talhoes')
      .select('cultura')
      .is('status', null) // Sem status específico ou
      .or('status.neq.inativo'); // Status não inativo
    
    if (error) {
      console.error("Erro ao buscar culturas para verificação de pragas:", error);
      return {
        hasAlert: false,
        message: "Erro ao verificar alertas de pragas"
      };
    }
    
    if (!talhoes || talhoes.length === 0) {
      console.log("Nenhuma cultura encontrada, usando culturas de demonstração");
      // Usar culturas de demonstração se não houver dados reais
      const demoCultures = ["soja", "milho", "feijão", "capim"];
      
      // Verificar cada cultura de demonstração
      for (const cultura of demoCultures) {
        const plagueCheck = determinePlaguePotential(
          cultura,
          weatherData.description,
          weatherData.humidity
        );
        
        // Se encontrou um alerta, retorna imediatamente
        if (plagueCheck.hasAlert) {
          console.log(`Alerta detectado para ${cultura}:`, plagueCheck);
          return plagueCheck;
        }
      }
      
      return {
        hasAlert: false,
        message: "Monitoramento de pragas ativo. Nenhum alerta no momento."
      };
    }
    
    // Manter registro de culturas verificadas para não duplicar alertas
    const checkedCultures = new Set<string>();
    let highestAlert: PlagueAlertData = {
      hasAlert: false,
      message: "Monitoramento de pragas ativo. Nenhum alerta no momento."
    };
    
    // Verificar cada cultura
    for (const talhao of talhoes) {
      if (talhao.cultura && !checkedCultures.has(talhao.cultura)) {
        checkedCultures.add(talhao.cultura);
        
        const plagueCheck = determinePlaguePotential(
          talhao.cultura,
          weatherData.description,
          weatherData.humidity
        );
        
        console.log(`Verificação de pragas para ${talhao.cultura}:`, plagueCheck);
        
        // Priorizar alertas de severidade alta
        if (plagueCheck.hasAlert) {
          if (!highestAlert.hasAlert || 
              (plagueCheck.severity === 'high' && highestAlert.severity !== 'high') ||
              (plagueCheck.severity === 'medium' && highestAlert.severity === 'low')) {
            highestAlert = plagueCheck;
          }
        }
      }
    }
    
    return highestAlert;
  } catch (error) {
    console.error("Erro ao determinar alertas de pragas:", error);
    return {
      hasAlert: false,
      message: "Monitoramento de pragas ativo. Erro ao verificar alertas."
    };
  }
};
