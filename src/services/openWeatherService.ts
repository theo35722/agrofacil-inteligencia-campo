
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
): { hasAlert: boolean; message: string; severity?: "low" | "medium" | "high" } => {
  // Default values
  let hasAlert = false;
  let message = "Monitoramento de pragas ativo. Nenhum alerta no momento.";
  let severity: "low" | "medium" | "high" = "low";

  // Caso não tenha cultura cadastrada
  if (!culture) {
    return { hasAlert: false, message };
  }

  console.log(`Analisando riscos para ${culture} com condições: ${weatherDescription}, umidade: ${humidity}%`);

  const lowerCaseWeather = weatherDescription.toLowerCase();
  const hasContinuousRain = lowerCaseWeather.includes('chuva') && 
    (lowerCaseWeather.includes('forte') || lowerCaseWeather.includes('contínua'));
  const hasRain = lowerCaseWeather.includes('chuva');
  const isHighHumidity = humidity > 75;
  const isMediumHumidity = humidity > 60;
  const isRainyOrHumid = hasRain || isHighHumidity;
  const isHot = lowerCaseWeather.includes('calor') || lowerCaseWeather.includes('quente');
  const isCloudy = lowerCaseWeather.includes('nublado');

  // Verificar cada cultura - Normalizar o nome da cultura para evitar diferenças de case e acentuação
  const cultureLower = culture.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Milho
  if (cultureLower.includes('milho')) {
    if (isRainyOrHumid) {
      hasAlert = true;
      message = "Risco de lagarta-do-cartucho no milho";
      severity = isHighHumidity ? "high" : "medium";
    } else if (isHot && isMediumHumidity) {
      hasAlert = true;
      message = "Condições para desenvolvimento de pulgões no milho";
      severity = "low";
    }
  } 
  // Soja
  else if (cultureLower.includes('soja')) {
    if (hasContinuousRain || (isHighHumidity && isCloudy)) {
      hasAlert = true;
      message = "Risco de ferrugem asiática na soja";
      severity = hasContinuousRain ? "high" : "medium";
    } else if (isHot && isMediumHumidity) {
      hasAlert = true;
      message = "Condições favoráveis para percevejos na soja";
      severity = "medium";
    }
  } 
  // Feijão
  else if (cultureLower.includes('feijao') || cultureLower.includes('feijão')) {
    if (isRainyOrHumid) {
      hasAlert = true;
      message = "Risco de mosca-branca no feijão";
      severity = "medium";
    } else if (isHot) {
      hasAlert = true;
      message = "Condições para tripes no feijão";
      severity = "low";
    }
  } 
  // Culturas de pasto e capim - útil para pecuaristas
  else if (cultureLower.includes('pasto') || cultureLower.includes('capim') || 
           cultureLower.includes('forrageira') || cultureLower.includes('braquiaria')) {
    if (hasRain) {
      hasAlert = true;
      message = "Risco de cigarrinha no pasto";
      severity = hasRain && isHighHumidity ? "medium" : "low";
    } else if (isHot && !isHighHumidity) {
      hasAlert = true;
      message = "Possível desenvolvimento de lagartas no pasto";
      severity = "low";
    }
  }
  // Cana-de-açúcar
  else if (cultureLower.includes('cana')) {
    if (isHot && isHighHumidity) {
      hasAlert = true;
      message = "Risco de broca-da-cana";
      severity = "medium";
    }
  }
  // Algodão
  else if (cultureLower.includes('algodao') || cultureLower.includes('algodão')) {
    if (isHot) {
      hasAlert = true;
      message = "Condições favoráveis para bicudo-do-algodoeiro";
      severity = "high";
    }
  }
  // Café
  else if (cultureLower.includes('cafe') || cultureLower.includes('café')) {
    if (isHighHumidity) {
      hasAlert = true;
      message = "Risco de ferrugem do cafeeiro";
      severity = "medium";
    }
  }
  // Hortaliças gerais
  else if (cultureLower.includes('horta') || cultureLower.includes('legume') || 
           cultureLower.includes('verdura') || cultureLower.includes('tomate')) {
    if (isHighHumidity) {
      hasAlert = true;
      message = "Condições favoráveis para fungos em hortaliças";
      severity = "medium";
    }
  }
  
  console.log(`Resultado da análise para ${culture}: ${hasAlert ? "Alerta detectado" : "Nenhum alerta"}`);
  return { hasAlert, message, severity };
};
