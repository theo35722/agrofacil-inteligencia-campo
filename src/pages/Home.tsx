
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Leaf, MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-agro-green-100 to-agro-green-50 flex flex-col items-center justify-center px-4 py-12 animate-fade-in">
      <h1 className="text-4xl font-bold text-agro-green-800 text-center mb-4">
        AgroFácil
      </h1>
      <p className="text-lg text-agro-green-700 text-center max-w-md mb-6">
        Tecnologia simples para o campo inteligente. Organize, analise e
        converse com o Seu Zé — seu parceiro digital na lavoura.
      </p>
      <Button asChild className="mb-10 px-6 py-3 text-lg bg-agro-green-600 hover:bg-agro-green-700">
        <Link to="/diagnostico">Começar agora</Link>
      </Button>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-4xl">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-agro-green-200">
          <CardContent className="p-6 flex flex-col items-center">
            <Sparkles className="text-agro-green-600 mb-3" size={32} />
            <h2 className="text-xl font-semibold text-agro-green-800 mb-2">
              Assistente Seu Zé
            </h2>
            <p className="text-sm text-gray-600 text-center">
              Tire dúvidas e receba dicas direto do seu parceiro virtual.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-agro-green-200">
          <CardContent className="p-6 flex flex-col items-center">
            <Leaf className="text-agro-green-600 mb-3" size={32} />
            <h2 className="text-xl font-semibold text-agro-green-800 mb-2">
              Análise de Plantas
            </h2>
            <p className="text-sm text-gray-600 text-center">
              Use IA para identificar pragas, doenças e carências nas culturas.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-agro-green-200">
          <CardContent className="p-6 flex flex-col items-center">
            <MessageCircle className="text-agro-green-600 mb-3" size={32} />
            <h2 className="text-xl font-semibold text-agro-green-800 mb-2">
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
