
import { useState, useEffect } from 'react';
import { useGeolocation } from './use-mobile';

export const useLocationName = () => {
  const location = useGeolocation();
  const [locationName, setLocationName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocationName = async () => {
      if (!location.latitude || !location.longitude) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`
        );
        const data = await response.json();
        
        if (data.address) {
          const address = data.address;
          const locationStr = [
            address.city || address.town || address.village,
            address.state
          ].filter(Boolean).join(", ");
          
          setLocationName(locationStr);
        }
      } catch (error) {
        console.error("Error fetching location name:", error);
        setError("Falha ao obter localização");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationName();
  }, [location.latitude, location.longitude]);

  return { locationName, setLocationName, isLoading, error };
};
