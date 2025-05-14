import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useLocationManager } from "@/hooks/use-location-manager";
import { MarketplaceProduct } from "@/types/marketplace";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { LocationFilter } from "@/components/marketplace/LocationFilter";
import { LocationDisplay } from "@/components/marketplace/LocationDisplay";
import { SearchInput } from "@/components/marketplace/SearchInput";
import { ProductList } from "@/components/marketplace/ProductList";
import { NoResultsMessage } from "@/components/marketplace/NoResultsMessage";
import { NoLocalProductsMessage } from "@/components/marketplace/NoLocalProductsMessage";
import { NoProductsMessage } from "@/components/marketplace/NoProductsMessage";
import { 
  fetchMarketplaceProducts, 
  filterProductsBySearchAndLocation,
  getNearbyStateProducts,
  getOtherProducts,
  contactSeller
} from "@/services/marketplaceService";

const Marketplace = () => {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { 
    locationData, 
    isLoading: locationLoading, 
    permissionDenied,
    setManualLocation,
    clearLocation,
    requestGeolocation
  } = useLocationManager();

  // Fetch products when the component mounts
  useEffect(() => {
    async function getProducts() {
      try {
        setLoading(true);
        const { data, error } = await fetchMarketplaceProducts();

        if (error) {
          console.error("Error fetching marketplace products:", error);
          toast.error("Erro ao carregar produtos do marketplace");
          return;
        }

        setProducts(data || []);
      } finally {
        setLoading(false);
      }
    }
    
    getProducts();
  }, []);
  
  // Handle location change from the LocationFilter component
  const handleLocationChange = (city: string, state: string) => {
    setManualLocation(city, state);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle contact seller via WhatsApp
  const handleContactSeller = (product: MarketplaceProduct) => {
    contactSeller(product);
  };
  
  // Function to open the location filter
  const handleToggleLocationFilter = () => {
    // Find and click the location filter button
    document.getElementById('location-filter-button')?.click();
  };

  // Get filtered products based on search query and location
  const cityFilteredProducts = filterProductsBySearchAndLocation(products, searchQuery, locationData);
  const nearbyStateProducts = getNearbyStateProducts(products, searchQuery, locationData);
  const otherProducts = getOtherProducts(products, searchQuery, locationData);
  
  // Always show nearby state products if no city products are found
  const showNearbyStateProducts = locationData.city && cityFilteredProducts.length === 0;
  
  // Check if we have any results after all filters
  const noResults = searchQuery.trim() !== "" && 
                    cityFilteredProducts.length === 0 && 
                    nearbyStateProducts.length === 0 && 
                    otherProducts.length === 0;
  
  // Combine nearby and other products for no local products message
  const nearbyProducts = [...nearbyStateProducts, ...otherProducts];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <MarketplaceHeader isLoading={locationLoading} />
        <Link to="/create-marketplace-product">
          <Button className="bg-agro-green-600 hover:bg-agro-green-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Anunciar Produto
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col gap-4">
        <SearchInput 
          searchQuery={searchQuery} 
          onSearchChange={handleSearchChange} 
        />
        
        <LocationFilter 
          isLoading={locationLoading}
          permissionDenied={permissionDenied}
          locationData={locationData}
          onLocationChange={handleLocationChange}
          onClearLocation={clearLocation}
          onRequestGeolocation={requestGeolocation}
        />
      </div>
      
      {loading || locationLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-agro-green-600 animate-spin" />
          <span className="ml-2 text-agro-green-600">Carregando produtos...</span>
        </div>
      ) : (
        <>
          <LocationDisplay 
            locationData={locationData}
            onToggleLocationFilter={handleToggleLocationFilter}
          />
          
          {/* No Results Message */}
          {noResults && (
            <NoResultsMessage
              searchQuery={searchQuery}
              locationData={locationData}
            />
          )}
          
          {/* City Filtered Products */}
          {cityFilteredProducts.length > 0 ? (
            <ProductList 
              products={cityFilteredProducts} 
              onContactSeller={handleContactSeller} 
            />
          ) : products.length > 0 && (locationData.city || locationData.state) && !noResults ? (
            <NoLocalProductsMessage
              locationData={locationData}
              nearbyProducts={nearbyProducts}
              handleContactSeller={handleContactSeller}
            />
          ) : null}
          
          {/* Nearby State Products - only shown when explicitly required */}
          {showNearbyStateProducts && nearbyStateProducts.length > 0 && (
            <ProductList 
              products={nearbyStateProducts} 
              onContactSeller={handleContactSeller}
            />
          )}
          
          {/* Other Products - when no location filter is active */}
          {!locationData.city && !locationData.state && products.length > 0 && !noResults && (
            <ProductList 
              products={products.filter(product => 
                !searchQuery.trim() || 
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
              )} 
              onContactSeller={handleContactSeller}
            />
          )}
          
          {/* No Products */}
          {products.length === 0 && <NoProductsMessage />}
        </>
      )}
    </div>
  );
};

export default Marketplace;
