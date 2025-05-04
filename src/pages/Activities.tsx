
import { useState } from "react";
import { CalendarCheck, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Activity {
  id: string;
  date: string;
  type: string;
  field: string;
  plot: string;
  notes?: string;
  status: "concluído" | "pendente" | "planejado";
}

const activityTypes = [
  "Plantio",
  "Adubação",
  "Pulverização",
  "Colheita",
  "Preparo de solo",
  "Outro"
];

const Activities = () => {
  // Mock data for demo
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      date: "2025-05-10",
      type: "Plantio",
      field: "Fazenda São João",
      plot: "Talhão 1",
      notes: "Plantio de soja - Variedade Brasmax Desafio",
      status: "concluído"
    },
    {
      id: "2",
      date: "2025-05-16",
      type: "Pulverização",
      field: "Fazenda São João",
      plot: "Talhão 2",
      notes: "Aplicação de fungicida preventivo",
      status: "pendente"
    },
    {
      id: "3",
      date: "2025-05-20",
      type: "Adubação",
      field: "Fazenda São João",
      plot: "Talhão 3",
      notes: "Adubação de cobertura - 200kg/ha",
      status: "planejado"
    }
  ]);
  
  // Form states
  const [newActivityDate, setNewActivityDate] = useState("");
  const [newActivityType, setNewActivityType] = useState("");
  const [newActivityField, setNewActivityField] = useState("");
  const [newActivityPlot, setNewActivityPlot] = useState("");
  const [newActivityNotes, setNewActivityNotes] = useState("");
  const [newActivityStatus, setNewActivityStatus] = useState("pendente");
  
  // Filter
  const [activeTab, setActiveTab] = useState("all");
  
  // Mock data for fields and plots
  const fields = [
    {
      name: "Fazenda São João",
      plots: ["Talhão 1", "Talhão 2", "Talhão 3"]
    }
  ];
  
  const handleAddActivity = () => {
    if (!newActivityDate || !newActivityType || !newActivityField || !newActivityPlot) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    const newActivity: Activity = {
      id: Date.now().toString(),
      date: newActivityDate,
      type: newActivityType,
      field: newActivityField,
      plot: newActivityPlot,
      notes: newActivityNotes,
      status: newActivityStatus as "concluído" | "pendente" | "planejado"
    };
    
    setActivities([...activities, newActivity]);
    
    // Reset form
    setNewActivityDate("");
    setNewActivityType("");
    setNewActivityField("");
    setNewActivityPlot("");
    setNewActivityNotes("");
    setNewActivityStatus("pendente");
    
    toast.success("Atividade adicionada com sucesso!");
  };
  
  const filteredActivities = activities.filter(activity => {
    if (activeTab === "all") return true;
    return activity.status === activeTab;
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const getStatusColor = (status: string) => {
    if (status === "concluído") return "bg-agro-green-500 hover:bg-agro-green-600";
    if (status === "pendente") return "bg-orange-500 hover:bg-orange-600";
    return "bg-agro-blue-400 hover:bg-agro-blue-500";
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-agro-green-800 mb-2">
            Registro de Atividades
          </h1>
          <p className="text-gray-600">
            Gerencie as atividades da sua lavoura
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-agro-green-500 hover:bg-agro-green-600">
              <Plus className="h-4 w-4 mr-2" /> Nova Atividade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Atividade</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="activity-date">Data *</Label>
                <Input 
                  id="activity-date" 
                  type="date"
                  value={newActivityDate}
                  onChange={(e) => setNewActivityDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="activity-type">Tipo de Atividade *</Label>
                <Select onValueChange={setNewActivityType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="activity-field">Lavoura *</Label>
                <Select onValueChange={setNewActivityField}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a lavoura" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((field) => (
                      <SelectItem key={field.name} value={field.name}>
                        {field.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="activity-plot">Talhão *</Label>
                <Select 
                  onValueChange={setNewActivityPlot}
                  disabled={!newActivityField}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o talhão" />
                  </SelectTrigger>
                  <SelectContent>
                    {newActivityField && 
                      fields.find(f => f.name === newActivityField)?.plots.map((plot) => (
                        <SelectItem key={plot} value={plot}>
                          {plot}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="activity-status">Status</Label>
                <Select 
                  defaultValue="pendente"
                  onValueChange={setNewActivityStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planejado">Planejado</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="concluído">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="activity-notes">Observações</Label>
                <Textarea 
                  id="activity-notes" 
                  placeholder="Detalhes da atividade..."
                  value={newActivityNotes}
                  onChange={(e) => setNewActivityNotes(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full mt-4 bg-agro-green-500 hover:bg-agro-green-600"
                onClick={handleAddActivity}
              >
                Adicionar Atividade
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="agro-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center">
              <CalendarCheck className="h-5 w-5 mr-2 text-agro-green-600" />
              <span className="text-agro-green-800">Atividades</span>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-500">
              <Filter className="h-4 w-4 mr-1" />
              Filtrar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="pendente">Pendentes</TabsTrigger>
              <TabsTrigger value="concluído">Concluídas</TabsTrigger>
              <TabsTrigger value="planejado">Planejadas</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {filteredActivities.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">
                    Nenhuma atividade {activeTab !== "all" ? `${activeTab}` : ""} encontrada
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredActivities.map((activity) => (
                    <div 
                      key={activity.id}
                      className="p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{activity.type}</h4>
                            <Badge className={getStatusColor(activity.status)}>
                              {activity.status}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.field} - {activity.plot}
                          </p>
                          
                          {activity.notes && (
                            <p className="text-sm text-gray-500 mt-2">
                              {activity.notes}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-sm text-agro-green-600 font-medium">
                          {formatDate(activity.date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Activities;
