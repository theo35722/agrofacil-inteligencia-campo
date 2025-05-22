
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Hash } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Lavoura } from "@/types/agro";

export const UserProperties = () => {
  const { profile } = useAuth();
  const [lavouras, setLavouras] = useState<Lavoura[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLavouras = async () => {
      if (!profile?.id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('lavouras')
          .select('*')
          .eq('user_id', profile.id);
          
        if (error) throw error;
        
        setLavouras(data || []);
      } catch (error) {
        console.error("Erro ao buscar lavouras:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLavouras();
  }, [profile?.id]);
  
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Propriedades</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="py-4 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : lavouras.length > 0 ? (
          <div className="space-y-4">
            {lavouras.map((lavoura) => (
              <div key={lavoura.id} className="border border-gray-100 rounded-md p-3 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{lavoura.nome}</h3>
                    
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span>{lavoura.localizacao || "Sem localização"}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-500">
                      <Hash className="h-3.5 w-3.5 mr-1" />
                      <span>{lavoura.area_total || 0} {lavoura.unidade_area || "hectares"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center border border-dashed border-gray-200 rounded-md">
            <p className="text-gray-500">Nenhuma lavoura cadastrada ainda.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
