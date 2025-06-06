
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Leaf, MessageCircle, Sprout, Bot } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function Home() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  // Se o usuário estiver autenticado, redirecionar para o dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
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
        <Link to="/auth">Começar agora</Link>
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
      
      {/* Novo card destacando o Seu Calunga */}
      <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-agro-green-200 mt-8 max-w-2xl w-full">
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-agro-green-200">
              <img 
                src="/lovable-uploads/8ac540a4-ed74-4c29-98a2-22f75a415068.png" 
                alt="Seu Calunga" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-agro-green-500 p-1 rounded-full">
              <Bot size={16} className="text-white" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-agro-green-800 mb-2">Conheça o Seu Calunga</h2>
            <p className="text-gray-600">
              Seu assistente virtual do campo! Com conhecimento de agricultura e um jeito caipira de ser,
              ele está sempre pronto para ajudar com suas dúvidas sobre plantações, pragas, clima e 
              muito mais.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
