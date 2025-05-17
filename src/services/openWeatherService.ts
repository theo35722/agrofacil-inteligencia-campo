import { supabase } from "@/integrations/supabase/client";
import { PlagueAlertData } from "@/types/agro";

// Buscar dados do clima para uma localização específica (por coordenadas)
export const fetchWeatherData = async (
  lat: number,
  lon: number
): Promise<any> => {
  try {
    // Obter o token de autenticação atual do Supabase
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    if (!accessToken) {
      console.warn('Usuário não autenticado ao buscar dados do clima');
    }

    // Configurar os headers necessários para a requisição
    const headers = {
      'Authorization': `Bearer ${accessToken || ''}`,
      'Content-Type': 'application/json',
      'apikey': process.env.SUPABASE_ANON_KEY || ''
    };

    // Fazer a requisição para a função Edge do Supabase
    const response = await fetch(
      `https://euzaloymjefsdravbmcd.functions.supabase.co/get-weather-data`,
      {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ latitude: lat, longitude: lon })
      }
    );

    if (!response.ok) {
      throw new Error(`Falha na API de clima: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados climáticos:", error);
    throw error;
  }
};

// Função para determinar potencial de pragas com base no clima
export const determinePlaguePotential = (
  culture: string,
  weatherDescription: string,
  humidity: number
): PlagueAlertData => {
  // Converter cultura e descrição para minúsculas para facilitar comparações
  const lowerCulture = culture.toLowerCase();
  const lowerDesc = weatherDescription.toLowerCase();
  
  // Verificar condições climáticas que favorecem pragas
  const isHot = lowerDesc.includes('calor') || 
                lowerDesc.includes('quente') || 
                lowerDesc.includes('sol');
  const isRainy = lowerDesc.includes('chuva') || 
                  lowerDesc.includes('chuvoso');
  const isHumid = humidity > 70;
  
  // Mapeamento de culturas para pragas comuns e suas condições favoráveis
  const plagueMap: Record<string, {
    name: string;
    conditions: { hot?: boolean; rainy?: boolean; humid?: boolean };
    severity: "low" | "medium" | "high";
    recommendation: string;
  }[]> = {
    'soja': [
      {
        name: 'Ferrugem Asiática',
        conditions: { rainy: true, humid: true },
        severity: "high",
        recommendation: 'Monitore diariamente e considere aplicação preventiva de fungicidas'
      },
      {
        name: 'Lagartas',
        conditions: { hot: true },
        severity: "medium",
        recommendation: 'Inspecione o nível de desfolha e planeje controle se necessário'
      },
      {
        name: 'Percevejos',
        conditions: { hot: true, humid: true },
        severity: "medium",
        recommendation: 'Verifique presença em vagens e planeje manejo se acima do nível de dano'
      }
    ],
    'milho': [
      {
        name: 'Lagarta-do-cartucho',
        conditions: { hot: true, humid: true },
        severity: "high",
        recommendation: 'Faça inspeção frequente e considere controle químico ou biológico'
      },
      {
        name: 'Cigarrinha-do-milho',
        conditions: { humid: true },
        severity: "medium",
        recommendation: 'Monitore a presença e transmissão potencial do vírus do enfezamento'
      }
    ],
    'feijão': [
      {
        name: 'Mosca-branca',
        conditions: { hot: true, humid: true },
        severity: "medium",
        recommendation: 'Monitore a presença nas folhas e aplique controle se necessário'
      },
      {
        name: 'Antracnose',
        conditions: { rainy: true, humid: true },
        severity: "high",
        recommendation: 'Aplique fungicidas preventivamente em períodos chuvosos'
      }
    ],
    'capim': [
      {
        name: 'Cigarrinha-das-pastagens',
        conditions: { rainy: true, humid: true },
        severity: "medium",
        recommendation: 'Monitore a presença de espuma na base das plantas'
      },
      {
        name: 'Percevejo-castanho',
        conditions: { hot: true },
        severity: "medium",
        recommendation: 'Verifique a presença nas raízes e planeje manejo do solo'
      }
    ],
  };
  
  // Verificar se a cultura está no mapa
  const plagueInfo = plagueMap[lowerCulture] || [];
  
  if (plagueInfo.length === 0) {
    // Cultura não mapeada, retornar alerta genérico baseado apenas nas condições climáticas
    if ((isHot && isHumid) || (isRainy && isHumid)) {
      return {
        hasAlert: true,
        message: `Condições climáticas favoráveis a pragas em ${culture}`,
        severity: "low",
        recommendations: ['Monitore sua plantação regularmente']
      };
    } else {
      return {
        hasAlert: false,
        message: `Monitoramento ativo para ${culture}`,
      };
    }
  }
  
  // Verificar pragas potenciais com base nas condições climáticas
  const potentialPlagues = plagueInfo.filter(plague => {
    const { conditions } = plague;
    return (conditions.hot && isHot) || 
           (conditions.rainy && isRainy) || 
           (conditions.humid && isHumid);
  });
  
  if (potentialPlagues.length > 0) {
    // Ordenar por severidade
    potentialPlagues.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
    
    const highestSeverityPlague = potentialPlagues[0];
    
    return {
      hasAlert: true,
      message: `Atenção em ${culture}: risco de ${highestSeverityPlague.name}`,
      severity: highestSeverityPlague.severity,
      recommendations: potentialPlagues.map(p => p.recommendation)
    };
  }
  
  return {
    hasAlert: false,
    message: `Monitoramento ativo para ${culture}. Sem alertas no momento.`
  };
};
