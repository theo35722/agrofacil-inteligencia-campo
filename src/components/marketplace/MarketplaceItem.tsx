
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { MapPin, MessageCircle, Edit } from "lucide-react";
import { MarketplaceProduct } from "@/pages/Marketplace";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface MarketplaceItemProps {
  product: MarketplaceProduct;
}

export const MarketplaceItem: React.FC<MarketplaceItemProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  
  // Check if the current user is the owner of this product
  // Since we don't have user authentication tied to products currently,
  // all products can be edited by any user
  
  const handleContactSeller = () => {
    const phoneNumber = product.contact_phone.replace(/\D/g, "");
    const message = `Olá! Vi seu anúncio "${product.title}" no AgroFácil e tenho interesse.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {product.image_url && !imageError ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sem imagem
          </div>
        )}
      </div>
      <CardContent className="flex-grow p-4">
        <h3 className="font-semibold text-lg text-agro-green-800 mb-1">{product.title}</h3>
        <p className="font-bold text-xl text-agro-green-700 mb-2">
          {formatCurrency(product.price)}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.description}</p>
        <div className="flex items-center text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{product.location}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4 px-4 flex flex-col gap-2">
        <Button 
          onClick={handleContactSeller}
          className="w-full gap-2 bg-green-600 hover:bg-green-700"
        >
          <MessageCircle className="h-4 w-4" />
          Falar com Vendedor
        </Button>
        
        <Link to={`/edit-marketplace-product/${product.id}`} className="w-full">
          <Button 
            variant="outline"
            className="w-full gap-2 border-green-600 text-green-700 hover:bg-green-50"
          >
            <Edit className="h-4 w-4" />
            Editar Produto
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
