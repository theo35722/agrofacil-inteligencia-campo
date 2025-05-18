
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
                    // Display the date from the ISO string without timezone shifting
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
                    // Use a time at noon to avoid any timezone-related date shifts
                    const d = new Date(date);
                    d.setHours(12, 0, 0, 0);
                    
                    // Format with yyyy-MM-dd to ensure consistent date representation
                    const formattedDate = format(d, "yyyy-MM-dd");
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
