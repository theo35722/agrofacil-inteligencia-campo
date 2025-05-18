
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { RequestBody } from './types.ts';
import { processWeatherData } from './utils.ts';

// Função principal
const handler = async (req: Request): Promise<Response> => {
  // Lidar com requisição OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Obter API key do OpenWeather das variáveis de ambiente
    const apiKey = Deno.env.get('OPENWEATHER_API_KEY');
    if (!apiKey) {
      console.error('API key não encontrada nas variáveis de ambiente');
      throw new Error('API key não encontrada nas variáveis de ambiente');
    }

    // Obter lat/lon do corpo da requisição
    let requestBody: RequestBody;
    try {
      requestBody = await req.json() as RequestBody;
      console.log('Recebido pedido para coordenadas:', requestBody);
    } catch (error) {
      console.error('Erro ao processar corpo da requisição:', error);
      throw new Error('Erro ao processar corpo da requisição: formato JSON inválido');
    }
    
    const { latitude, longitude } = requestBody;
    
    if (!latitude || !longitude) {
      console.error('Parâmetros obrigatórios não fornecidos:', requestBody);
      throw new Error('Latitude e longitude são obrigatórios');
    }

    // Em vez de usar o One Call API (3.0), vamos usar endpoints gratuitos
    // 1. Buscar dados atuais do clima
    console.log(`Buscando dados atuais do clima para ${latitude}, ${longitude}`);
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=pt_br&appid=${apiKey}`;
    const currentResponse = await fetch(currentWeatherUrl);
    
    if (!currentResponse.ok) {
      const errorText = await currentResponse.text();
      console.error(`Erro na API OpenWeather (current): ${currentResponse.status}`, errorText);
      throw new Error(`Erro na API OpenWeather (current): ${currentResponse.status} - ${errorText}`);
    }
    
    const currentData = await currentResponse.json();
    console.log('Dados atuais recebidos com sucesso');
    
    // 2. Buscar previsão para 5 dias
    console.log('Buscando previsão para 5 dias');
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=pt_br&appid=${apiKey}`;
    const forecastResponse = await fetch(forecastUrl);
    
    if (!forecastResponse.ok) {
      const errorText = await forecastResponse.text();
      console.error(`Erro na API OpenWeather (forecast): ${forecastResponse.status}`, errorText);
      throw new Error(`Erro na API OpenWeather (forecast): ${forecastResponse.status} - ${errorText}`);
    }
    
    const forecastData = await forecastResponse.json();
    console.log('Dados de previsão recebidos com sucesso');
    
    // Processar dados para formato similar ao esperado pelo frontend
    const processedData = processWeatherData(currentData, forecastData);
    console.log('Dados processados com sucesso');

    // Retornar dados do clima processados
    return new Response(JSON.stringify(processedData), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    // Lidar com erros
    console.error('Erro ao processar pedido:', error);
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
