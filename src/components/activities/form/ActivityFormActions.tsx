
import { Button } from "@/components/ui/button";

interface ActivityFormActionsProps {
  isSubmitting: boolean;
  disabled: boolean;
}

export function ActivityFormActions({ isSubmitting, disabled }: ActivityFormActionsProps) {
  return (
    <Button 
      type="submit"
      className="w-full mt-4 bg-green-500 hover:bg-green-600 h-12 text-base"
      disabled={isSubmitting || disabled}
    >
      {isSubmitting ? "Adicionando..." : "Adicionar Atividade"}
    </Button>
  );
}
