
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { ActivityFormValues, Field } from "@/hooks/use-activity-form";

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
  // Get selected field's plots
  const selectedFieldPlots = fields.find(f => f.id === watchedLavouraId)?.plots || [];

  return (
    <FormField
      control={control}
      name="talhaoId"
      rules={{ required: "Talhão é obrigatório" }}
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <FormLabel className="font-medium">Talhão *</FormLabel>
          <Select 
            value={field.value} 
            onValueChange={field.onChange}
            disabled={!watchedLavouraId || selectedFieldPlots.length === 0}
          >
            <FormControl>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione o talhão" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {selectedFieldPlots.map((plot) => (
                <SelectItem key={plot.id} value={plot.id}>
                  {plot.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {watchedLavouraId && selectedFieldPlots.length === 0 && (
            <p className="text-orange-500 text-xs mt-1">
              Esta lavoura não tem talhões cadastrados
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
