
import { MarketplaceProduct } from "@/types/marketplace";
import { ProductList } from "./ProductList";

interface NoLocalProductsMessageProps {
  locationData: {
    city: string | null;
    state: string | null;
    fullLocation: string | null;
  };
  nearbyProducts: MarketplaceProduct[];
  handleContactSeller: (product: MarketplaceProduct) => void;
}

export const NoLocalProductsMessage = ({ 
  locationData,
  nearbyProducts,
  handleContactSeller
}: NoLocalProductsMessageProps) => {
  if (nearbyProducts.length === 0) return null;
  
  return (
    <div className="mb-4">
      <div className="text-gray-600 text-sm mb-3 bg-gray-50 p-2 rounded-md">
        Não encontramos produtos em {locationData.fullLocation}. 
        Mostrando produtos de outras cidades próximas.
      </div>
      
      <ProductList 
        products={nearbyProducts}
        onContactSeller={handleContactSeller}
      />
    </div>
  );
};
