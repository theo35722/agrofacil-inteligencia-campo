
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
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

interface DeleteAllListingsDialogProps {
  userId: string;
  onSuccess: () => void;
}

export const DeleteAllListingsDialog = ({ userId, onSuccess }: DeleteAllListingsDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAllListings = async () => {
    try {
      setIsDeleting(true);
      
      // Delete all marketplace products for this user
      const { error } = await supabase
        .from('marketplace_products')
        .delete()
        .eq('user_id', userId);
        
      if (error) {
        throw new Error(`Erro ao excluir anúncios: ${error.message}`);
      }
      
      toast.success("Todos os anúncios foram excluídos com sucesso!");
      onSuccess();
    } catch (error) {
      console.error("Erro ao excluir todos os anúncios:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao excluir anúncios");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline"
          className="border-red-600 text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir Todos os Anúncios
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir todos os anúncios?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação irá excluir permanentemente todos os seus anúncios. Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteAllListings}
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Sim, excluir todos"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
