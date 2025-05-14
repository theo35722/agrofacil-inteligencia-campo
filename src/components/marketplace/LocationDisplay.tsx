
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { LocationData } from "@/types/marketplace";

interface LocationDisplayProps {
  locationData: LocationData;
  onToggleLocationFilter: () => void;
}

export const LocationDisplay = ({ locationData, onToggleLocationFilter }: LocationDisplayProps) => {
  if (!locationData.city && !locationData.state) return null;
  
  return (
    <div className="flex items-center gap-2 text-sm mb-4">
      <MapPin className="h-4 w-4 text-agro-green-600" />
      <span className="text-gray-700">
        {locationData.fullLocation}
      </span>
      <Button 
        variant="link" 
        className="p-0 h-auto text-agro-green-600 text-sm"
        onClick={onToggleLocationFilter}
      >
        Trocar localização
      </Button>
    </div>
  );
};
