
import { Field } from "@/hooks/use-activity-form";
import { ActivityDateField } from "./ActivityDateField";
import { ActivityTypeField } from "./ActivityTypeField";
import { ActivityFieldSelection } from "./ActivityFieldSelection";
import { ActivityPlotSelection } from "./ActivityPlotSelection";
import { ActivityStatusField } from "./ActivityStatusField";
import { ActivityDescriptionField } from "./ActivityDescriptionField";
import { Control } from "react-hook-form";
import { ActivityFormValues } from "@/hooks/use-activity-form";

interface ActivityFormFieldsProps {
  control: Control<ActivityFormValues>;
  fields: Field[];
  watchedLavouraId: string;
  setValue: (name: "talhaoId", value: string) => void;
}

export function ActivityFormFields({
  control,
  fields,
  watchedLavouraId,
  setValue
}: ActivityFormFieldsProps) {
  return (
    <div className="space-y-4">
      <ActivityDateField control={control} />
      <ActivityTypeField control={control} />
      <ActivityFieldSelection 
        control={control} 
        fields={fields}
        watchedLavouraId={watchedLavouraId}
        setValue={setValue}
      />
      <ActivityPlotSelection
        control={control}
        fields={fields}
        watchedLavouraId={watchedLavouraId}
      />
      <ActivityStatusField control={control} />
      <ActivityDescriptionField control={control} />
    </div>
  );
}
