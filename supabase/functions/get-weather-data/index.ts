
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

    // Em vez de usar o One Call API (3.0), vamos usar endpoints gratuitos
    // 1. Buscar dados atuais do clima
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=pt_br&appid=${apiKey}`;
    const currentResponse = await fetch(currentWeatherUrl);
    
    if (!currentResponse.ok) {
      const errorText = await currentResponse.text();
      throw new Error(`Erro na API OpenWeather (current): ${currentResponse.status} - ${errorText}`);
    }
    
    const currentData = await currentResponse.json();
    
    // 2. Buscar previsão para 5 dias
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=pt_br&appid=${apiKey}`;
    const forecastResponse = await fetch(forecastUrl);
    
    if (!forecastResponse.ok) {
      const errorText = await forecastResponse.text();
      throw new Error(`Erro na API OpenWeather (forecast): ${forecastResponse.status} - ${errorText}`);
    }
    
    const forecastData = await forecastResponse.json();
    
    // Processar dados para formato similar ao esperado pelo frontend
    const processedData = processWeatherData(currentData, forecastData);

    // Retornar dados do clima processados
    return new Response(JSON.stringify(processedData), {
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

// Função auxiliar para processar os dados de tempo
function processWeatherData(currentData: any, forecastData: any) {
  // Processa os dados atuais
  const current = {
    temperature: Math.round(currentData.main.temp),
    description: currentData.weather[0].description.charAt(0).toUpperCase() + currentData.weather[0].description.slice(1),
    icon: mapWeatherIcon(currentData.weather[0].icon),
    humidity: currentData.main.humidity,
    wind: Math.round(currentData.wind.speed * 3.6), // converter de m/s para km/h
    cityName: currentData.name
  };
  
  // Construir dados de previsão para os próximos dias (agrupando por dia)
  const forecastMap = new Map();
  
  forecastData.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!forecastMap.has(dateKey)) {
      forecastMap.set(dateKey, {
        date: dateKey,
        dayOfWeek: getDayOfWeek(date),
        temps: [],
        icons: [],
        rainChances: [],
        humidity: [],
        wind: [],
        descriptions: []
      });
    }
    
    const dayData = forecastMap.get(dateKey);
    dayData.temps.push(item.main.temp);
    dayData.icons.push(item.weather[0].icon);
    dayData.rainChances.push((item.pop || 0) * 100);
    dayData.humidity.push(item.main.humidity);
    dayData.wind.push(item.wind.speed);
    dayData.descriptions.push(item.weather[0].description);
  });
  
  // Processar os dados agrupados por dia para formato final
  const forecast = Array.from(forecastMap.values()).map(day => {
    // Definir o ícone predominante (mais frequente)
    const iconCounts = day.icons.reduce((acc: any, icon: string) => {
      acc[icon] = (acc[icon] || 0) + 1;
      return acc;
    }, {});
    
    const predominantIcon = Object.keys(iconCounts).reduce((a, b) => 
      iconCounts[a] > iconCounts[b] ? a : b
    );
    
    return {
      date: formatDate(new Date(day.date)),
      dayOfWeek: day.dayOfWeek,
      icon: mapWeatherIcon(predominantIcon),
      temperature: {
        min: Math.round(Math.min(...day.temps)),
        max: Math.round(Math.max(...day.temps))
      },
      humidity: Math.round(day.humidity.reduce((sum: number, val: number) => sum + val, 0) / day.humidity.length),
      wind: Math.round(day.wind.reduce((sum: number, val: number) => sum + val, 0) / day.wind.length * 3.6), // m/s para km/h
      rainChance: Math.round(Math.max(...day.rainChances)),
      uvIndex: 3, // Valor padrão, pois não está disponível na API gratuita
      recommendation: getRecommendation(predominantIcon, Math.max(...day.rainChances))
    };
  });
  
  return {
    current: {
      temperature: `${current.temperature}°C`,
      description: current.description,
      cityName: current.cityName,
      icon: current.icon
    },
    tomorrow: {
      high: `${forecast[1] ? forecast[1].temperature.max : "N/A"}°`,
      low: `${forecast[1] ? forecast[1].temperature.min : "N/A"}°`
    },
    forecast: forecast.slice(0, 5) // Limitar a 5 dias
  };
}

// Função que converte o ícone do OpenWeather para nosso formato interno
const mapWeatherIcon = (iconCode: string): "sun" | "cloud" | "cloud-sun" | "cloud-rain" | "cloud-drizzle" => {
  // Códigos de ícones do OpenWeather: https://openweathermap.org/weather-conditions
  // d = dia, n = noite
  if (iconCode.includes('01')) return "sun"; // céu limpo
  if (iconCode.includes('02')) return "cloud-sun"; // algumas nuvens
  if (iconCode.includes('03') || iconCode.includes('04')) return "cloud"; // nublado
  if (iconCode.includes('09')) return "cloud-drizzle"; // chuvisco
  if (iconCode.includes('10') || iconCode.includes('11')) return "cloud-rain"; // chuva
  return "cloud";
};

// Função para formatar a data no formato brasileiro
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Função para obter o dia da semana
const getDayOfWeek = (date: Date): string => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) return "Hoje";
  if (date.toDateString() === tomorrow.toDateString()) return "Amanhã";
  
  const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  return days[date.getDay()];
};

// Obter recomendação com base nas condições climáticas
const getRecommendation = (iconCode: string, rainChance: number): string | undefined => {
  if (iconCode.includes('09') || iconCode.includes('10') || iconCode.includes('11') || rainChance > 50) {
    return "Evite pulverizar - alta chance de chuva que pode lavar os produtos aplicados.";
  } else if (!iconCode.includes('09') && !iconCode.includes('10') && !iconCode.includes('11') && rainChance < 20) {
    return "Dia ideal para aplicação de defensivos. Baixa umidade e vento moderado.";
  }
  return undefined;
};

// Iniciar o servidor
serve(handler);
