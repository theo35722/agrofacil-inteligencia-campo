
import { useState } from "react";
import { MessageCircle, MapPin, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { formatCurrency } from "@/lib/utils";
import { MarketplaceProduct } from "@/types/marketplace";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProductCardProps {
  product: MarketplaceProduct;
  onContact: () => void;
  isOwner?: boolean;
  onProductDeleted?: () => void;
}

export const ProductCard = ({ 
  product, 
  onContact, 
  isOwner = false,
  onProductDeleted 
}: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isMobile = useIsMobile();
  
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
        }
      }
      
      toast.success("Produto excluído com sucesso!");
      
      // Call the callback to refresh products if provided
      if (onProductDeleted) {
        onProductDeleted();
      }
      
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao excluir produto");
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow rounded-lg">
      <div className={`grid grid-cols-3 gap-2 ${isMobile ? 'p-2' : 'gap-3 p-0'} h-full`}>
        <div className="col-span-1 bg-gray-50 rounded-md">
          <AspectRatio ratio={1 / 1} className="h-full">
            {product.image_url && !imageError ? (
              <div className="flex items-center justify-center h-full">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-md"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-md">
                Sem imagem
              </div>
            )}
          </AspectRatio>
        </div>
        
        <div className="col-span-2 p-2 flex flex-col">
          <h3 className={`font-medium text-agro-green-800 mb-1 line-clamp-2 ${isMobile ? 'text-sm' : ''} text-center`}>
            {product.title}
          </h3>
          <p className="font-bold text-xl text-agro-green-700 mb-auto text-center">
            {formatCurrency(product.price)}
          </p>
          
          <div className="mt-2">
            <div className="flex items-center justify-center text-gray-500 text-xs mb-2">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{product.location}</span>
            </div>
            
            <div className="space-y-1">
              {/* Contact button for non-owners */}
              {!isOwner && (
                <Button 
                  onClick={onContact}
                  className={`w-full gap-1 bg-green-600 hover:bg-green-700 text-sm ${isMobile ? 'h-9 py-1 text-xs' : 'h-11'} rounded-md`}
                >
                  <MessageCircle className="h-4 w-4" />
                  {isMobile ? "Contatar" : "Falar com Vendedor"}
                </Button>
              )}
              
              {/* Edit and Delete buttons for product owners */}
              {isOwner && (
                <div className="grid grid-cols-2 gap-2">
                  <Link to={`/edit-marketplace-product/${product.id}`} className="w-full">
                    <Button 
                      variant="outline"
                      className={`w-full gap-1 border-green-600 text-green-700 hover:bg-green-50 ${isMobile ? 'text-xs h-8 py-0' : 'text-sm h-10'} rounded-md`}
                    >
                      <Edit className={`${isMobile ? 'h-3 w-3' : 'h-3.5 w-3.5'}`} />
                      Editar
                    </Button>
                  </Link>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline"
                        className={`w-full gap-1 border-red-600 text-red-700 hover:bg-red-50 ${isMobile ? 'text-xs h-8 py-0' : 'text-sm h-10'} rounded-md`}
                        disabled={isDeleting}
                      >
                        <Trash2 className={`${isMobile ? 'h-3 w-3' : 'h-3.5 w-3.5'}`} />
                        {isDeleting ? "..." : "Excluir"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className={isMobile ? "w-[90%] max-w-sm p-4" : ""}>
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
