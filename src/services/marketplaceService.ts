
import { supabase } from "@/integrations/supabase/client";
import { MarketplaceProduct, LocationData } from "@/types/marketplace";

export const fetchMarketplaceProducts = async (): Promise<{ data: MarketplaceProduct[] | null, error: any }> => {
  try {
    const { data, error } = await supabase
      .from("marketplace_products")
      .select("*")
      .order("created_at", { ascending: false });

    return { data, error };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { data: null, error: err };
  }
};

export const filterProductsBySearchAndLocation = (
  products: MarketplaceProduct[],
  searchQuery: string,
  locationData: LocationData
) => {
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

export const getNearbyStateProducts = (
  products: MarketplaceProduct[],
  searchQuery: string,
  locationData: LocationData
) => {
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

export const getOtherProducts = (
  products: MarketplaceProduct[],
  searchQuery: string,
  locationData: LocationData
) => {
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

export const contactSeller = (product: MarketplaceProduct) => {
  const phoneNumber = product.contact_phone.replace(/\D/g, "");
  const message = `Olá! Vi seu anúncio "${product.title}" no AgroFácil e tenho interesse.`;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
};
