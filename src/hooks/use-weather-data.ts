
import { useQuery } from '@tanstack/react-query';
import { fetchWeatherData } from '@/services/openWeatherService';
import { useGeolocation } from './use-geolocation';
import { useState, useEffect } from 'react';

export const useWeatherData = () => {
  const location = useGeolocation();
  const [ready, setReady] = useState(false);

  // Verificar quando as coordenadas estão disponíveis
  useEffect(() => {
    if (location.latitude && location.longitude && !location.loading && !location.error) {
      setReady(true);
    }
  }, [location]);

  // Usar React Query para buscar e gerenciar os dados do clima
  const weatherQuery = useQuery({
    queryKey: ['weather', location.latitude, location.longitude],
    queryFn: () => fetchWeatherData(location.latitude!, location.longitude!),
    enabled: ready,
    staleTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false,
    refetchInterval: 60 * 60 * 1000, // Atualização automática a cada 1 hora
  });

  return {
    ...weatherQuery,
    isLocationLoading: location.loading,
    locationError: location.error,
  };
};
