
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WeatherDay } from "@/types/weather";

// Interface para os dados retornados pela API OpenWeather
interface OpenWeatherResponse {
  current: {
    temp: number;
    weather: Array<{
      description: string;
      icon: string;
      main: string;
    }>;
    humidity: number;
    wind_speed: number;
    uvi: number;
  };
  daily: Array<{
    dt: number;
    temp: {
      min: number;
      max: number;
    };
    weather: Array<{
      description: string;
      icon: string;
      main: string;
    }>;
    humidity: number;
    wind_speed: number;
    pop: number; // probabilidade de precipitação
    uvi: number;
  }>;
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
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Função para obter o dia da semana
const getDayOfWeek = (timestamp: number, isToday: boolean = false): string => {
  if (isToday) return "Hoje";
  
  const date = new Date(timestamp * 1000);
  const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  return days[date.getDay()];
};

// Obter recomendação com base nas condições climáticas
const getRecommendation = (weather: any, rainChance: number): string | undefined => {
  if (rainChance > 70) {
    return "Evite pulverizar - alta chance de chuva que pode lavar os produtos aplicados.";
  } else if (rainChance < 20 && weather.main !== 'Rain' && weather.main !== 'Drizzle') {
    return "Dia ideal para aplicação de defensivos. Baixa umidade e vento moderado.";
  }
  return undefined;
};

// Função principal para buscar previsão do tempo
export const fetchWeatherData = async (latitude: number, longitude: number): Promise<{
  current: {
    temperature: string;
    description: string;
  };
  tomorrow: {
    high: string;
    low: string;
  };
  forecast: WeatherDay[];
}> => {
  try {
    // Buscar a chave da API do OpenWeather armazenada no Supabase
    const { data: secretData, error: secretError } = await supabase
      .functions.invoke("get-weather-data", {
        body: { latitude, longitude },
      });

    if (secretError) {
      console.error("Erro ao buscar dados climáticos:", secretError);
      throw new Error(secretError.message || "Erro ao buscar dados climáticos");
    }

    if (!secretData) {
      throw new Error("Não foi possível obter dados climáticos");
    }

    const data: OpenWeatherResponse = secretData;

    // Formatar dados para o formato usado pela aplicação
    const forecast: WeatherDay[] = data.daily.slice(0, 5).map((day, index) => {
      const isToday = index === 0;
      
      return {
        date: formatDate(day.dt),
        dayOfWeek: getDayOfWeek(day.dt, isToday),
        icon: mapWeatherIcon(day.weather[0].icon),
        temperature: {
          min: Math.round(day.temp.min),
          max: Math.round(day.temp.max),
        },
        humidity: day.humidity,
        wind: Math.round(day.wind_speed * 3.6), // Converter de m/s para km/h
        rainChance: Math.round(day.pop * 100), // Converter de 0-1 para percentagem
        uvIndex: Math.round(day.uvi),
        recommendation: getRecommendation(day.weather[0], Math.round(day.pop * 100)),
      };
    });

    return {
      current: {
        temperature: `${Math.round(data.current.temp)}°C`,
        description: data.current.weather[0].description.charAt(0).toUpperCase() + data.current.weather[0].description.slice(1)
      },
      tomorrow: {
        high: `${Math.round(data.daily[1].temp.max)}°`,
        low: `${Math.round(data.daily[1].temp.min)}°`
      },
      forecast
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
        description: "Dados indisponíveis"
      },
      tomorrow: {
        high: "--",
        low: "--"
      },
      forecast: []
    };
  }
};
