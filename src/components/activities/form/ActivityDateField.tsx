
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { ActivityFormValues } from "@/hooks/use-activity-form";

interface ActivityDateFieldProps {
  control: Control<ActivityFormValues>;
}

export function ActivityDateField({ control }: ActivityDateFieldProps) {
  return (
    <FormField
      control={control}
      name="dataProgramada"
      rules={{ required: "Data é obrigatória" }}
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <FormLabel className="font-medium">Data *</FormLabel>
          <FormControl>
            <Input 
              type="date"
              className="h-10"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
