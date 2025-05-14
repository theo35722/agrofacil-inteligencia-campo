
import { useState } from "react";
import { MessageCircle, MapPin, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { formatCurrency } from "@/lib/utils";
import { MarketplaceProduct } from "@/types/marketplace";
import { Link } from "react-router-dom";
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
  userPhone?: string | null;
}

export const ProductCard = ({ product, onContact, userPhone }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Normalize phone numbers for comparison by removing any non-digit characters
  const normalizePhone = (phone: string | null | undefined) => {
    if (!phone) return "";
    return phone.replace(/\D/g, "");
  };
  
  // Add a console log to help debug phone number matching
  const productPhone = normalizePhone(product.contact_phone);
  const currentUserPhone = normalizePhone(userPhone);
  
  console.log("Product phone (normalized):", productPhone);
  console.log("User phone (normalized):", currentUserPhone);
  console.log("Is match:", productPhone === currentUserPhone);
  
  // Check if the current user is the owner of this product
  const isUserProduct = userPhone && 
    normalizePhone(product.contact_phone) === normalizePhone(userPhone);
  
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
      
      // Refresh the page to show updated list
      window.location.reload();
      
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao excluir produto");
    } finally {
      setIsDeleting(false);
    }
  };
  
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
          <p className="font-bold text-xl text-agro-green-700 mb-auto">
            {formatCurrency(product.price)}
          </p>
          
          <div className="mt-2">
            <div className="flex items-center text-gray-500 text-xs mb-2">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{product.location}</span>
            </div>
            
            <div className="space-y-2">
              {/* Always show the Contact Seller button for non-owner */}
              {!isUserProduct && (
                <Button 
                  onClick={onContact}
                  className="w-full gap-1 bg-green-600 hover:bg-green-700 text-sm h-12"
                >
                  <MessageCircle className="h-4 w-4" />
                  Falar com Vendedor
                </Button>
              )}
              
              {/* Only show Edit and Delete buttons if user is the product owner */}
              {isUserProduct && (
                <>
                  <Link to={`/edit-marketplace-product/${product.id}`} className="w-full">
                    <Button 
                      variant="outline"
                      className="w-full gap-1 border-green-600 text-green-700 hover:bg-green-50 text-sm h-10"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Editar
                    </Button>
                  </Link>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline"
                        className="w-full gap-1 border-red-600 text-red-700 hover:bg-red-50 text-sm h-10"
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {isDeleting ? "Excluindo..." : "Excluir"}
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
