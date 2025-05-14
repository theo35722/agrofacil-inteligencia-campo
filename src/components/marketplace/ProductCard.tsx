
import { useState } from "react";
import { MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { formatCurrency } from "@/lib/utils";
import { MarketplaceProduct } from "@/types/marketplace";

interface ProductCardProps {
  product: MarketplaceProduct;
  onContact: () => void;
}

export const ProductCard = ({ product, onContact }: ProductCardProps) => {
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
