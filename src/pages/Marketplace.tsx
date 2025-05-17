
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MarketplaceProduct } from "@/types/marketplace";
import { fetchMarketplaceProducts, contactSeller } from "@/services/marketplaceService";
import { useMarketplaceFilters } from "@/hooks/use-marketplace-filters";
import { useIsMobile } from "@/hooks/use-mobile";

// Components
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { MarketplaceActions } from "@/components/marketplace/MarketplaceActions";
import { MarketplaceControls } from "@/components/marketplace/MarketplaceControls";
import { MarketplaceLoading } from "@/components/marketplace/MarketplaceLoading";
import { MarketplaceContent } from "@/components/marketplace/MarketplaceContent";
import { NoProductsMessage } from "@/components/marketplace/NoProductsMessage";

const Marketplace = () => {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  
  const {
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
  } = useMarketplaceFilters();

  // Fetch products when the component mounts
  useEffect(() => {
    async function getProducts() {
      try {
        setLoading(true);
        const {
          data,
          error
        } = await fetchMarketplaceProducts();
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

  // Handle contact seller via WhatsApp
  const handleContactSeller = (product: MarketplaceProduct) => {
    contactSeller(product);
  };

  // Get filtered products
  const {
    cityFilteredProducts,
    allNearbyProducts,
    noResults
  } = getFilteredProducts(products);

  const isLoading = loading || locationLoading;

  return (
    <div className={`animate-fade-in pb-6 ${isMobile ? 'pt-2' : ''}`}>
      <MarketplaceHeader isLoading={isLoading} />
      
      <div className={`max-w-md mx-auto ${isMobile ? 'px-3' : 'px-4'}`}>
        <MarketplaceActions />
        
        <div className="mb-4">
          <MarketplaceControls 
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            locationData={locationData}
            locationLoading={locationLoading}
            permissionDenied={permissionDenied}
            onToggleLocationFilter={handleToggleLocationFilter}
            onLocationChange={handleLocationChange}
            onClearLocation={clearLocation}
            onRequestGeolocation={requestGeolocation}
          />
        </div>
      </div>
      
      {isLoading ? (
        <MarketplaceLoading />
      ) : (
        <>
          {products.length > 0 ? (
            <MarketplaceContent 
              products={products}
              cityFilteredProducts={cityFilteredProducts}
              allNearbyProducts={allNearbyProducts}
              locationData={locationData}
              searchQuery={searchQuery}
              noResults={noResults}
              onContactSeller={handleContactSeller}
              isMobile={isMobile}
            />
          ) : (
            <div className="max-w-md mx-auto px-3">
              <NoProductsMessage />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Marketplace;
