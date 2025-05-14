
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
      
      // Call our Edge Function to delete listings by title
      // This bypasses RLS and allows deletion of any listings matching the title
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-marketplace-listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          searchQuery: productTitle.trim()
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `Error: ${response.status}`);
      }
      
      if (result.success && result.count > 0) {
        toast.success(`${result.count} anúncio(s) com título similar a "${productTitle}" foram excluídos!`);
        setProductTitle("");
        setOpen(false);
        onSuccess();
      } else {
        toast.error(`Não foi possível encontrar anúncios com título similar a "${productTitle}"`);
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
