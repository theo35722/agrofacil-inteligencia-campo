
import { useState, useEffect } from "react";
import { MarketplaceProduct, LocationData } from "@/types/marketplace";
import { useLocationManager } from "@/hooks/use-location-manager";
import { 
  filterProductsBySearchAndLocation, 
  getNearbyStateProducts, 
  getOtherProducts 
} from "@/services/marketplaceService";

export function useMarketplaceFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    locationData,
    isLoading: locationLoading,
    permissionDenied,
    setManualLocation,
    clearLocation,
    requestGeolocation
  } = useLocationManager();

  // Handle location change from the LocationFilter component
  const handleLocationChange = (city: string, state: string) => {
    setManualLocation(city, state);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Function to open the location filter
  const handleToggleLocationFilter = () => {
    // Find and click the location filter button
    document.getElementById('location-filter-button')?.click();
  };

  // Get filtered products based on search query and location
  const getFilteredProducts = (products: MarketplaceProduct[]) => {
    const cityFilteredProducts = filterProductsBySearchAndLocation(products, searchQuery, locationData);
    const nearbyStateProducts = getNearbyStateProducts(products, searchQuery, locationData);
    const otherProducts = getOtherProducts(products, searchQuery, locationData);
    
    // Combine nearby and other products for no local products message
    const allNearbyProducts = [...nearbyStateProducts, ...otherProducts];

    // Check if we have any results after all filters
    const noResults = searchQuery.trim() !== "" && 
      cityFilteredProducts.length === 0 && 
      nearbyStateProducts.length === 0 && 
      otherProducts.length === 0;
    
    return {
      cityFilteredProducts,
      nearbyStateProducts,
      otherProducts,
      allNearbyProducts,
      noResults
    };
  };

  return {
    searchQuery,
    locationData,
    locationLoading,
    permissionDenied,
    handleSearchChange,
    handleLocationChange,
    handleToggleLocationFilter,
    clearLocation,
    requestGeolocation,
    getFilteredProducts
  };
}
