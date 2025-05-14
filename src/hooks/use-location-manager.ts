
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";

// Define the structure for our location data
type LocationData = {
  city: string | null;
  state: string | null;
  fullLocation: string | null;
  isCustomSet: boolean;
}

export function useLocationManager() {
  // Store location in state
  const [locationData, setLocationData] = useState<LocationData>({
    city: null,
    state: null,
    fullLocation: null,
    isCustomSet: false
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  
  // Get saved location from localStorage on first render
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setLocationData(parsedLocation);
        setIsLoading(false);
      } catch (e) {
        console.error("Error parsing saved location:", e);
        requestGeolocation();
      }
    } else {
      requestGeolocation();
    }
  }, []);

  // Function to request geolocation permission and get user's location
  const requestGeolocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      setIsLoading(false);
      setPermissionDenied(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use OpenStreetMap's Nominatim API to get location details from coordinates
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
          );
          const data = await response.json();
          
          // Extract city and state from the response
          const city = data.address?.city || 
                      data.address?.town || 
                      data.address?.village || 
                      data.address?.municipality;
                      
          const state = data.address?.state;
          
          if (city && state) {
            const newLocationData = {
              city,
              state,
              fullLocation: `${city}/${state}`,
              isCustomSet: false
            };
            
            // Save to state and localStorage
            setLocationData(newLocationData);
            localStorage.setItem('userLocation', JSON.stringify(newLocationData));
          } else {
            setPermissionDenied(true);
          }
        } catch (error) {
          console.error("Error getting location name:", error);
          setPermissionDenied(true);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setPermissionDenied(true);
        setIsLoading(false);
      }
    );
  };

  // Function to manually set location
  const setManualLocation = (city: string, state: string) => {
    if (!city || !state) return;
    
    const newLocationData = {
      city,
      state,
      fullLocation: `${city}/${state}`,
      isCustomSet: true
    };
    
    setLocationData(newLocationData);
    localStorage.setItem('userLocation', JSON.stringify(newLocationData));
    
    toast.success(`Localização atualizada para ${city}/${state}`);
  };

  // Function to clear location
  const clearLocation = () => {
    localStorage.removeItem('userLocation');
    setLocationData({
      city: null,
      state: null,
      fullLocation: null,
      isCustomSet: false
    });
  };

  return {
    locationData,
    isLoading,
    permissionDenied,
    requestGeolocation,
    setManualLocation,
    clearLocation
  };
}
