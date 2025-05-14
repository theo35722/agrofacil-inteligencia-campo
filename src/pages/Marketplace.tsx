import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, PlusCircle, AlertCircle } from "lucide-react";
import { MarketplaceItem } from "@/components/marketplace/MarketplaceItem";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { toast } from "@/components/ui/sonner";
import { Link } from "react-router-dom";
import { LocationFilter } from "@/components/marketplace/LocationFilter";
import { useLocationManager } from "@/hooks/use-location-manager";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type MarketplaceProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  image_url: string | null;
  contact_phone: string;
  created_at: string;
};

const Marketplace = () => {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
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
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("marketplace_products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching marketplace products:", error);
        toast.error("Erro ao carregar produtos do marketplace");
        return;
      }

      setProducts(data || []);
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Erro ao carregar produtos do marketplace");
    } finally {
      setLoading(false);
    }
  }
  
  // Filter products by city, state or both
  const getFilteredProducts = () => {
    // If no location data is set, return all products
    if (!locationData.city && !locationData.state) return products;

    // Filter products based on available location data
    return products.filter(product => {
      if (locationData.city && locationData.state) {
        // Try to match both city and state
        return product.location.toLowerCase().includes(locationData.city.toLowerCase()) &&
               product.location.toLowerCase().includes(locationData.state.toLowerCase());
      } else if (locationData.city) {
        // Only match city
        return product.location.toLowerCase().includes(locationData.city.toLowerCase());
      } else if (locationData.state) {
        // Only match state
        return product.location.toLowerCase().includes(locationData.state.toLowerCase());
      }
      return true;
    });
  };

  // Get products from the same state but different cities
  const getNearbyStateProducts = () => {
    if (!locationData.state) return [];
    
    return products.filter(product => {
      // Include products from the same state but not already in the city-filtered list
      return product.location.toLowerCase().includes(locationData.state!.toLowerCase()) &&
             (!locationData.city || !product.location.toLowerCase().includes(locationData.city.toLowerCase()));
    });
  };

  // Get products that don't match our location filters
  const getOtherProducts = () => {
    if (!locationData.state && !locationData.city) return [];
    
    return products.filter(product => {
      if (locationData.state) {
        return !product.location.toLowerCase().includes(locationData.state.toLowerCase());
      }
      return !product.location.toLowerCase().includes(locationData.city?.toLowerCase() || "");
    });
  };

  const cityFilteredProducts = getFilteredProducts();
  const nearbyStateProducts = getNearbyStateProducts();
  const otherProducts = getOtherProducts();
  
  // Show nearby state products only if there are few city products
  const showNearbyStateProducts = cityFilteredProducts.length < 3 && nearbyStateProducts.length > 0;

  // Handle location change from the LocationFilter component
  const handleLocationChange = (city: string, state: string) => {
    setManualLocation(city, state);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <MarketplaceHeader 
          city={locationData.city} 
          state={locationData.state} 
          isLoading={locationLoading}
        />
        <Link to="/create-marketplace-product">
          <Button className="bg-agro-green-600 hover:bg-agro-green-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Anunciar Produto
          </Button>
        </Link>
      </div>
      
      <LocationFilter 
        isLoading={locationLoading}
        permissionDenied={permissionDenied}
        locationData={locationData}
        onLocationChange={handleLocationChange}
        onClearLocation={clearLocation}
        onRequestGeolocation={requestGeolocation}
      />
      
      {loading || locationLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-agro-green-600 animate-spin" />
          <span className="ml-2 text-agro-green-600">Carregando produtos...</span>
        </div>
      ) : (
        <>
          {/* City Filtered Products */}
          {cityFilteredProducts.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-agro-green-600" />
                Produtos em {locationData.city || ""}{locationData.state ? `/${locationData.state}` : ""}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cityFilteredProducts.map((product) => (
                  <MarketplaceItem key={product.id} product={product} />
                ))}
              </div>
            </div>
          ) : products.length > 0 && (locationData.city || locationData.state) ? (
            <Alert className="bg-amber-50 border-amber-200 mb-6">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <AlertTitle className="text-amber-800">Nenhum produto encontrado na sua localização</AlertTitle>
              <AlertDescription className="text-amber-700">
                {locationData.city && locationData.state
                  ? `Não encontramos produtos em ${locationData.city}/${locationData.state}.`
                  : locationData.city
                  ? `Não encontramos produtos em ${locationData.city}.`
                  : `Não encontramos produtos em ${locationData.state}.`
                }
                {" "}Veja produtos em outros locais!
              </AlertDescription>
            </Alert>
          ) : null}
          
          {/* Nearby State Products */}
          {showNearbyStateProducts && (
            <div className="space-y-4 mt-8">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <AlertTitle className="text-blue-800">Expandindo para cidades próximas</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Encontramos mais produtos do estado {locationData.state} que podem te interessar.
                </AlertDescription>
              </Alert>
              
              <h2 className="text-xl font-semibold mt-4">
                Produtos em {locationData.state}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearbyStateProducts.map((product) => (
                  <MarketplaceItem key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
          
          {/* Other Products */}
          {otherProducts.length > 0 && (locationData.city || locationData.state) && (
            <div className="space-y-4 mt-8">
              <h2 className="text-xl font-semibold">Outros produtos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherProducts.map((product) => (
                  <MarketplaceItem key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
          
          {/* No Products */}
          {products.length === 0 && (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <h3 className="text-xl font-medium text-gray-600">Nenhum produto disponível</h3>
              <p className="text-gray-500 mt-2">Seja o primeiro a anunciar um produto!</p>
              <Link to="/create-marketplace-product" className="mt-4 inline-block">
                <Button className="bg-agro-green-600 hover:bg-agro-green-700 mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Anunciar Produto
                </Button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Marketplace;
