
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { ActivityFormValues, Field } from "@/hooks/use-activity-form";
import { useIsMobile } from "@/hooks/use-mobile";

interface ActivityPlotSelectionProps {
  control: Control<ActivityFormValues>;
  fields: Field[];
  watchedLavouraId: string;
}

export function ActivityPlotSelection({ 
  control,
  fields,
  watchedLavouraId 
}: ActivityPlotSelectionProps) {
  const isMobile = useIsMobile();
  // Get selected field's plots
  const selectedFieldPlots = fields.find(f => f.id === watchedLavouraId)?.plots || [];

  return (
    <FormField
      control={control}
      name="talhaoId"
      rules={{ required: "Talhão é obrigatório" }}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel className={`${isMobile ? 'text-base' : ''} font-medium`}>Talhão *</FormLabel>
          <Select 
            value={field.value} 
            onValueChange={field.onChange}
            disabled={!watchedLavouraId || selectedFieldPlots.length === 0}
          >
            <FormControl>
              <SelectTrigger className={cn("h-11 text-base py-2", !isMobile && "h-10 text-sm")}>
                <SelectValue placeholder="Selecione o talhão" />
              </SelectTrigger>
            </FormControl>
            <SelectContent align="center" className="bg-white z-50">
              {selectedFieldPlots.map((plot) => (
                <SelectItem key={plot.id} value={plot.id} className={isMobile ? "text-base py-2" : ""}>
                  {plot.name}
                </SelectItem>
              ))}
              {selectedFieldPlots.length === 0 && watchedLavouraId && (
                <div className="px-2 py-4 text-center text-sm">
                  Nenhum talhão encontrado para esta lavoura
                </div>
              )}
            </SelectContent>
          </Select>
          {watchedLavouraId && selectedFieldPlots.length === 0 && (
            <p className="text-orange-500 text-xs mt-1">
              Esta lavoura não tem talhões cadastrados
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
