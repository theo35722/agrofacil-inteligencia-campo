
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { ActivityFormValues } from "@/hooks/use-activity-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ActivityStatusFieldProps {
  control: Control<ActivityFormValues>;
}

export function ActivityStatusField({ control }: ActivityStatusFieldProps) {
  const isMobile = useIsMobile();
  
  return (
    <FormField
      control={control}
      name="status"
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel className={cn(isMobile ? 'text-base' : '', "font-medium")}>Status</FormLabel>
          <Select 
            value={field.value} 
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger className={cn("h-11 text-base py-2", !isMobile && "h-10 text-sm")}>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white z-50">
              <SelectItem value="planejado" className={isMobile ? "text-base py-2" : ""}>Planejado</SelectItem>
              <SelectItem value="pendente" className={isMobile ? "text-base py-2" : ""}>Pendente</SelectItem>
              <SelectItem value="concluído" className={isMobile ? "text-base py-2" : ""}>Concluído</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage className={isMobile ? "text-sm" : ""} />
        </FormItem>
      )}
    />
  );
}
