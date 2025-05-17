
import { WeatherDay } from "@/types/weather";

// Função para determinar a mensagem de alerta agrícola
export const getAgriculturalAlert = (forecast: WeatherDay[]): string => {
  if (!forecast || forecast.length < 2) return "";
  
  const todayIcon = forecast[0].icon;
  const tomorrowIcon = forecast[1].icon;
  const todayRainChance = forecast[0].rainChance;
  const tomorrowRainChance = forecast[1].rainChance;
  
  // Verificar se hoje ou amanhã tem previsão de chuva
  if (
    todayIcon === "cloud-rain" || 
    todayIcon === "cloud-drizzle" || 
    tomorrowIcon === "cloud-rain" || 
    tomorrowIcon === "cloud-drizzle" ||
    todayRainChance > 50 ||
    tomorrowRainChance > 50
  ) {
    return "Alerta: Não recomendado pulverizar hoje.";
  } else {
    return "Bom dia para atividades agrícolas.";
  }
};
