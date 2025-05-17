
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createLavoura } from "@/services/lavouraService";

interface AddFarmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddFarmDialog = ({ open, onOpenChange, onSuccess }: AddFarmDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFarmName, setNewFarmName] = useState("");
  const [newFarmArea, setNewFarmArea] = useState("");
  const [newFarmCulture, setNewFarmCulture] = useState("");
  const [newFarmLocation, setNewFarmLocation] = useState("");
  
  const handleAddFarm = async () => {
    if (!newFarmName || !newFarmArea || !newFarmLocation) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create the new farm using the service function with the correct type
      await createLavoura({
        nome: newFarmName,
        area_total: parseFloat(newFarmArea),
        localizacao: newFarmLocation,
        unidade_area: "hectares"
      });
      
      toast.success("Lavoura adicionada com sucesso!");
      
      // Reset form
      setNewFarmName("");
      setNewFarmArea("");
      setNewFarmCulture("");
      setNewFarmLocation("");
      onOpenChange(false);
      
      // Reload data to show new farm
      onSuccess();
    } catch (error) {
      console.error("Erro ao adicionar lavoura:", error);
      toast.error("Não foi possível adicionar a lavoura");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Nova Lavoura</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="farm-name">Nome da Lavoura *</Label>
            <Input 
              id="farm-name" 
              value={newFarmName}
              onChange={(e) => setNewFarmName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="farm-area">Área (ha) *</Label>
            <Input 
              id="farm-area" 
              type="number"
              value={newFarmArea}
              onChange={(e) => setNewFarmArea(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="farm-culture">Culturas</Label>
            <Input 
              id="farm-culture" 
              placeholder="Ex: Soja, Milho, Algodão"
              value={newFarmCulture}
              onChange={(e) => setNewFarmCulture(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="farm-location">Localização *</Label>
            <Input 
              id="farm-location" 
              placeholder="Ex: Município, Estado"
              value={newFarmLocation}
              onChange={(e) => setNewFarmLocation(e.target.value)}
            />
          </div>
          
          <Button 
            className="w-full mt-4 bg-agro-green-500 hover:bg-agro-green-600"
            onClick={handleAddFarm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adicionando..." : "Adicionar Lavoura"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFarmDialog;
