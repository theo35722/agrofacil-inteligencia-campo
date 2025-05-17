
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { ActivityFormValues } from "@/hooks/use-activity-form";

export const activityTypes = [
  "Plantio",
  "Adubação",
  "Pulverização",
  "Colheita",
  "Preparo de solo",
  "Outro"
];

interface ActivityTypeFieldProps {
  control: Control<ActivityFormValues>;
}

export function ActivityTypeField({ control }: ActivityTypeFieldProps) {
  return (
    <FormField
      control={control}
      name="tipo"
      rules={{ required: "Tipo de atividade é obrigatório" }}
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <FormLabel className="font-medium">Tipo de Atividade *</FormLabel>
          <Select 
            value={field.value} 
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {activityTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
