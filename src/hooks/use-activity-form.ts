
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createAtividade } from "@/services/atividadeService";
import { supabase } from "@/integrations/supabase/client";

// Form value types
export interface ActivityFormValues {
  dataProgramada: string;
  tipo: string;
  lavouraId: string;
  talhaoId: string;
  status: string;
  descricao: string;
}

export interface Field {
  name: string;
  id: string;
  plots: {
    name: string;
    id: string;
  }[];
}

export function useActivityForm(onOpenChange: (open: boolean) => void, onSuccess: () => Promise<void>) {
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
  
  const handleAddActivity = async (values: ActivityFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Valores do formulário:", values);
      
      // Validate required fields
      if (!values.dataProgramada || !values.tipo || !values.lavouraId || !values.talhaoId) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        setIsSubmitting(false);
        return;
      }
      
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

  return {
    form,
    isSubmitting,
    watchedLavouraId,
    setValue,
    handleAddActivity
  };
}
