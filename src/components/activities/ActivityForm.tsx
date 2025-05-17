
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Field, useActivityForm } from "@/hooks/use-activity-form";
import { ActivityFormFields } from "./form/ActivityFormFields";
import { ActivityFormActions } from "./form/ActivityFormActions";

interface ActivityFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: Field[];
  onSuccess: () => Promise<void>;
}

export function ActivityForm({ open, onOpenChange, fields, onSuccess }: ActivityFormProps) {
  const {
    form,
    isSubmitting,
    watchedLavouraId,
    setValue,
    handleAddActivity
  } = useActivityForm(onOpenChange, onSuccess);
  
  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] max-w-md mx-auto p-4 sm:p-6 rounded-lg">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl text-center sm:text-left">Adicionar Nova Atividade</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Preencha os campos para adicionar uma nova atividade à sua lavoura
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddActivity)} className="space-y-4 py-2">
            <ActivityFormFields
              control={form.control}
              fields={fields}
              watchedLavouraId={watchedLavouraId}
              setValue={setValue}
            />
            <ActivityFormActions 
              isSubmitting={isSubmitting} 
              disabled={fields.length === 0} 
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
