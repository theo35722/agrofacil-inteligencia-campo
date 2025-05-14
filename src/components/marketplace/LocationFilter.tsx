
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface LocationFilterProps {
  currentLocation: string | null;
  onLocationChange: (location: string | null) => void;
}

export function LocationFilter({ currentLocation, onLocationChange }: LocationFilterProps) {
  const [searchLocation, setSearchLocation] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchLocation.trim()) {
      onLocationChange(searchLocation.trim());
    }
    
    setIsOpen(false);
  };
  
  const clearLocation = () => {
    onLocationChange(null);
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-1 text-sm text-gray-600">
        {currentLocation && (
          <div className="flex items-center gap-2 bg-agro-green-50 text-agro-green-700 px-3 py-1 rounded-full">
            <MapPin className="h-4 w-4" />
            <span>{currentLocation}</span>
            <button 
              onClick={clearLocation}
              className="hover:bg-agro-green-100 rounded-full p-1"
              title="Limpar filtro de localização"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="border-agro-green-300 text-agro-green-700 hover:bg-agro-green-50"
          >
            <MapPin className="mr-2 h-4 w-4" />
            {currentLocation ? "Trocar localização" : "Definir localização"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="font-medium">Filtrar produtos por localização</h4>
            <div className="flex gap-2">
              <Input 
                placeholder="Digite uma cidade..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Digite o nome de uma cidade para filtrar os produtos disponíveis nessa localidade.
            </p>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
}
