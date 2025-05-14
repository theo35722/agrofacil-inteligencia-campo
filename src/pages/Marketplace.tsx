
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/sonner";
import { MarketplaceProduct } from "@/types/marketplace";
import { fetchMarketplaceProducts, contactSeller } from "@/services/marketplaceService";
import { useMarketplaceFilters } from "@/hooks/use-marketplace-filters";

// Components
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { MarketplaceActions } from "@/components/marketplace/MarketplaceActions";
import { MarketplaceControls } from "@/components/marketplace/MarketplaceControls";
import { MarketplaceLoading } from "@/components/marketplace/MarketplaceLoading";
import { MarketplaceContent } from "@/components/marketplace/MarketplaceContent";
import { NoProductsMessage } from "@/components/marketplace/NoProductsMessage";
import { PhoneSettings } from "@/components/marketplace/PhoneSettings";

const Marketplace = () => {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  
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

    // Get user phone number from localStorage - retrieve normalized phone
    const storedPhone = localStorage.getItem('userPhone');
    setUserPhone(storedPhone);
    console.log("Telefone carregado do localStorage:", storedPhone);
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
    <div className="animate-fade-in pb-6">
      <MarketplaceHeader isLoading={isLoading} />
      
      <div className="max-w-md mx-auto px-4">
        <MarketplaceActions />
        
        {/* Make PhoneSettings visible to help users debug their phone setup */}
        <PhoneSettings userPhone={userPhone} setUserPhone={setUserPhone} />
        
        <div className="mb-6">
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
              userPhone={userPhone}
            />
          ) : (
            <div className="max-w-md mx-auto px-4">
              <NoProductsMessage />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Marketplace;
