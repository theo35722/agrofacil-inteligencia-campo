
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeatherData {
  description: string;
  humidity: number;
}

interface PlagueRequest {
  culture: string;
  weatherData: WeatherData;
}

interface PlagueResponse {
  hasAlert: boolean;
  message: string;
  severity?: "low" | "medium" | "high";
  recommendations?: string[];
}

// Função principal
const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Parse request body
    const requestData: PlagueRequest = await req.json();
    const { culture, weatherData } = requestData;

    if (!culture || !weatherData) {
      return new Response(
        JSON.stringify({
          error: 'Cultura e dados climáticos são obrigatórios'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Verificar pragas comuns para cada cultura
    const plagueResponse = determinePlaguePotential(culture, weatherData.description, weatherData.humidity);

    return new Response(
      JSON.stringify(plagueResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

function determinePlaguePotential(
  culture: string, 
  weatherDescription: string, 
  humidity: number
): PlagueResponse {
  
  // Converter cultura e descrição para minúsculas para facilitar comparações
  const lowerCulture = culture.toLowerCase();
  const lowerDesc = weatherDescription.toLowerCase();
  
  // Verificar condições climáticas que favorecem pragas
  const isHot = lowerDesc.includes('calor') || lowerDesc.includes('quente') || lowerDesc.includes('sol');
  const isRainy = lowerDesc.includes('chuva') || lowerDesc.includes('chuvoso');
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
      },
      {
        name: 'Gorgulho',
        conditions: { humid: true },
        severity: "medium", 
        recommendation: 'Verifique a presença nos grãos armazenados e aplique controle se necessário'
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
        message: `Nenhum alerta específico para ${culture}`,
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
    message: `Nenhum alerta de pragas para ${culture} nas condições atuais`
  };
}

// Iniciar o servidor
serve(handler);
