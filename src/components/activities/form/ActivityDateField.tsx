
import { CalendarIcon } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { ActivityFormValues } from "@/hooks/use-activity-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full flex justify-start text-left font-normal",
                    isMobile ? "h-12 text-base" : "h-10",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    format(new Date(field.value), "dd/MM/yyyy")
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  if (date) {
                    // Format the date as YYYY-MM-DD for the form value
                    field.onChange(format(date, "yyyy-MM-dd"));
                  }
                }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <FormMessage className={isMobile ? "text-sm" : ""} />
        </FormItem>
      )}
    />
  );
}
