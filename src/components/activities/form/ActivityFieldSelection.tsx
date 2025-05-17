
import { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { ActivityFormValues, Field } from "@/hooks/use-activity-form";

interface ActivityFieldSelectionProps {
  control: Control<ActivityFormValues>;
  fields: Field[];
  watchedLavouraId: string;
  setValue: (name: "talhaoId", value: string) => void;
}

export function ActivityFieldSelection({ 
  control, 
  fields, 
  watchedLavouraId, 
  setValue 
}: ActivityFieldSelectionProps) {
  // Reset plot selection when field changes
  useEffect(() => {
    setValue("talhaoId", "");
  }, [watchedLavouraId, setValue]);

  return (
    <FormField
      control={control}
      name="lavouraId"
      rules={{ required: "Lavoura é obrigatória" }}
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <FormLabel className="font-medium">Lavoura *</FormLabel>
          <Select 
            value={field.value} 
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione a lavoura" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {fields.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fields.length === 0 && (
            <p className="text-orange-500 text-xs mt-1">
              Você precisa cadastrar uma lavoura primeiro
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
