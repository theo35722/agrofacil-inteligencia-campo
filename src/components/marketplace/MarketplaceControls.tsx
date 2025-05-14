
import { SearchInput } from "./SearchInput";
import { LocationDisplay } from "./LocationDisplay";
import { LocationFilter } from "./LocationFilter";
import { LocationData } from "@/types/marketplace";

interface MarketplaceControlsProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  locationData: LocationData;
  locationLoading: boolean;
  permissionDenied: boolean;
  onToggleLocationFilter: () => void;
  onLocationChange: (city: string, state: string) => void;
  onClearLocation: () => void;
  onRequestGeolocation: () => void;
}

export const MarketplaceControls = ({
  searchQuery,
  onSearchChange,
  locationData,
  locationLoading,
  permissionDenied,
  onToggleLocationFilter,
  onLocationChange,
  onClearLocation,
  onRequestGeolocation
}: MarketplaceControlsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <SearchInput searchQuery={searchQuery} onSearchChange={onSearchChange} />
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-2">
        <LocationDisplay 
          locationData={locationData} 
          onToggleLocationFilter={onToggleLocationFilter} 
        />
        
        <LocationFilter 
          isLoading={locationLoading} 
          permissionDenied={permissionDenied} 
          locationData={locationData} 
          onLocationChange={onLocationChange} 
          onClearLocation={onClearLocation} 
          onRequestGeolocation={onRequestGeolocation} 
        />
      </div>
    </div>
  );
};
