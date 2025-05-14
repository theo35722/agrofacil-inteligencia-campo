
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, X, Loader2, Map } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { brazilianStates } from "@/data/brazilianStates";

interface LocationFilterProps {
  isLoading: boolean;
  permissionDenied: boolean;
  locationData: {
    city: string | null;
    state: string | null;
    fullLocation: string | null;
  };
  onLocationChange: (city: string, state: string) => void;
  onClearLocation: () => void;
  onRequestGeolocation: () => void;
}

export function LocationFilter({
  isLoading,
  permissionDenied,
  locationData,
  onLocationChange,
  onClearLocation,
  onRequestGeolocation
}: LocationFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCity && selectedState) {
      onLocationChange(selectedCity, selectedState);
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          id="location-filter-button"
          variant="outline" 
          size="sm" 
          className="h-9 gap-1 text-gray-600 border-gray-300"
        >
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">Trocar Localização</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <h4 className="font-medium">Selecione sua localização</h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-medium">
                Estado
              </label>
              <Select 
                value={selectedState} 
                onValueChange={setSelectedState}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {brazilianStates.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">
                Cidade
              </label>
              <Input
                id="city"
                placeholder="Digite o nome da cidade"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              />
            </div>
            
            <div className="flex justify-between pt-2">
              <Button 
                type="button" 
                variant="outline"
                size="sm"
                onClick={onRequestGeolocation}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" /> 
                    Localizando...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-1" /> 
                    Usar minha localização
                  </>
                )}
              </Button>
              
              <Button 
                type="submit" 
                size="sm"
                disabled={!selectedCity || !selectedState}
              >
                Aplicar
              </Button>
            </div>
            
            {permissionDenied && (
              <p className="text-xs text-red-500 mt-2">
                Permissão de localização negada. Por favor, permita o acesso à sua localização nas configurações do navegador ou defina manualmente.
              </p>
            )}
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
