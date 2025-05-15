
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// Definição da interface para body
interface RequestBody {
  latitude: number;
  longitude: number;
}

// Função principal
const handler = async (req: Request): Promise<Response> => {
  // Configurar CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Lidar com requisição OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Obter API key do OpenWeather das variáveis de ambiente
    const apiKey = Deno.env.get('OPENWEATHER_API_KEY');
    if (!apiKey) {
      throw new Error('API key não encontrada nas variáveis de ambiente');
    }

    // Obter lat/lon do corpo da requisição
    const { latitude, longitude } = await req.json() as RequestBody;
    
    if (!latitude || !longitude) {
      throw new Error('Latitude e longitude são obrigatórios');
    }

    // Fazer requisição para a API do OpenWeather
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=metric&lang=pt_br&appid=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API OpenWeather: ${response.status} - ${errorText}`);
    }

    const weatherData = await response.json();

    // Retornar dados do clima
    return new Response(JSON.stringify(weatherData), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Lidar com erros
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

// Iniciar o servidor
serve(handler);
