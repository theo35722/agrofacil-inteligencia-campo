
export interface WeatherDay {
  date: string;
  dayOfWeek: string;
  icon: "sun" | "cloud" | "cloud-sun" | "cloud-rain" | "cloud-drizzle";
  temperature: { min: number; max: number };
  humidity: number;
  wind: number;
  rainChance: number;
  recommendation?: string;
  soilMoisture?: number;
  uvIndex?: number;
}

export interface ActivityRecommendation {
  activity: string;
  status: "ideal" | "caution" | "avoid";
  reason: string;
}
