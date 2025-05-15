
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WeatherDay } from "@/types/weather";

// Interface para os dados retornados pela API OpenWeather
interface OpenWeatherResponse {
  current: {
    temperature: string;
    description: string;
    cityName: string;
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
      },
      tomorrow: {
        high: "--",
        low: "--"
      },
      forecast: []
    };
  }
};
