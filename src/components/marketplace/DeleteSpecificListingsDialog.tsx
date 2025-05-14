
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
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

interface DeleteSpecificListingsDialogProps {
  onSuccess: () => void;
}

export const DeleteSpecificListingsDialog = ({ onSuccess }: DeleteSpecificListingsDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [productTitle, setProductTitle] = useState("");
  const [open, setOpen] = useState(false);

  const handleDeleteSpecificListing = async () => {
    if (!productTitle.trim()) {
      toast.error("Informe o título do anúncio que deseja excluir");
      return;
    }

    try {
      setIsDeleting(true);
      
      // First, try to find the listings that match the title
      const { data: matchingProducts } = await supabase
        .from('marketplace_products')
        .select('*')
        .ilike('title', `%${productTitle.trim()}%`);
        
      if (!matchingProducts || matchingProducts.length === 0) {
        toast.error(`Não foi possível encontrar anúncios com título similar a "${productTitle}"`);
        setIsDeleting(false);
        return;
      }
      
      console.log("Found matching products:", matchingProducts.length, matchingProducts.map(p => p.title));
      
      // Now delete the found listings
      const { data, error } = await supabase
        .from('marketplace_products')
        .delete()
        .ilike('title', `%${productTitle.trim()}%`)
        .select();
        
      if (error) {
        throw new Error(`Erro ao excluir anúncio: ${error.message}`);
      }
      
      if (data && data.length > 0) {
        toast.success(`${data.length} anúncio(s) com título similar a "${productTitle}" foram excluídos!`);
        setProductTitle("");
        setOpen(false);
        onSuccess();
      } else {
        toast.error(`Nenhum anúncio excluído para "${productTitle}"`);
      }
    } catch (error) {
      console.error("Erro ao excluir anúncio específico:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao excluir anúncio");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline"
          className="border-orange-600 text-orange-700 hover:bg-orange-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir Por Título
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir anúncio específico</AlertDialogTitle>
          <AlertDialogDescription>
            Esta opção ajuda a excluir anúncios mesmo que não estejam associados ao seu usuário.
            Digite o título (ou parte dele) do anúncio que deseja excluir.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <Input
            placeholder="Ex: Trator de Esteira"
            value={productTitle}
            onChange={(e) => setProductTitle(e.target.value)}
            className="w-full"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteSpecificListing}
            className="bg-orange-600 hover:bg-orange-700"
            disabled={isDeleting || !productTitle.trim()}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Excluir Anúncio"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
