
import { RawOpenWeatherCurrent, RawOpenWeatherForecast, OpenWeatherResponse } from "./types.ts";

// Função para mapear o ícone do OpenWeather para nosso formato interno
export const mapWeatherIcon = (iconCode: string): "sun" | "cloud" | "cloud-sun" | "cloud-rain" | "cloud-drizzle" => {
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
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Função para obter o dia da semana
export const getDayOfWeek = (date: Date): string => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) return "Hoje";
  if (date.toDateString() === tomorrow.toDateString()) return "Amanhã";
  
  const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  return days[date.getDay()];
};

// Obter recomendação com base nas condições climáticas
export const getRecommendation = (iconCode: string, rainChance: number): string | undefined => {
  if (iconCode.includes('09') || iconCode.includes('10') || iconCode.includes('11') || rainChance > 50) {
    return "Evite pulverizar - alta chance de chuva que pode lavar os produtos aplicados.";
  } else if (!iconCode.includes('09') && !iconCode.includes('10') && !iconCode.includes('11') && rainChance < 20) {
    return "Dia ideal para aplicação de defensivos. Baixa umidade e vento moderado.";
  }
  return undefined;
};

// Função auxiliar para processar os dados de tempo
export function processWeatherData(currentData: RawOpenWeatherCurrent, forecastData: RawOpenWeatherForecast): OpenWeatherResponse {
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
  
  forecastData.list.forEach((item) => {
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
    const iconCounts = day.icons.reduce((acc: Record<string, number>, icon: string) => {
      acc[icon] = (acc[icon] || 0) + 1;
      return acc;
    }, {});
    
    const predominantIcon = Object.keys(iconCounts).reduce((a, b) => 
      iconCounts[a] > iconCounts[b] ? a : b
    );
    
    // Calcular a média das chances de chuva em vez do máximo
    // Isso dará um valor mais representativo para todo o dia
    const avgRainChance = day.rainChances.length > 0 
      ? Math.round(day.rainChances.reduce((sum: number, val: number) => sum + val, 0) / day.rainChances.length)
      : 0;
    
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
      rainChance: avgRainChance,
      uvIndex: 3, // Valor padrão, pois não está disponível na API gratuita
      recommendation: getRecommendation(predominantIcon, avgRainChance)
    };
  });
  
  return {
    current: {
      temperature: `${current.temperature}°C`,
      description: current.description,
      cityName: current.cityName,
      icon: current.icon,
      humidity: current.humidity
    },
    tomorrow: {
      high: `${forecast[1] ? forecast[1].temperature.max : "N/A"}°`,
      low: `${forecast[1] ? forecast[1].temperature.min : "N/A"}°`
    },
    forecast: forecast.slice(0, 5) // Limitar a 5 dias
  };
}
