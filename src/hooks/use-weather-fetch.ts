
import { useState, useEffect } from 'react';

interface WeatherForecastItem {
  date: string;
  dayOfWeek: string;
  icon: string;
  temperature: {
    min: number;
    max: number;
  };
  description: string;
  humidity: number;
  rainChance: number;
}

interface WeatherData {
  current: {
    temperature: string;
    description: string;
    icon: string;
    humidity: number;
  };
  forecast: WeatherForecastItem[];
}

export function useWeatherFetch() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async (latitude: number, longitude: number) => {
      try {
        console.log(`Fetching weather data for coordinates: ${latitude}, ${longitude}`);
        
        const response = await fetch(
          "https://euzaloymjefsdravbmcd.supabase.co/functions/v1/get-weather-data",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1emFsb3ltamVmc2RyYXZibWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzMTUxMDQsImV4cCI6MjA2MTg5MTEwNH0.1ARoxdC1JqqaFK7jz3YXllu8bmDqXKLJgEMAQjLNqQo"
            },
            body: JSON.stringify({
              latitude,
              longitude
            })
          }
        );

        if (!response.ok) {
          throw new Error(`Weather API returned status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Weather data received:", data);
        setWeatherData(data);
        
        // Try to fetch location name
        try {
          const geoResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            {
              headers: {
                "Accept-Language": "pt-BR",
                "User-Agent": "SeuZeAgro/1.0"
              }
            }
          );
          
          if (geoResponse.ok) {
            const geoData = await geoResponse.json();
            const city = geoData.address?.city || 
                        geoData.address?.town || 
                        geoData.address?.village;
            const state = geoData.address?.state;
            
            if (city && state) {
              setLocationName(`${city}, ${state}`);
            } else if (city) {
              setLocationName(city);
            }
          }
        } catch (error) {
          console.error("Error fetching location name:", error);
        }
        
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Não foi possível obter a previsão do tempo no momento.");
      } finally {
        setLoading(false);
      }
    };

    // Get user's geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error.message);
          setError("Não foi possível obter a sua localização. Verifique as permissões do navegador.");
          setLoading(false);
          
          // Fallback to a default location (Brazil)
          fetchWeatherData(-15.7801, -47.9292);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
      );
    } else {
      setError("Geolocalização não suportada pelo seu navegador.");
      setLoading(false);
    }
  }, []);

  return { weatherData, loading, error, locationName };
}
