
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Leaf, MessageCircle, Sprout } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-agro-green-100 to-agro-green-50 flex flex-col items-center justify-center px-4 py-8 md:py-12 animate-fade-in">
      <div className="flex flex-col items-center mb-6">
        <div className="p-4 bg-agro-green-600 rounded-full mb-4">
          <Sprout size={isMobile ? 48 : 64} className="text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-agro-green-800 text-center">
          AgroFácil
        </h1>
        <p className="text-base md:text-lg text-agro-green-700 text-center max-w-md mt-3 px-4">
          Tecnologia simples para o campo inteligente. Organize, analise e
          gerencie sua lavoura com eficiência.
        </p>
      </div>
      
      <Button asChild className="mb-8 px-6 py-3 text-lg bg-agro-green-600 hover:bg-agro-green-700 shadow-md">
        <Link to="/dashboard">Começar agora</Link>
      </Button>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-4xl px-3">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-agro-green-200">
          <CardContent className="p-5 flex flex-col items-center">
            <Sparkles className="text-agro-green-600 mb-3" size={isMobile ? 28 : 32} />
            <h2 className="text-lg md:text-xl font-semibold text-agro-green-800 mb-2">
              Inteligência Agrícola
            </h2>
            <p className="text-sm text-gray-600 text-center">
              Recursos inteligentes para otimizar sua produção agrícola.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-agro-green-200">
          <CardContent className="p-5 flex flex-col items-center">
            <Leaf className="text-agro-green-600 mb-3" size={isMobile ? 28 : 32} />
            <h2 className="text-lg md:text-xl font-semibold text-agro-green-800 mb-2">
              Análise de Plantas
            </h2>
            <p className="text-sm text-gray-600 text-center">
              Use IA para identificar pragas, doenças e carências nas culturas.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-agro-green-200 sm:col-span-2 md:col-span-1">
          <CardContent className="p-5 flex flex-col items-center">
            <MessageCircle className="text-agro-green-600 mb-3" size={isMobile ? 28 : 32} />
            <h2 className="text-lg md:text-xl font-semibold text-agro-green-800 mb-2">
              Relatórios
            </h2>
            <p className="text-sm text-gray-600 text-center">
              Gere relatórios simples e claros com base nas suas atividades.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
