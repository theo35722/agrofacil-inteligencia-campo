
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { LocationData, MarketplaceProduct } from "@/types/marketplace";
import { ProductCard } from "./ProductCard";

interface NoLocalProductsMessageProps {
  locationData: LocationData;
  nearbyProducts: MarketplaceProduct[];
  handleContactSeller: (product: MarketplaceProduct) => void;
}

export const NoLocalProductsMessage = ({ 
  locationData,
  nearbyProducts,
  handleContactSeller
}: NoLocalProductsMessageProps) => {
  return (
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
      
      {nearbyProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {nearbyProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onContact={() => handleContactSeller(product)}
            />
          ))}
        </div>
      )}
    </Card>
  );
};
