
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { ActivityFormValues } from "@/hooks/use-activity-form";

interface ActivityDescriptionFieldProps {
  control: Control<ActivityFormValues>;
}

export function ActivityDescriptionField({ control }: ActivityDescriptionFieldProps) {
  return (
    <FormField
      control={control}
      name="descricao"
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <FormLabel className="font-medium">Observações</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Detalhes da atividade..."
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
