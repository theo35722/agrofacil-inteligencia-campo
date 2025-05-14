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
  return;
}