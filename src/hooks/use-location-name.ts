
import { useState, useEffect } from "react";
import { useGeolocation } from "./use-geolocation";

export function useLocationName() {
  const [locationName, setLocationName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { latitude, longitude, loading: geoLoading, error: geoError } = useGeolocation();

  // Fetch location name from coordinates
  useEffect(() => {
    const fetchLocationName = async () => {
      if (!latitude || !longitude || geoLoading || geoError) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch location data");
        }
        
        const data = await response.json();
        
        const city = data.address?.city || 
                    data.address?.town || 
                    data.address?.village || 
                    data.address?.hamlet;
        
        const state = data.address?.state;
        
        if (city && state) {
          setLocationName(`${city}, ${state}`);
        } else if (city) {
          setLocationName(city);
        } else if (state) {
          setLocationName(state);
        } else {
          setLocationName("Localização desconhecida");
        }
      } catch (error) {
        console.error("Error fetching location name:", error);
        setError("Não foi possível determinar sua localização");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationName();
  }, [latitude, longitude, geoLoading, geoError]);

  return {
    locationName,
    setLocationName,
    isLoading: isLoading || geoLoading,
    error: error || geoError,
  };
}
