
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticoPraga, PlagueAlertData } from "@/types/agro";

// Serviço para Diagnósticos de Pragas
export const getDiagnosticosPragas = async (
  options: {
    limit?: number;
    talhaoId?: string;
    recentOnly?: boolean;
  } = {}
): Promise<DiagnosticoPraga[]> => {
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

    if (options.recentOnly) {
      // Buscar apenas diagnósticos dos últimos 7 dias
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query = query.gte('data_diagnostico', sevenDaysAgo.toISOString());
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar diagnósticos:", error);
      throw error;
    }

    console.log(`Diagnósticos carregados: ${data?.length || 0}`);
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

// Função para determinar alertas de pragas com base em diagnósticos, cultura e clima
export const determinePlagueAlerts = async (
  weatherData?: { description: string; humidity: number }
): Promise<PlagueAlertData> => {
  try {
    // Verificar condições climáticas primeiro
    if (weatherData) {
      const { description, humidity } = weatherData;
      const isWarm = description.toLowerCase().includes('calor') || description.toLowerCase().includes('quente');
      const isHumid = humidity > 70;
      const isRainy = description.toLowerCase().includes('chuva') || description.toLowerCase().includes('chuvoso');

      // Mesmo sem diagnósticos, se as condições climáticas favorecem pragas
      if ((isWarm && isHumid) || isRainy) {
        console.log("Condições climáticas favoráveis para pragas detectadas", { isWarm, isHumid, isRainy, humidity });
        return {
          hasAlert: true,
          message: `Condições favoráveis para pragas nas lavouras`,
          severity: "low",
          culturas: ["Todas as culturas"]
        };
      }
    }
    
    // Buscar diagnósticos recentes
    try {
      const diagnosticos = await getDiagnosticosPragas({ recentOnly: true });
      
      // Se não houver diagnósticos recentes, retornar estado normal
      if (diagnosticos.length === 0) {
        return { 
          hasAlert: false, 
          message: "Nenhum alerta de pragas no momento" 
        };
      }

      // Agrupar culturas afetadas
      const culturas = [...new Set(diagnosticos.map(d => d.talhao?.cultura).filter(Boolean))];
      
      // Se houver diagnósticos recentes, determinar severidade do alerta
      if (diagnosticos.some(d => d.nivel_infestacao === 'alto')) {
        // Alerta de alta severidade
        const culturasAfetadas = culturas.join(', ');
        return {
          hasAlert: true,
          message: `Infestação grave de pragas em ${culturasAfetadas}`,
          severity: "high",
          culturas
        };
      }

      // Alerta de baixa severidade se houver diagnósticos, mas não críticos
      if (diagnosticos.length > 0) {
        const culturasAfetadas = culturas.join(', ');
        return {
          hasAlert: true,
          message: `Monitorar pragas em ${culturasAfetadas}`,
          severity: "low",
          culturas
        };
      }
    } catch (error) {
      console.error("Erro ao buscar diagnósticos de pragas:", error);
      // Continua a execução para retornar pelo menos a mensagem padrão
    }

    // Sem alerta caso nenhuma das condições acima seja verdadeira
    return { 
      hasAlert: false, 
      message: "Nenhum alerta de pragas no momento" 
    };
    
  } catch (error) {
    console.error("Erro ao determinar alertas de pragas:", error);
    // Fallback de segurança
    return { 
      hasAlert: false, 
      message: "Erro ao verificar alertas de pragas"
    };
  }
};
