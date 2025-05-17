
import { useState, useEffect } from 'react';
import { toast } from "sonner";

interface ReverseGeocodingResult {
  locationName: string;
  isLoading: boolean;
  error: string | null;
  retryFetch: () => void;
}

export const useReverseGeocoding = (
  latitude: number | null,
  longitude: number | null
): ReverseGeocodingResult => {
  const [locationName, setLocationName] = useState<string>("Carregando localização...");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocationName = async () => {
    if (!latitude || !longitude) {
      setLocationName("Localização não disponível");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use a small delay to help avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        {
          headers: {
            'User-Agent': 'SeuZeAgro/1.0',
            'Accept-Language': 'pt-BR'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Erro na resposta: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Tenta extrair o nome da cidade e estado das informações retornadas
      const city = data.address?.city || 
                  data.address?.town || 
                  data.address?.village || 
                  data.address?.municipality || 
                  data.address?.county ||
                  "Local não identificado";
                  
      const state = data.address?.state || "";
      const formattedLocation = state ? `${city}, ${state}` : city;
      
      setLocationName(formattedLocation);
      console.log("Localização obtida:", formattedLocation);
    } catch (error) {
      console.error("Erro ao buscar nome da localização:", error);
      setError("Não foi possível obter o nome da sua localização");
      
      // Use coordenadas como fallback
      if (latitude && longitude) {
        setLocationName(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para buscar o nome da localização quando as coordenadas mudam
  useEffect(() => {
    if (latitude && longitude) {
      fetchLocationName();
    }
  }, [latitude, longitude]);

  const retryFetch = () => {
    if (latitude && longitude) {
      fetchLocationName();
    } else {
      toast.error("Coordenadas de localização não disponíveis");
    }
  };

  return { locationName, isLoading, error, retryFetch };
};
