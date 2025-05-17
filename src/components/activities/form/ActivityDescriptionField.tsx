
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { ActivityFormValues } from "@/hooks/use-activity-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ActivityDescriptionFieldProps {
  control: Control<ActivityFormValues>;
}

export function ActivityDescriptionField({ control }: ActivityDescriptionFieldProps) {
  const isMobile = useIsMobile();
  
  return (
    <FormField
      control={control}
      name="descricao"
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel className={cn(isMobile ? 'text-base' : '', "font-medium")}>Observações</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Detalhes da atividade..."
              className={cn(
                "resize-none",
                isMobile ? "min-h-[80px] text-base py-2" : ""
              )}
              {...field}
            />
          </FormControl>
          <FormMessage className={isMobile ? "text-sm" : ""} />
        </FormItem>
      )}
    />
  );
}
