
import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
}

export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: true,
    error: null,
    permissionDenied: false,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocalização não é suportada pelo seu navegador.'
      }));
      return;
    }

    const getPosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            loading: false,
            error: null,
            permissionDenied: false,
          });
        },
        (error) => {
          console.log('Erro de geolocalização:', error.code, error.message);
          const permissionDenied = error.code === 1; // 1 = permission denied
          let errorMessage = 'Não foi possível obter sua localização';
          
          if (permissionDenied) {
            errorMessage = 'Permissão de localização negada. Por favor, habilite o acesso à sua localização nas configurações do navegador.';
          } else if (error.code === 2) {
            errorMessage = 'Sua localização está indisponível no momento. Verifique se o GPS está ativado.';
          } else if (error.code === 3) {
            errorMessage = 'Tempo esgotado ao tentar obter sua localização. Tente novamente.';
          }
          
          setLocation(prev => ({
            ...prev,
            loading: false,
            error: errorMessage,
            permissionDenied,
          }));
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    getPosition();

    // Adicionar um watcher de posição para atualizar caso o usuário se mova
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: null,
          permissionDenied: false,
        });
      },
      () => {}, // Ignorar erros aqui, já tratamos no getCurrentPosition
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Método para retry da geolocalização
  const retryGeolocation = () => {
    setLocation(prev => ({
      ...prev,
      loading: true,
      error: null,
      permissionDenied: false,
    }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: null,
          permissionDenied: false,
        });
      },
      (error) => {
        const permissionDenied = error.code === 1;
        let errorMessage = 'Não foi possível obter sua localização';
        
        if (permissionDenied) {
          errorMessage = 'Permissão de localização negada. Por favor, habilite o acesso à sua localização nas configurações do navegador.';
        } else if (error.code === 2) {
          errorMessage = 'Sua localização está indisponível no momento. Verifique se o GPS está ativado.';
        } else if (error.code === 3) {
          errorMessage = 'Tempo esgotado ao tentar obter sua localização. Tente novamente.';
        }
        
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
          permissionDenied,
        }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return { ...location, retryGeolocation };
}
