
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Talhao } from "@/types/agro";
import { updateTalhao } from "@/services/talhaoService";

// Culturas disponíveis
const CULTURAS = [
  "Soja", 
  "Milho", 
  "Capim", 
  "Algodão", 
  "Café", 
  "Cana-de-açúcar", 
  "Outro"
];

// Fases de desenvolvimento
const FASES = [
  "Emergência", 
  "Crescimento", 
  "Formação", 
  "Floração", 
  "Maturação"
];

interface EditTalhaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  talhao: Talhao | null;
  onSuccess: () => void;
}

interface TalhaoFormData {
  nome: string;
  area: string;
  cultura: string;
  fase: string;
  variedade: string;
}

export function EditTalhaoDialog({ open, onOpenChange, talhao, onSuccess }: EditTalhaoDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const talhaoForm = useForm<TalhaoFormData>({
    defaultValues: {
      nome: "",
      area: "",
      cultura: "",
      fase: "",
      variedade: ""
    }
  });

  // Update form values when talhao changes
  useEffect(() => {
    if (talhao && open) {
      talhaoForm.reset({
        nome: talhao.nome || "",
        area: talhao.area?.toString() || "",
        cultura: talhao.cultura || "",
        fase: talhao.fase || "",
        variedade: talhao.variedade || ""
      });
    }
  }, [talhao, open, talhaoForm]);

  const handleUpdatePlot = async () => {
    if (!talhao) return;
    
    const formValues = talhaoForm.getValues();
    
    // Valide os campos obrigatórios
    if (!formValues.nome || !formValues.cultura) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Atualize o talhão usando o serviço
      await updateTalhao(talhao.id, {
        nome: formValues.nome,
        area: formValues.area ? parseFloat(formValues.area) : undefined,
        cultura: formValues.cultura,
        fase: formValues.fase || undefined,
        variedade: formValues.variedade || undefined
      });
      
      toast.success("Talhão atualizado com sucesso!");
      
      // Feche o diálogo
      onOpenChange(false);
      
      // Notificar o componente pai do sucesso
      onSuccess();
    } catch (error) {
      console.error("Erro ao atualizar talhão:", error);
      toast.error("Não foi possível atualizar o talhão. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Talhão</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="plot-name">Nome do Talhão *</Label>
            <Input 
              id="plot-name"
              {...talhaoForm.register("nome")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="plot-area">Área (ha)</Label>
            <Input 
              id="plot-area" 
              type="number"
              {...talhaoForm.register("area")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="plot-cultura">Cultura *</Label>
            <Select 
              onValueChange={(value) => talhaoForm.setValue("cultura", value)}
              value={talhaoForm.watch("cultura")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma cultura" />
              </SelectTrigger>
              <SelectContent>
                {CULTURAS.map((cultura) => (
                  <SelectItem key={cultura} value={cultura}>
                    {cultura}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="plot-fase">Fase de Desenvolvimento</Label>
            <Select 
              onValueChange={(value) => talhaoForm.setValue("fase", value)}
              value={talhaoForm.watch("fase")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a fase" />
              </SelectTrigger>
              <SelectContent>
                {FASES.map((fase) => (
                  <SelectItem key={fase} value={fase}>
                    {fase}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="plot-variedade">Variedade da Cultura</Label>
            <Input 
              id="plot-variedade"
              placeholder="Ex: Brasmax Ativa RR, Capim Mombaça"
              {...talhaoForm.register("variedade")}
            />
          </div>
          
          <Button 
            className="w-full mt-4 bg-agro-green-500 hover:bg-agro-green-600"
            onClick={handleUpdatePlot}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Atualizando..." : "Salvar Alterações"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
