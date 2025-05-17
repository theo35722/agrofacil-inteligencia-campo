
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createTalhao } from "@/services/talhaoService";

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

interface AddTalhaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  farmId: string;
  onSuccess: () => void;
}

interface TalhaoFormData {
  nome: string;
  area: string;
  cultura: string;
  fase: string;
  variedade: string;
}

export function AddTalhaoDialog({ open, onOpenChange, farmId, onSuccess }: AddTalhaoDialogProps) {
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

  const handleAddPlot = async () => {
    const formValues = talhaoForm.getValues();
    
    // Valide os campos obrigatórios
    if (!formValues.nome || !formValues.area || !formValues.cultura) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Crie o talhão usando o serviço
      await createTalhao({
        nome: formValues.nome,
        area: parseFloat(formValues.area),
        lavoura_id: farmId,
        cultura: formValues.cultura,
        fase: formValues.fase || undefined,
        variedade: formValues.variedade || undefined,
        unidade_area: "hectares"
      });
      
      toast.success("Talhão adicionado com sucesso!");
      
      // Limpar o formulário
      talhaoForm.reset();
      
      // Feche o diálogo
      onOpenChange(false);
      
      // Notificar o componente pai do sucesso
      onSuccess();
    } catch (error) {
      console.error("Erro ao adicionar talhão:", error);
      toast.error("Não foi possível adicionar o talhão. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Talhão</DialogTitle>
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
            <Label htmlFor="plot-area">Área (ha) *</Label>
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
                <SelectValue placeholder="Selecione a fase (opcional)" />
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
            onClick={handleAddPlot}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adicionando..." : "Adicionar Talhão"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
