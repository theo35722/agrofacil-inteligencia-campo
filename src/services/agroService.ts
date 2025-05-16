
import { supabase } from "@/integrations/supabase/client";
import { Lavoura, Talhao, Atividade, DiagnosticoPraga, PlagueAlertData } from "@/types/agro";

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

// Serviço para Atividades
export const getAtividades = async (
  options: { 
    limit?: number; 
    talhaoId?: string; 
    status?: string;
    upcoming?: boolean;
  } = {}
): Promise<Atividade[]> => {
  // Construir query base
  let query = supabase
    .from('atividades')
    .select(`
      *,
      talhao:talhao_id (
        id,
        nome,
        cultura,
        fase
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

  return data || [];
};

// Serviço para Diagnósticos de Pragas
export const getDiagnosticosPragas = async (
  options: {
    limit?: number;
    talhaoId?: string;
    recentOnly?: boolean;
  } = {}
): Promise<DiagnosticoPraga[]> => {
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

  return data || [];
};

// Função para determinar alertas de pragas com base em diagnósticos, cultura e clima
export const determinePlagueAlerts = async (
  weatherData?: { description: string; humidity: number }
): Promise<PlagueAlertData> => {
  try {
    // Buscar diagnósticos recentes
    const diagnosticos = await getDiagnosticosPragas({ recentOnly: true });
    
    // Se não houver diagnósticos recentes, não há alerta
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

    // Verificar se condições climáticas favorecem pragas
    if (weatherData) {
      const { description, humidity } = weatherData;
      const isWarm = description.toLowerCase().includes('calor') || description.toLowerCase().includes('quente');
      const isHumid = humidity > 70;
      const isRainy = description.toLowerCase().includes('chuva') || description.toLowerCase().includes('chuvoso');

      // Condições favoráveis a pragas
      if ((isWarm && isHumid) || isRainy) {
        return {
          hasAlert: true,
          message: `Condições favoráveis para pragas em ${culturas.join(', ')}`,
          severity: "medium",
          culturas
        };
      }
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

    // Sem alerta caso nenhuma das condições acima seja verdadeira
    return { 
      hasAlert: false, 
      message: "Nenhum alerta de pragas no momento" 
    };
    
  } catch (error) {
    console.error("Erro ao determinar alertas de pragas:", error);
    return { 
      hasAlert: false, 
      message: "Erro ao verificar alertas de pragas"
    };
  }
};
