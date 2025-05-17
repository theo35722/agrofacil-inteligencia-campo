
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Talhao, Lavoura } from "@/types/agro";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface LavourasSectionProps {
  loading: boolean;
  error: string | null;
  talhoes: Talhao[];
  lavouras: Lavoura[];
}

// Mock data for when real data is not available
const mockTalhoes = [
  {
    id: "mock-1-1",
    nome: "Talhão 1",
    cultura: "Soja",
    fase: "Crescimento",
    area: 45,
    status: "Soja variedade Brasmax Desafio",
    lavoura_id: "mock-1"
  },
  {
    id: "mock-1-2",
    nome: "Talhão 2",
    cultura: "Soja",
    fase: "Crescimento",
    area: 50,
    status: "Soja variedade Monsoy 6410",
    lavoura_id: "mock-1"
  },
  {
    id: "mock-1-3",
    nome: "Talhão 3",
    cultura: "Milho",
    fase: "Emergência",
    area: 55,
    status: "Milho 2ª safra",
    lavoura_id: "mock-1"
  }
];

export const LavouraSection: React.FC<LavourasSectionProps> = ({
  loading,
  error,
  talhoes,
  lavouras,
}) => {
  const { profile } = useAuth();

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

  // Use mock data if we're authenticated but have no real data
  const displayTalhoes = (talhoes?.length === 0 && profile) ? mockTalhoes : talhoes;
  
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-3 h-[100px]">
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3 mt-1" />
          </Card>
        ))}
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

  if (displayTalhoes && displayTalhoes.length > 0) {
    return (
      <>
        <div className="grid grid-cols-2 gap-3">
          {displayTalhoes.slice(0, 4).map(talhao => (
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
        {displayTalhoes.length > 4 && (
          <div className="mt-3 text-right">
            <Link 
              to="/lavouras"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Ver todas ({displayTalhoes.length}) &rarr;
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
