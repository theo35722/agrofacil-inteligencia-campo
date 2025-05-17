
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Talhao, Lavoura } from "@/types/agro";
import { Loader2, AlertCircle } from "lucide-react";

interface LavourasSectionProps {
  loading: boolean;
  error: string | null;
  talhoes: Talhao[];
  lavouras: Lavoura[];
}

export const LavouraSection: React.FC<LavourasSectionProps> = ({
  loading,
  error,
  talhoes,
  lavouras,
}) => {
  // Função para determinar a cor da badge baseada na fase
  const getPhaseColor = (phase: string) => {
    switch (phase?.toLowerCase()) {
      case "crescimento":
        return "bg-green-100 text-green-800 border-green-200";
      case "emergência":
      case "emergencia":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "florescimento":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "colheita":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  console.log("LavouraSection recebeu:", { loading, talhoes, lavouras });

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
        <p>Carregando lavouras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center border border-red-200 bg-red-50">
        <div className="flex justify-center mb-2">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="bg-green-500 hover:bg-green-600"
        >
          Tentar Novamente
        </Button>
      </Card>
    );
  }

  if (talhoes && talhoes.length > 0) {
    return (
      <>
        <div className="grid grid-cols-2 gap-3">
          {talhoes.slice(0, 4).map(talhao => (
            <Link key={talhao.id} to="/lavouras">
              <Card className="p-3 h-full border border-gray-100 shadow-none bg-green-50 rounded-lg hover:shadow-sm transition-all">
                <h3 className="font-semibold">{talhao.nome || "Talhão sem nome"}</h3>
                <div className="text-green-600 font-medium">{talhao.cultura || "Sem cultura"}</div>
                <div className="text-sm mt-1">
                  Fase: <Badge variant="outline" className={`ml-1 border ${getPhaseColor(talhao.fase)}`}>
                    {talhao.fase || "Não definida"}
                  </Badge>
                </div>
                {talhao.status && (
                  <div className="text-xs text-gray-500 mt-1">
                    {talhao.status}
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
        {talhoes.length > 4 && (
          <div className="mt-3 text-right">
            <Link 
              to="/lavouras"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Ver todas ({talhoes.length}) &rarr;
            </Link>
          </div>
        )}
      </>
    );
  } 
  
  if (lavouras && lavouras.length > 0) {
    return (
      <Card className="p-6 text-center border border-dashed border-gray-300 bg-white">
        <p className="text-gray-600 mb-4">Você tem {lavouras.length} lavoura{lavouras.length > 1 ? 's' : ''}, mas ainda não cadastrou nenhum talhão.</p>
        <Link to="/lavouras">
          <Button className="bg-green-500 hover:bg-green-600">
            Gerenciar Lavouras
          </Button>
        </Link>
      </Card>
    );
  }
  
  return (
    <Card className="p-6 text-center border border-dashed border-gray-300 bg-white">
      <p className="text-gray-600 mb-4">Nenhuma lavoura cadastrada. Adicione sua primeira lavoura!</p>
      <Link to="/lavouras/nova">
        <Button className="bg-green-500 hover:bg-green-600">
          Adicionar Lavoura
        </Button>
      </Link>
    </Card>
  );
};
