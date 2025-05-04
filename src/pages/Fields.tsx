
import { useState } from "react";
import { MapPin, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Field {
  id: string;
  name: string;
  area: number;
  culture: string;
  location: string;
  plots: Plot[];
}

interface Plot {
  id: string;
  name: string;
  area: number;
  plantDate?: string;
  notes?: string;
}

const Fields = () => {
  // Mock data for demo
  const [farms, setFarms] = useState<Field[]>([
    {
      id: "1",
      name: "Fazenda São João",
      area: 150,
      culture: "Soja, Milho",
      location: "Sorriso, MT",
      plots: [
        {
          id: "1-1",
          name: "Talhão 1",
          area: 45,
          plantDate: "10/11/2024",
          notes: "Soja variedade Brasmax Desafio"
        },
        {
          id: "1-2",
          name: "Talhão 2",
          area: 50,
          plantDate: "15/11/2024",
          notes: "Soja variedade Monsoy 6410"
        },
        {
          id: "1-3",
          name: "Talhão 3",
          area: 55,
          plantDate: "01/03/2025",
          notes: "Milho 2ª safra"
        }
      ]
    }
  ]);
  
  const [expandedFarm, setExpandedFarm] = useState<string | null>("1");
  const [newFarmName, setNewFarmName] = useState("");
  const [newFarmArea, setNewFarmArea] = useState("");
  const [newFarmCulture, setNewFarmCulture] = useState("");
  const [newFarmLocation, setNewFarmLocation] = useState("");
  
  const [newPlotName, setNewPlotName] = useState("");
  const [newPlotArea, setNewPlotArea] = useState("");
  const [currentFarmId, setCurrentFarmId] = useState<string | null>(null);
  
  const toggleFarmExpand = (farmId: string) => {
    setExpandedFarm(expandedFarm === farmId ? null : farmId);
  };
  
  const handleAddFarm = () => {
    if (!newFarmName || !newFarmArea || !newFarmLocation) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    const newFarm: Field = {
      id: Date.now().toString(),
      name: newFarmName,
      area: parseFloat(newFarmArea),
      culture: newFarmCulture,
      location: newFarmLocation,
      plots: []
    };
    
    setFarms([...farms, newFarm]);
    setNewFarmName("");
    setNewFarmArea("");
    setNewFarmCulture("");
    setNewFarmLocation("");
    toast.success("Lavoura adicionada com sucesso!");
  };
  
  const handleAddPlot = () => {
    if (!newPlotName || !newPlotArea || !currentFarmId) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    const updatedFarms = farms.map(farm => {
      if (farm.id === currentFarmId) {
        const newPlot: Plot = {
          id: `${farm.id}-${farm.plots.length + 1}`,
          name: newPlotName,
          area: parseFloat(newPlotArea)
        };
        return {
          ...farm,
          plots: [...farm.plots, newPlot]
        };
      }
      return farm;
    });
    
    setFarms(updatedFarms);
    setNewPlotName("");
    setNewPlotArea("");
    toast.success("Talhão adicionado com sucesso!");
  };
  
  const openAddPlotDialog = (farmId: string) => {
    setCurrentFarmId(farmId);
    setNewPlotName("");
    setNewPlotArea("");
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-agro-green-800 mb-2">
            Lavouras e Talhões
          </h1>
          <p className="text-gray-600">
            Gerencie suas áreas de cultivo
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-agro-green-500 hover:bg-agro-green-600">
              <Plus className="h-4 w-4 mr-2" /> Nova Lavoura
            </Button>
          </DialogTrigger>
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
              >
                Adicionar Lavoura
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        {farms.length === 0 ? (
          <Card className="agro-card">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500">Você ainda não possui lavouras cadastradas</p>
              <p className="text-gray-500 text-sm mt-1">
                Clique no botão "Nova Lavoura" para começar
              </p>
            </CardContent>
          </Card>
        ) : (
          farms.map((farm) => (
            <Card key={farm.id} className="agro-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-agro-earth-600" />
                    <span className="text-agro-green-800">{farm.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleFarmExpand(farm.id)}
                  >
                    {expandedFarm === farm.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Área:</span>
                    <p className="font-medium">{farm.area} ha</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Culturas:</span>
                    <p className="font-medium">{farm.culture || "-"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Localização:</span>
                    <p className="font-medium">{farm.location}</p>
                  </div>
                </div>
                
                {expandedFarm === farm.id && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-agro-green-700">Talhões</h4>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs border-agro-green-300 text-agro-green-700 hover:bg-agro-green-50"
                            onClick={() => openAddPlotDialog(farm.id)}
                          >
                            <Plus className="h-3 w-3 mr-1" /> 
                            Adicionar Talhão
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Adicionar Novo Talhão</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="plot-name">Nome do Talhão *</Label>
                              <Input 
                                id="plot-name" 
                                value={newPlotName}
                                onChange={(e) => setNewPlotName(e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="plot-area">Área (ha) *</Label>
                              <Input 
                                id="plot-area" 
                                type="number"
                                value={newPlotArea}
                                onChange={(e) => setNewPlotArea(e.target.value)}
                              />
                            </div>
                            
                            <Button 
                              className="w-full mt-4 bg-agro-green-500 hover:bg-agro-green-600"
                              onClick={handleAddPlot}
                            >
                              Adicionar Talhão
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    {farm.plots.length === 0 ? (
                      <p className="text-gray-500 text-sm">
                        Não há talhões cadastrados para esta lavoura
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {farm.plots.map((plot) => (
                          <div 
                            key={plot.id} 
                            className="p-3 bg-agro-earth-50 border border-agro-earth-100 rounded-md"
                          >
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium text-agro-earth-800">
                                {plot.name}
                              </h5>
                              <span className="text-sm text-agro-earth-600">
                                {plot.area} ha
                              </span>
                            </div>
                            
                            {(plot.plantDate || plot.notes) && (
                              <div className="mt-2 text-sm text-gray-600">
                                {plot.plantDate && (
                                  <p>Plantio: {plot.plantDate}</p>
                                )}
                                {plot.notes && (
                                  <p className="truncate">{plot.notes}</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Fields;
