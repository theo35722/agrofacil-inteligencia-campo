
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface ActivityFormActionsProps {
  isSubmitting: boolean;
  disabled: boolean;
}

export function ActivityFormActions({ isSubmitting, disabled }: ActivityFormActionsProps) {
  const isMobile = useIsMobile();

  return (
    <Button 
      type="submit"
      className={`w-full mt-4 bg-green-500 hover:bg-green-600 ${isMobile ? 'h-12 text-base' : 'h-10'}`}
      disabled={isSubmitting || disabled}
    >
      {isSubmitting ? "Adicionando..." : "Adicionar Atividade"}
    </Button>
  );
}
