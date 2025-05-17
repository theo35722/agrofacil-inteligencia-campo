
import { useState, useEffect } from "react";
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
import { getAtividades } from "@/services/atividadeService";
import { getLavouras } from "@/services/lavouraService";
import { getTalhoes } from "@/services/talhaoService";
import { Atividade, Lavoura, Talhao } from "@/types/agro";
import { useIsMobile } from "@/hooks/use-mobile";
import { Calendar } from "lucide-react";

interface Activity extends Atividade {
  field?: string;
  plot?: string;
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

const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  
  // Fetch actual data instead of using mock data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get real activities from database
        const atividadesData = await getAtividades();
        
        // Get lavouras for the form
        const lavourasData = await getLavouras();
        
        // Create fields array with plots for the form
        const fieldsWithPlots: Field[] = [];
        
        // For each lavoura, get its talhoes
        for (const lavoura of lavourasData) {
          const talhoesData = await getTalhoes(lavoura.id);
          
          fieldsWithPlots.push({
            name: lavoura.nome,
            id: lavoura.id,
            plots: talhoesData.map(talhao => ({
              name: talhao.nome,
              id: talhao.id
            }))
          });
        }
        
        // Process activities to include field and plot names
        const processedActivities = await Promise.all(atividadesData.map(async (activity) => {
          // Get talhao details if available
          let field = "";
          let plot = "";
          
          if (activity.talhao?.id) {
            plot = activity.talhao.nome || "";
            
            // Get lavoura details
            if (activity.talhao.lavoura_id) {
              const lavoura = lavourasData.find(l => l.id === activity.talhao?.lavoura_id);
              field = lavoura?.nome || "";
            }
          }
          
          return {
            ...activity,
            field,
            plot
          };
        }));
        
        setActivities(processedActivities);
        setFields(fieldsWithPlots);
      } catch (error) {
        console.error("Erro ao carregar atividades:", error);
        toast.error("Não foi possível carregar as atividades");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Form states
  const [newActivityDate, setNewActivityDate] = useState("");
  const [newActivityType, setNewActivityType] = useState("");
  const [newActivityField, setNewActivityField] = useState("");
  const [newActivityPlot, setNewActivityPlot] = useState("");
  const [newActivityNotes, setNewActivityNotes] = useState("");
  const [newActivityStatus, setNewActivityStatus] = useState("pendente");
  
  // Filter
  const [activeTab, setActiveTab] = useState("all");
  
  const handleAddActivity = () => {
    if (!newActivityDate || !newActivityType || !newActivityField || !newActivityPlot) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    // This would be replaced with actual API call
    toast.success("Atividade adicionada com sucesso!");
    
    // Reset form
    setNewActivityDate("");
    setNewActivityType("");
    setNewActivityField("");
    setNewActivityPlot("");
    setNewActivityNotes("");
    setNewActivityStatus("pendente");
    
    // Reload page to show new activity
    window.location.reload();
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
    if (status === "concluído") return "bg-green-500 hover:bg-green-600";
    if (status === "pendente") return "bg-orange-500 hover:bg-orange-600";
    return "bg-blue-400 hover:bg-blue-500";
  };
  
  // Get selected field's plots
  const selectedFieldPlots = fields.find(f => f.id === newActivityField)?.plots || [];
  
  return (
    <div className="space-y-4 animate-fade-in pb-16">
      <div className={`flex ${isMobile ? 'flex-col' : 'justify-between'} items-start md:items-center gap-2 md:gap-0`}>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-green-800 mb-1">
            Registro de Atividades
          </h1>
          <p className="text-sm text-gray-600">
            Gerencie as atividades da sua lavoura
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600 w-full md:w-auto mt-2 md:mt-0">
              <Plus className="h-4 w-4 mr-2" /> Nova Atividade
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-auto">
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
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="activity-plot">Talhão *</Label>
                <Select 
                  onValueChange={setNewActivityPlot}
                  disabled={!newActivityField || selectedFieldPlots.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o talhão" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedFieldPlots.map((plot) => (
                      <SelectItem key={plot.id} value={plot.id}>
                        {plot.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {newActivityField && selectedFieldPlots.length === 0 && (
                  <p className="text-orange-500 text-xs mt-1">
                    Esta lavoura não tem talhões cadastrados
                  </p>
                )}
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
                className="w-full mt-4 bg-green-500 hover:bg-green-600"
                onClick={handleAddActivity}
                disabled={fields.length === 0}
              >
                Adicionar Atividade
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader className={`pb-2 ${isMobile ? 'px-3 pt-3' : ''}`}>
          <CardTitle className="flex justify-between items-center text-lg md:text-xl">
            <div className="flex items-center">
              <CalendarCheck className="h-5 w-5 mr-2 text-green-600" />
              <span className="text-green-800">Atividades</span>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-500">
              <Filter className="h-4 w-4 mr-1" />
              Filtrar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className={isMobile ? 'px-3 py-2' : ''}>
          <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 w-full grid grid-cols-4 h-auto">
              <TabsTrigger value="all" className="text-xs md:text-sm py-1">Todas</TabsTrigger>
              <TabsTrigger value="pendente" className="text-xs md:text-sm py-1">Pendentes</TabsTrigger>
              <TabsTrigger value="concluído" className="text-xs md:text-sm py-1">Concluídas</TabsTrigger>
              <TabsTrigger value="planejado" className="text-xs md:text-sm py-1">Planejadas</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {loading ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">Carregando atividades...</p>
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">
                    Nenhuma atividade {activeTab !== "all" ? `${activeTab}` : ""} registrada.
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Adicione uma atividade para iniciar o controle da sua lavoura.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredActivities.map((activity) => (
                    <div 
                      key={activity.id}
                      className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{activity.tipo}</h4>
                            <Badge className={getStatusColor(activity.status)}>
                              {activity.status}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.field ? `${activity.field} - ${activity.plot}` : activity.plot}
                          </p>
                          
                          {activity.descricao && (
                            <p className="text-sm text-gray-500 mt-2">
                              {activity.descricao}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-sm text-green-600 font-medium flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {activity.data_programada ? formatDate(activity.data_programada) : ""}
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
