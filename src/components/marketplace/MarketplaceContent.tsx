import { MarketplaceProduct } from "@/types/marketplace";
import { ProductList } from "./ProductList";
import { NoResultsMessage } from "./NoResultsMessage";

interface MarketplaceContentProps {
  products: MarketplaceProduct[];
  cityFilteredProducts: MarketplaceProduct[];
  allNearbyProducts: MarketplaceProduct[];
  locationData: {
    city: string | null;
    state: string | null;
    fullLocation: string | null;
  };
  searchQuery: string;
  noResults: boolean;
  onContactSeller: (product: MarketplaceProduct) => void;
  userPhone: string | null;
}

export const MarketplaceContent = ({
  products,
  cityFilteredProducts,
  allNearbyProducts,
  locationData,
  searchQuery,
  noResults,
  onContactSeller,
  userPhone
}: MarketplaceContentProps) => {
  if (noResults) {
    return <NoResultsMessage searchQuery={searchQuery} locationData={locationData} />;
  }

  // City Filtered Products
  if (cityFilteredProducts.length > 0) {
    return <ProductList products={cityFilteredProducts} onContactSeller={onContactSeller} userPhone={userPhone} />;
  }

  // Nearby products when no products in the current city
  if (products.length > 0 && (locationData.city || locationData.state)) {
    return (
      <div className="space-y-4">
        {/* Simplified notice that shows products from nearby cities */}
        <div className="text-sm text-gray-500 px-1">
          Não encontramos produtos em {locationData.fullLocation}. Mostrando produtos de outras cidades próximas.
        </div>
        
        <ProductList products={allNearbyProducts} onContactSeller={onContactSeller} userPhone={userPhone} />
      </div>
    );
  }

  // Other Products - when no location filter is active
  if (!locationData.city && !locationData.state && products.length > 0) {
    return (
      <ProductList 
        products={products.filter(product => 
          !searchQuery.trim() || 
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        )} 
        onContactSeller={onContactSeller}
        userPhone={userPhone}
      />
    );
  }

  // No Products
  return null;
};
