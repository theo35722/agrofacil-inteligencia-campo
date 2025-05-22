
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type Activity = {
  id: string;
  tipo: string;
  descricao: string | null;
  data_programada: string;
  status: string;
  talhao_id: string;
};

export const UserActivities = () => {
  const { profile } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchActivities = async () => {
      if (!profile?.id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('atividades')
          .select('*')
          .eq('user_id', profile.id)
          .order('data_programada', { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        setActivities(data || []);
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, [profile?.id]);
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'concluída':
      case 'concluida':
        return 'bg-green-100 text-green-800';
      case 'em andamento':
        return 'bg-blue-100 text-blue-800';
      case 'atrasada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="py-4 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="border border-gray-100 rounded-md p-3 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{activity.tipo}</h3>
                    {activity.descricao && (
                      <p className="text-sm text-gray-600 mt-1">{activity.descricao}</p>
                    )}
                    
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>{formatDate(activity.data_programada)}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center border border-dashed border-gray-200 rounded-md">
            <p className="text-gray-500">Você ainda não adicionou atividades.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
