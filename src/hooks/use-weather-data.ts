
import { useQuery } from '@tanstack/react-query';
import { fetchWeatherData } from '@/services/openWeatherService';
import { useGeolocation } from './use-geolocation';
import { useState, useEffect } from 'react';

export const useWeatherData = () => {
  const location = useGeolocation();
  const [ready, setReady] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Verificar quando as coordenadas estão disponíveis
  useEffect(() => {
    if (location.latitude && location.longitude && !location.loading && !location.error) {
      setReady(true);
      setLocationError(null);
    } else if (location.error) {
      setLocationError(location.error);
    }
  }, [location.latitude, location.longitude, location.loading, location.error]);

  // Usar React Query para buscar e gerenciar os dados do clima
  const weatherQuery = useQuery({
    queryKey: ['weather', location.latitude, location.longitude],
    queryFn: async () => {
      if (!location.latitude || !location.longitude) {
        throw new Error('Coordenadas de localização não disponíveis');
      }
      
      console.log(`Buscando dados meteorológicos para: ${location.latitude}, ${location.longitude}`);
      try {
        const data = await fetchWeatherData(location.latitude, location.longitude);
        console.log('Dados meteorológicos recebidos:', data);
        return data;
      } catch (error) {
        console.error('Erro ao buscar dados meteorológicos:', error);
        throw error;
      }
    },
    enabled: ready,
    staleTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false,
    refetchInterval: 60 * 60 * 1000, // Atualização automática a cada 1 hora
    retry: 2,
    refetchOnMount: 'always', // Always fetch fresh data when component mounts
    gcTime: 60 * 60 * 1000, // Manter dados em cache por 1 hora
  });

  return {
    ...weatherQuery,
    isLocationLoading: location.loading,
    locationError,
  };
};
