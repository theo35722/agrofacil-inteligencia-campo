import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, PlusCircle } from "lucide-react";
import { MarketplaceItem } from "@/components/marketplace/MarketplaceItem";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { toast } from "@/components/ui/sonner";
import { Link } from "react-router-dom";
import { useLocationName } from "@/hooks/use-location-name";
import { LocationFilter } from "@/components/marketplace/LocationFilter";

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
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const { locationName, isLoading: locationLoading } = useLocationName();
  
  // Set initial location filter from user's detected location
  useEffect(() => {
    if (locationName && !locationFilter) {
      // Extract just the city name from "City, State"
      const cityName = locationName.split(',')[0]?.trim();
      if (cityName) {
        setLocationFilter(cityName);
      }
    }
  }, [locationName, locationFilter]);

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
  
  // Filter products by location
  const filteredProducts = locationFilter
    ? products.filter(product => 
        product.location.toLowerCase().includes(locationFilter.toLowerCase())
      )
    : products;
    
  // Separate local and other products
  const localProducts = filteredProducts;
  const otherProducts = locationFilter 
    ? products.filter(product => 
        !product.location.toLowerCase().includes(locationFilter.toLowerCase())
      )
    : [];
  
  // Handle location change
  const handleLocationChange = (newLocation: string | null) => {
    setLocationFilter(newLocation);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <MarketplaceHeader location={locationFilter} />
        <Link to="/create-marketplace-product">
          <Button className="bg-agro-green-600 hover:bg-agro-green-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Anunciar Produto
          </Button>
        </Link>
      </div>
      
      <LocationFilter 
        currentLocation={locationFilter}
        onLocationChange={handleLocationChange}
      />
      
      {loading || locationLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-agro-green-600 animate-spin" />
          <span className="ml-2 text-agro-green-600">Carregando produtos...</span>
        </div>
      ) : (
        <>
          {/* Local Products */}
          {localProducts.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-agro-green-600" />
                Produtos em {locationFilter}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {localProducts.map((product) => (
                  <MarketplaceItem key={product.id} product={product} />
                ))}
              </div>
            </div>
          ) : products.length > 0 ? (
            <div className="text-center py-6 border rounded-lg bg-gray-50 mb-6">
              <h3 className="text-lg font-medium text-gray-600">Nenhum produto encontrado em {locationFilter}</h3>
              <p className="text-gray-500 mt-2">Veja produtos em outros locais!</p>
            </div>
          ) : null}
          
          {/* Other Products (only show if we have a location filter and there are other products) */}
          {locationFilter && otherProducts.length > 0 && (
            <div className="space-y-4 mt-8">
              <h2 className="text-xl font-semibold">Outros produtos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherProducts.map((product) => (
                  <MarketplaceItem key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
          
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
