
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { createAtividade } from "@/services/atividadeService";
import { supabase } from "@/integrations/supabase/client";

// Activity form value types
interface ActivityFormValues {
  dataProgramada: string;
  tipo: string;
  lavouraId: string;
  talhaoId: string;
  status: string;
  descricao: string;
}

interface Field {
  name: string;
  id: string;
  plots: {
    name: string;
    id: string;
  }[];
}

const activityTypes = [
  "Plantio",
  "Adubação",
  "Pulverização",
  "Colheita",
  "Preparo de solo",
  "Outro"
];

interface ActivityFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: Field[];
  onSuccess: () => Promise<void>;
}

export function ActivityForm({ open, onOpenChange, fields, onSuccess }: ActivityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state with react-hook-form
  const form = useForm<ActivityFormValues>({
    defaultValues: {
      dataProgramada: "",
      tipo: "",
      lavouraId: "",
      talhaoId: "",
      status: "pendente",
      descricao: ""
    }
  });
  
  const { watch, setValue } = form;
  const watchedLavouraId = watch("lavouraId");
  
  // Get selected field's plots
  const selectedFieldPlots = fields.find(f => f.id === watchedLavouraId)?.plots || [];
  
  // Reset plot selection when field changes
  useEffect(() => {
    setValue("talhaoId", "");
  }, [watchedLavouraId, setValue]);

  const handleAddActivity = async (values: ActivityFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Valores do formulário:", values);
      
      // Get the current user
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        throw new Error("Usuário não autenticado");
      }
      
      // Create the activity
      const newActivity = {
        tipo: values.tipo,
        talhao_id: values.talhaoId,
        data_programada: values.dataProgramada,
        status: values.status,
        descricao: values.descricao || undefined,
        user_id: userId
      };
      
      console.log("Enviando atividade:", newActivity);
      
      // Use the service to create the activity
      await createAtividade(newActivity);
      
      toast.success("Atividade adicionada com sucesso!");
      
      // Reset form and close dialog
      form.reset();
      onOpenChange(false);
      
      // Reload activities
      await onSuccess();
    } catch (error) {
      console.error("Erro ao adicionar atividade:", error);
      toast.error("Erro ao adicionar atividade. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Atividade</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddActivity)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="dataProgramada"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Data *</FormLabel>
                  <FormControl>
                    <Input 
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Tipo de Atividade *</FormLabel>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activityTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lavouraId"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Lavoura *</FormLabel>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a lavoura" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fields.map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fields.length === 0 && (
                    <p className="text-orange-500 text-xs mt-1">
                      Você precisa cadastrar uma lavoura primeiro
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="talhaoId"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Talhão *</FormLabel>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                    disabled={!watchedLavouraId || selectedFieldPlots.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
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
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Status</FormLabel>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="planejado">Planejado</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="concluído">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detalhes da atividade..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit"
              className="w-full mt-4 bg-green-500 hover:bg-green-600"
              disabled={isSubmitting || fields.length === 0}
            >
              {isSubmitting ? "Adicionando..." : "Adicionar Atividade"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
