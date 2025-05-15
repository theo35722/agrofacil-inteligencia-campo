
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
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      
      if (!response.ok) {
        throw new Error(`Erro na resposta: ${response.status}`);
      }
      
      const data = await response.json();
      
      const city = data.address?.city || 
                  data.address?.town || 
                  data.address?.village || 
                  data.address?.municipality || 
                  "Local não identificado";
                  
      const state = data.address?.state || "";
      const formattedLocation = `${city}, ${state}`;
      
      setLocationName(formattedLocation);
      toast.success("Localização obtida com sucesso");
    } catch (error) {
      console.error("Erro ao buscar nome da localização:", error);
      setError("Não foi possível obter o nome da sua localização");
      
      // Use coordenadas como fallback
      if (latitude && longitude) {
        setLocationName(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
      }
      
      toast.error("Erro ao buscar nome da localização");
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
    }
  };

  return { locationName, isLoading, error, retryFetch };
};
