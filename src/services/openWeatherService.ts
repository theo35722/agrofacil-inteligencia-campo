import { supabase } from "@/integrations/supabase/client";
import { PlagueAlertData } from "@/types/agro";

// Buscar dados do clima para uma localização específica (por coordenadas)
export const fetchWeatherData = async (
  lat: number,
  lon: number
): Promise<any> => {
  try {
    console.log('Iniciando requisição para a Edge Function do Supabase');
    
    // Usar o método do cliente Supabase para chamar a função Edge diretamente
    // Sem exigir autenticação, já que a weather function está configurada como pública
    const { data, error } = await supabase.functions.invoke('get-weather-data', {
      body: { latitude: lat, longitude: lon },
    });

    if (error) {
      console.error(`Falha na API de clima:`, error);
      throw new Error(`Falha na API de clima: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar dados climáticos:", error);
    throw error;
  }
};

// Funções existentes relacionadas a pragas são mantidas
export const getPlagueForCulture = (
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
  
  // Banco de dados de pragas específicas por cultura conforme solicitado
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
        name: 'Mosca-branca',
        conditions: { hot: true, humid: true },
        severity: "medium",
        recommendation: 'Monitore a presença nas folhas e aplique controle se necessário'
      },
      {
        name: 'Lagarta Helicoverpa',
        conditions: { hot: true },
        severity: "medium",
        recommendation: 'Inspecione o nível de desfolha e planeje controle se necessário'
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
    'cana': [
      {
        name: 'Broca-da-cana',
        conditions: { hot: true, humid: true },
        severity: "high",
        recommendation: 'Faça monitoramento constante e considere controle biológico'
      },
      {
        name: 'Esfenóforo',
        conditions: { humid: true },
        severity: "medium",
        recommendation: 'Verifique a presença nos colmos e monitore os danos'
      }
    ]
  };
  
  // Verificar se a cultura está no mapa
  const plagueInfo = plagueMap[lowerCulture] || [];
  
  if (plagueInfo.length === 0) {
    // Cultura não mapeada, retornar sem alerta
    return {
      hasAlert: false,
      message: `Monitoramento ativo para ${culture}`,
    };
  }
  
  // Para simular os alertas conforme solicitado, vamos verificar as condições
  // ou selecionar aleatoriamente se as condições climáticas não forem favoráveis
  let potentialPlagues = plagueInfo.filter(plague => {
    const { conditions } = plague;
    return (conditions.hot && isHot) || 
           (conditions.rainy && isRainy) || 
           (conditions.humid && isHumid);
  });
  
  // Se não houver pragas potenciais baseadas nas condições,
  // selecionar aleatoriamente uma praga para fins de demonstração, conforme solicitado
  if (potentialPlagues.length === 0 && Math.random() > 0.6) {
    const randomIndex = Math.floor(Math.random() * plagueInfo.length);
    potentialPlagues = [plagueInfo[randomIndex]];
  }
  
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
      recommendations: [highestSeverityPlague.recommendation]
    };
  }
  
  return {
    hasAlert: false,
    message: `Monitoramento ativo para ${culture}. Sem alertas no momento.`
  };
};

// Função para determinar potencial de pragas com base no clima
// Mantida para compatibilidade com imports existentes
export const determinePlaguePotential = getPlagueForCulture;
