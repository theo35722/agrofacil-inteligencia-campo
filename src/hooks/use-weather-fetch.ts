
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

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
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Function to fetch weather data with coordinates
  const fetchWeatherData = async (latitude: number, longitude: number) => {
    try {
      console.log(`Fetching weather data for coordinates: ${latitude}, ${longitude}`);
      
      const { data, error: fetchError } = await supabase.functions.invoke('get-weather-data', {
        body: { latitude, longitude }
      });

      if (fetchError) {
        console.error("Weather API error:", fetchError);
        throw new Error(`Weather API error: ${fetchError.message}`);
      }

      if (!data) {
        throw new Error("No data received from weather API");
      }

      console.log("Weather data received:", data);
      setWeatherData(data);
      setError(null);
      
      // Try to fetch location name
      fetchLocationName(latitude, longitude);
      
    } catch (error) {
      console.error("Error fetching weather data:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch weather data";
      setError(errorMessage);
      
      // Implement retry logic
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying weather fetch (${retryCount + 1}/${MAX_RETRIES})...`);
        setRetryCount(prev => prev + 1);
        // Wait 2 seconds before retrying
        setTimeout(() => fetchWeatherData(latitude, longitude), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to fetch location name
  const fetchLocationName = async (latitude: number, longitude: number) => {
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
      // Non-critical error, don't set error state
    }
  };

  // Manual refetch method
  const refetch = (coords?: { latitude: number, longitude: number }) => {
    setLoading(true);
    setError(null);
    setRetryCount(0);

    if (coords?.latitude && coords?.longitude) {
      fetchWeatherData(coords.latitude, coords.longitude);
    } else {
      // Start from scratch with geolocation
      getUserLocation();
    }
  };

  // Function to get user location with fallbacks
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error.message);
          
          // Default location for Brazil if geolocation fails
          const DEFAULT_LAT = -15.7801;
          const DEFAULT_LON = -47.9292;
          
          console.log(`Geolocation failed. Using default coordinates (${DEFAULT_LAT}, ${DEFAULT_LON})`);
          setError("Não foi possível obter a sua localização. Utilizando localização padrão.");
          
          // Use default coordinates as fallback
          fetchWeatherData(DEFAULT_LAT, DEFAULT_LON);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
      );
    } else {
      setError("Geolocalização não suportada pelo seu navegador.");
      setLoading(false);
      
      // Still try with default coordinates
      const DEFAULT_LAT = -15.7801;
      const DEFAULT_LON = -47.9292;
      fetchWeatherData(DEFAULT_LAT, DEFAULT_LON);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  return { weatherData, loading, error, locationName, refetch };
}
