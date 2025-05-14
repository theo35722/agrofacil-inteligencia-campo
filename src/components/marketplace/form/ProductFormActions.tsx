
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductFormActionsProps {
  isSubmitting: boolean;
  onCancel?: () => void;
  submitLabel?: string;
  submittingLabel?: string;
}

export const ProductFormActions = ({ 
  isSubmitting, 
  onCancel,
  submitLabel = "Cadastrar Produto",
  submittingLabel = "Enviando..."
}: ProductFormActionsProps) => {
  const navigate = useNavigate();
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/marketplace');
    }
  };
  
  return (
    <div className="pt-4">
      <Button 
        type="submit" 
        className="w-full bg-agro-green-600 hover:bg-agro-green-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {submittingLabel}
          </>
        ) : (
          submitLabel
        )}
      </Button>
      
      <Button
        type="button"
        variant="outline"
        className="w-full mt-3"
        onClick={handleCancel}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
    </div>
  );
};
