
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WeatherDay } from "@/types/weather";

// Interface para os dados retornados pela API OpenWeather
interface OpenWeatherResponse {
  current: {
    temperature: string;
    description: string;
    cityName: string;
    humidity: number;
    icon: "sun" | "cloud" | "cloud-sun" | "cloud-rain" | "cloud-drizzle";
  };
  tomorrow: {
    high: string;
    low: string;
  };
  forecast: WeatherDay[];
}

// Função principal para buscar previsão do tempo
export const fetchWeatherData = async (latitude: number, longitude: number): Promise<{
  current: {
    temperature: string;
    description: string;
    cityName: string;
    humidity: number;
  };
  tomorrow: {
    high: string;
    low: string;
  };
  forecast: WeatherDay[];
}> => {
  try {
    // Buscar dados meteorológicos da API através do Edge Function
    const { data: weatherData, error: weatherError } = await supabase
      .functions.invoke("get-weather-data", {
        body: { latitude, longitude },
      });

    if (weatherError) {
      console.error("Erro ao buscar dados climáticos:", weatherError);
      throw new Error(weatherError.message || "Erro ao buscar dados climáticos");
    }

    if (!weatherData) {
      throw new Error("Não foi possível obter dados climáticos");
    }

    // Verificar se há mensagem de erro retornada pelo Edge Function
    if (weatherData.error) {
      throw new Error(weatherData.error);
    }

    const data = weatherData as OpenWeatherResponse;

    return {
      current: {
        temperature: data.current.temperature,
        description: data.current.description,
        cityName: data.current.cityName || "Local desconhecido",
        humidity: data.current.humidity || 0,
      },
      tomorrow: {
        high: data.tomorrow.high,
        low: data.tomorrow.low,
      },
      forecast: data.forecast
    };
  } catch (error: any) {
    console.error("Erro ao buscar dados do clima:", error);
    toast.error("Erro ao buscar previsão do tempo", { 
      description: error.message || "Verifique sua conexão e tente novamente" 
    });
    
    // Retornar dados simulados para evitar quebra da aplicação
    return {
      current: {
        temperature: "N/A",
        description: "Dados indisponíveis",
        cityName: "Local desconhecido",
        humidity: 0,
      },
      tomorrow: {
        high: "--",
        low: "--"
      },
      forecast: []
    };
  }
};

// Função para determinar se existe risco de praga com base na cultura e condições climáticas
export const determinePlaguePotential = (
  culture: string | undefined, 
  weatherDescription: string, 
  humidity: number
): { hasAlert: boolean; message: string } => {
  // Default values
  let hasAlert = false;
  let message = "Nenhum alerta de pragas no momento";

  // Caso não tenha cultura cadastrada
  if (!culture) {
    return { hasAlert: false, message };
  }

  const lowerCaseWeather = weatherDescription.toLowerCase();
  const hasContinuousRain = lowerCaseWeather.includes('chuva') && 
    (lowerCaseWeather.includes('forte') || lowerCaseWeather.includes('contínua'));
  const hasRain = lowerCaseWeather.includes('chuva');
  const isHighHumidity = humidity > 75;
  const isRainyOrHumid = hasRain || isHighHumidity;

  // Verificar cada cultura
  const cultureLower = culture.toLowerCase();
  if (cultureLower.includes('milho') && isRainyOrHumid) {
    hasAlert = true;
    message = "Risco de lagarta-do-cartucho no milho";
  } else if (cultureLower.includes('soja') && hasContinuousRain) {
    hasAlert = true;
    message = "Risco de ferrugem asiática na soja";
  } else if (cultureLower.includes('feijão') && isRainyOrHumid) {
    hasAlert = true;
    message = "Risco de mosca-branca no feijão";
  } else if ((cultureLower.includes('pasto') || cultureLower.includes('capim')) && hasRain) {
    hasAlert = true;
    message = "Risco de cigarrinha no pasto";
  }

  return { hasAlert, message };
};
