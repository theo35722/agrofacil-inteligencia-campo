
import { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { ActivityFormValues, Field } from "@/hooks/use-activity-form";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
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
        <FormItem className="space-y-1">
          <FormLabel className={`${isMobile ? 'text-base' : ''} font-medium`}>Lavoura *</FormLabel>
          <Select 
            value={field.value} 
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger className={cn("h-11 text-base py-2", !isMobile && "h-10 text-sm")}>
                <SelectValue placeholder="Selecione a lavoura" />
              </SelectTrigger>
            </FormControl>
            <SelectContent align="center" className="bg-white z-50">
              {fields.map((field) => (
                <SelectItem key={field.id} value={field.id} className={isMobile ? "text-base py-2" : ""}>
                  {field.name}
                </SelectItem>
              ))}
              {fields.length === 0 && (
                <div className="px-2 py-4 text-center text-sm">
                  Nenhuma lavoura encontrada
                </div>
              )}
            </SelectContent>
          </Select>
          {fields.length === 0 && (
            <p className="text-orange-500 text-xs mt-1">
              Você precisa cadastrar uma lavoura primeiro
            </p>
          )}
          <FormMessage className={isMobile ? "text-sm" : ""} />
        </FormItem>
      )}
    />
  );
}

// Add this helper function to use cn in this file
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
