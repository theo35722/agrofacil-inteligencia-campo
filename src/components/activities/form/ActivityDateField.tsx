
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { ActivityFormValues } from "@/hooks/use-activity-form";
import { useIsMobile } from "@/hooks/use-mobile";

interface ActivityDateFieldProps {
  control: Control<ActivityFormValues>;
}

export function ActivityDateField({ control }: ActivityDateFieldProps) {
  const isMobile = useIsMobile();
  
  return (
    <FormField
      control={control}
      name="dataProgramada"
      rules={{ required: "Data é obrigatória" }}
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <FormLabel className={`${isMobile ? 'text-base' : ''} font-medium`}>Data *</FormLabel>
          <FormControl>
            <Input 
              type="date"
              className={isMobile ? "h-12 text-base" : "h-10"}
              {...field}
            />
          </FormControl>
          <FormMessage className={isMobile ? "text-sm" : ""} />
        </FormItem>
      )}
    />
  );
}
