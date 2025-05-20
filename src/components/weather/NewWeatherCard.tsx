
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun, MapPin, Loader2 } from "lucide-react";

interface WeatherData {
  current: {
    temperature: string;
    description: string;
    icon: string;
    humidity: number;
  };
  forecast: {
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
  }[];
}

export interface NewWeatherCardProps {
  onWeatherDataChange?: (data: {
    description: string;
    humidity: number;
  } | null) => void;
}

export const NewWeatherCard = ({ onWeatherDataChange }: NewWeatherCardProps = {}) => {
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
        
        // Notify parent component about weather data if callback provided
        if (onWeatherDataChange && data?.current) {
          onWeatherDataChange({
            description: data.current.description,
            humidity: data.current.humidity || 0
          });
        }
        
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
        
        // Notify parent component about weather data error
        if (onWeatherDataChange) {
          onWeatherDataChange(null);
        }
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
  }, [onWeatherDataChange]);

  // Helper function to get the weather icon URL
  const getWeatherIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Render loading state
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center justify-between">
            <span>Previsão do Tempo</span>
            <CloudSun className="h-5 w-5 text-blue-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
            <p className="text-gray-600">Carregando previsão do tempo...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render error state
  if (error || !weatherData) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center justify-between">
            <span>Previsão do Tempo</span>
            <CloudSun className="h-5 w-5 text-blue-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-4">
            <p className="text-gray-600 text-center">{error || "Não foi possível obter a previsão do tempo no momento."}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Extract data for today and tomorrow
  const today = weatherData.forecast[0];
  const tomorrow = weatherData.forecast.length > 1 ? weatherData.forecast[1] : null;

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>Previsão do Tempo</span>
          <CloudSun className="h-5 w-5 text-blue-500" />
        </CardTitle>
        {locationName && (
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{locationName}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Today's forecast */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Hoje</h3>
              <p className="text-2xl font-bold">{today.temperature.max}°C</p>
              <p className="text-sm text-gray-500">Min: {today.temperature.min}°C</p>
              <p className="text-sm">{today.description}</p>
            </div>
            <div className="flex flex-col items-center">
              <img 
                src={getWeatherIconUrl(today.icon)} 
                alt={today.description} 
                className="w-16 h-16"
              />
              <span className="text-xs text-gray-500">
                {today.rainChance > 0 ? `${today.rainChance}% chuva` : "Sem chuva"}
              </span>
            </div>
          </div>
          
          {/* Divider */}
          <div className="border-t border-gray-200 my-2"></div>
          
          {/* Tomorrow's forecast */}
          {tomorrow && (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Amanhã</h3>
                <p className="text-lg font-bold">{tomorrow.temperature.max}°C</p>
                <p className="text-sm text-gray-500">Min: {tomorrow.temperature.min}°C</p>
                <p className="text-sm">{tomorrow.description}</p>
              </div>
              <div className="flex flex-col items-center">
                <img 
                  src={getWeatherIconUrl(tomorrow.icon)} 
                  alt={tomorrow.description} 
                  className="w-12 h-12"
                />
                <span className="text-xs text-gray-500">
                  {tomorrow.rainChance > 0 ? `${tomorrow.rainChance}% chuva` : "Sem chuva"}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
