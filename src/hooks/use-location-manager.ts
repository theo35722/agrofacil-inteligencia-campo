
import { useState, useEffect } from "react";
import { LocationData } from "@/types/marketplace";

// Hook to manage user's location data
export function useLocationManager() {
  const [locationData, setLocationData] = useState<LocationData>({
    city: null,
    state: null,
    fullLocation: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Request geolocation from browser
  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser");
      return;
    }

    setIsLoading(true);
    setPermissionDenied(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get the location name
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          
          const data = await response.json();
          
          if (data) {
            const city = data.address?.city || 
                        data.address?.town || 
                        data.address?.village || 
                        data.address?.hamlet;
            
            const state = data.address?.state;
            
            setLocationData({
              city,
              state,
              fullLocation: city && state ? `${city}, ${state}` : null,
            });
          }
        } catch (error) {
          console.error("Error getting location:", error);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Error getting geolocation:", error);
        setPermissionDenied(true);
        setIsLoading(false);
      }
    );
  };

  // Set location manually
  const setManualLocation = (city: string, state: string) => {
    setLocationData({
      city,
      state,
      fullLocation: `${city}, ${state}`,
    });
  };

  // Clear location data
  const clearLocation = () => {
    setLocationData({
      city: null,
      state: null,
      fullLocation: null,
    });
  };

  // Request geolocation on component mount
  useEffect(() => {
    requestGeolocation();
  }, []);

  return {
    locationData,
    isLoading,
    permissionDenied,
    requestGeolocation,
    setManualLocation,
    clearLocation,
  };
}
