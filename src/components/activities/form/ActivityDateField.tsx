
import { CalendarIcon } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { ActivityFormValues } from "@/hooks/use-activity-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

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
        <FormItem className="space-y-1">
          <FormLabel className={`${isMobile ? 'text-base' : ''} font-medium`}>Data *</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full flex justify-start text-left font-normal",
                    isMobile ? "h-11 text-base py-2" : "h-10",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    // Garantindo que exibimos a data exatamente como selecionada
                    format(parseISO(field.value), "dd/MM/yyyy")
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? parseISO(field.value) : undefined}
                onSelect={(date) => {
                  if (date) {
                    // Cria uma nova data com o mesmo dia, mês e ano, mas sem alteração de fuso horário
                    const year = date.getFullYear();
                    const month = date.getMonth();
                    const day = date.getDate();
                    
                    // Cria uma nova data usando componentes específicos para evitar deslocamentos
                    const safeDate = new Date(year, month, day, 12, 0, 0, 0);
                    
                    // Formata para uma string ISO, mas mantendo apenas a parte da data
                    const formattedDate = format(safeDate, "yyyy-MM-dd");
                    
                    console.log("Data selecionada:", {
                      original: date,
                      formatted: formattedDate,
                      safe: safeDate
                    });
                    
                    field.onChange(formattedDate);
                  }
                }}
                initialFocus
                className="p-2 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <FormMessage className={isMobile ? "text-sm" : ""} />
        </FormItem>
      )}
    />
  );
}
