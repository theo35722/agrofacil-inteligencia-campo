import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, PlusCircle, AlertCircle, Search, MessageCircle } from "lucide-react";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { toast } from "@/components/ui/sonner";
import { Link } from "react-router-dom";
import { LocationFilter } from "@/components/marketplace/LocationFilter";
import { useLocationManager } from "@/hooks/use-location-manager";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

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
  
  // Filter products by search query, city, state or both
  const getFilteredProducts = () => {
    let filtered = products;
    
    // Apply search filter if there is a search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }
    
    // If no location data is set, return search-filtered products
    if (!locationData.city && !locationData.state) return filtered;

    // Filter products based on available location data
    return filtered.filter(product => {
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
    
    let filtered = products;
    
    // Apply search filter if there is a search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }
    
    return filtered.filter(product => {
      // Include products from the same state but not already in the city-filtered list
      return product.location.toLowerCase().includes(locationData.state!.toLowerCase()) &&
             (!locationData.city || !product.location.toLowerCase().includes(locationData.city.toLowerCase()));
    });
  };

  // Get products that don't match our location filters
  const getOtherProducts = () => {
    if (!locationData.state && !locationData.city) return [];
    
    let filtered = products;
    
    // Apply search filter if there is a search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }
    
    return filtered.filter(product => {
      if (locationData.state) {
        return !product.location.toLowerCase().includes(locationData.state.toLowerCase());
      }
      return !product.location.toLowerCase().includes(locationData.city?.toLowerCase() || "");
    });
  };

  const cityFilteredProducts = getFilteredProducts();
  const nearbyStateProducts = getNearbyStateProducts();
  const otherProducts = getOtherProducts();
  
  // Always show nearby state products if no city products are found
  const showNearbyStateProducts = locationData.city && cityFilteredProducts.length === 0;

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
    const phoneNumber = product.contact_phone.replace(/\D/g, "");
    const message = `Olá! Vi seu anúncio "${product.title}" no AgroFácil e tenho interesse.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Check if we have any results after all filters
  const noResults = searchQuery.trim() !== "" && 
                    cityFilteredProducts.length === 0 && 
                    nearbyStateProducts.length === 0 && 
                    otherProducts.length === 0;

  // Location display component
  const LocationDisplay = () => {
    if (locationLoading) return null;
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
          onClick={() => document.getElementById('location-filter-button')?.click()}
        >
          Trocar localização
        </Button>
      </div>
    );
  };

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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        
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
          <LocationDisplay />
          
          {/* No Results Message */}
          {noResults && (
            <Alert className="bg-amber-50 border-amber-200 mb-6">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <AlertTitle className="text-amber-800">Nenhum produto encontrado</AlertTitle>
              <AlertDescription className="text-amber-700">
                Não encontramos produtos correspondentes à sua busca{locationData.city || locationData.state ? " na localização selecionada" : ""}.
                {" "}Tente outros termos ou {locationData.city || locationData.state ? "outra localização" : ""}.
              </AlertDescription>
            </Alert>
          )}
          
          {/* City Filtered Products */}
          {cityFilteredProducts.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cityFilteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onContact={() => handleContactSeller(product)}
                  />
                ))}
              </div>
            </div>
          ) : products.length > 0 && (locationData.city || locationData.state) && !noResults ? (
            <Card className="bg-amber-50 border-amber-200 mb-6 p-4">
              <div className="text-center">
                <AlertCircle className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-amber-800">
                  Nenhum produto encontrado em {locationData.fullLocation}
                </h3>
                <p className="text-amber-700 mt-1 mb-4">
                  Confira produtos em cidades próximas!
                </p>
              </div>
              
              {/* Automatically show nearby products */}
              {(nearbyStateProducts.length > 0 || otherProducts.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {nearbyStateProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onContact={() => handleContactSeller(product)}
                    />
                  ))}
                  
                  {otherProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onContact={() => handleContactSeller(product)}
                    />
                  ))}
                </div>
              )}
            </Card>
          ) : null}
          
          {/* Nearby State Products - only shown when explicitly required */}
          {showNearbyStateProducts && nearbyStateProducts.length > 0 && (
            <div className="space-y-4 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyStateProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onContact={() => handleContactSeller(product)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Other Products - when no location filter is active */}
          {!locationData.city && !locationData.state && products.length > 0 && !noResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.filter(product => 
                  !searchQuery.trim() || 
                  product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  product.description.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onContact={() => handleContactSeller(product)}
                  />
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

// Simple Product Card component
const ProductCard = ({ 
  product, 
  onContact 
}: { 
  product: MarketplaceProduct; 
  onContact: () => void;
}) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="grid grid-cols-3 gap-3 h-full">
        <div className="col-span-1 bg-gray-100">
          <AspectRatio ratio={1 / 1} className="h-full">
            {product.image_url && !imageError ? (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                Sem imagem
              </div>
            )}
          </AspectRatio>
        </div>
        
        <div className="col-span-2 p-3 flex flex-col">
          <h3 className="font-medium text-agro-green-800 mb-1 line-clamp-2">{product.title}</h3>
          <p className="font-bold text-lg text-agro-green-700 mb-auto">
            {formatCurrency(product.price)}
          </p>
          
          <div className="mt-2">
            <div className="flex items-center text-gray-500 text-xs mb-2">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{product.location}</span>
            </div>
            
            <Button 
              onClick={onContact}
              className="w-full gap-1 bg-green-600 hover:bg-green-700 text-sm h-8 mt-1"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Falar com Vendedor
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Marketplace;
