
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { MapPin, MessageCircle, Edit, Trash2 } from "lucide-react";
import { MarketplaceProduct } from "@/types/marketplace";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MarketplaceItemProps {
  product: MarketplaceProduct;
}

export const MarketplaceItem: React.FC<MarketplaceItemProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Check if the current user is the owner of this product
  // Since we don't have user authentication tied to products currently,
  // all products can be edited by any user
  
  const handleContactSeller = () => {
    const phoneNumber = product.contact_phone.replace(/\D/g, "");
    const message = `Olá! Vi seu anúncio "${product.title}" no AgroFácil e tenho interesse.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleDeleteProduct = async () => {
    try {
      setIsDeleting(true);
      
      // 1. Delete the database record first
      const { error: dbError } = await supabase
        .from('marketplace_products')
        .delete()
        .eq('id', product.id);
        
      if (dbError) {
        throw new Error(`Erro ao excluir produto: ${dbError.message}`);
      }
      
      // 2. If there's an image, delete it from storage
      if (product.image_url) {
        // Extract the file path from the URL
        const imageUrl = new URL(product.image_url);
        const pathParts = imageUrl.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];
        
        const { error: storageError } = await supabase
          .storage
          .from('marketplace-images')
          .remove([fileName]);
          
        if (storageError) {
          console.error(`Erro ao excluir imagem: ${storageError.message}`);
          // We don't throw here since the product record is already deleted
          // Just log the error and proceed
        }
      }
      
      toast.success("Produto excluído com sucesso!");
      
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao excluir produto");
    } finally {
      setIsDeleting(false);
    }
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
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline"
              className="w-full gap-2 border-red-600 text-red-700 hover:bg-red-50"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              Excluir Produto
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmação de exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteProduct}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "Excluindo..." : "Sim, excluir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
