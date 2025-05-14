
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, X, Loader2, Map } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  onRequestGeolocation,
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
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-1 text-sm text-gray-600">
        {isLoading ? (
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Detectando localização...</span>
          </div>
        ) : locationData.fullLocation ? (
          <div className="flex items-center gap-2 bg-agro-green-50 text-agro-green-700 px-3 py-1 rounded-full">
            <MapPin className="h-4 w-4" />
            <span>{locationData.fullLocation}</span>
            <button 
              onClick={onClearLocation}
              className="hover:bg-agro-green-100 rounded-full p-1"
              title="Limpar filtro de localização"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : permissionDenied ? (
          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
            <Map className="h-4 w-4" />
            <span>Localização não detectada</span>
          </div>
        ) : null}
      </div>
      
      <div className="flex gap-2">
        {permissionDenied && (
          <Button 
            variant="outline" 
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
            onClick={onRequestGeolocation}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Detectar Localização
          </Button>
        )}
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="border-agro-green-300 text-agro-green-700 hover:bg-agro-green-50"
            >
              <MapPin className="mr-2 h-4 w-4" />
              {locationData.fullLocation ? "Trocar localização" : "Definir localização"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="font-medium">Filtrar produtos por localização</h4>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor="state" className="text-sm font-medium mb-1 block">Estado</label>
                  <Select 
                    value={selectedState} 
                    onValueChange={setSelectedState}
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Selecione um estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {brazilianStates.map((state) => (
                        <SelectItem key={state.uf} value={state.uf}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="city" className="text-sm font-medium mb-1 block">Cidade</label>
                  <Input
                    id="city"
                    placeholder="Digite o nome da cidade"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={!selectedCity || !selectedState}>
                <Search className="h-4 w-4 mr-2" />
                Aplicar Filtro
              </Button>
              
              <p className="text-xs text-gray-500">
                Digite o estado e cidade para filtrar os produtos disponíveis nessa localidade.
              </p>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
