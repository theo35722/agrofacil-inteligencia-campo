
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { ActivityFormValues } from "@/hooks/use-activity-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
  const isMobile = useIsMobile();
  
  return (
    <FormField
      control={control}
      name="tipo"
      rules={{ required: "Tipo de atividade é obrigatório" }}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel className={cn(isMobile ? 'text-base' : '', "font-medium")}>Tipo de Atividade *</FormLabel>
          <Select 
            value={field.value} 
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger className={cn("h-11 text-base py-2", !isMobile && "h-10 text-sm")}>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white z-50">
              {activityTypes.map((type) => (
                <SelectItem key={type} value={type} className={isMobile ? "text-base py-2" : ""}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className={isMobile ? "text-sm" : ""} />
        </FormItem>
      )}
    />
  );
}
