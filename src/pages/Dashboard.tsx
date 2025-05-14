
import { Sprout, MapPin, FileText, ShoppingBag } from "lucide-react";
import { FeatureCard } from "@/components/dashboard/FeatureCard";
import { WeatherPreview } from "@/components/dashboard/WeatherPreview";
import { ActivityPreview } from "@/components/dashboard/ActivityPreview";
import { ChatButton } from "@/components/chat/ChatButton";
import { ChatDialog } from "@/components/chat/ChatDialog";
import { useState } from "react";

const Dashboard = () => {
  // State para controlar a exibição do chat
  const [showChat, setShowChat] = useState(false);

  // Features reorganizadas para priorizar Diagnóstico e Marketplace
  // Removidos: Previsão do Tempo, Registro de Atividades e Notificações
  const features = [
    {
      icon: Sprout,
      title: "Diagnóstico de Planta",
      description: "Identificação de doenças e pragas com IA",
      to: "/diagnostico",
      bgColor: "bg-agro-green-500",
      textColor: "text-white",
      priority: true,
    },
    {
      icon: ShoppingBag,
      title: "Marketplace",
      description: "Compra e venda de produtos agrícolas",
      to: "/marketplace",
      bgColor: "bg-agro-green-500",
      textColor: "text-white",
      priority: true,
    },
    {
      icon: MapPin,
      title: "Lavouras e Talhões",
      description: "Gerenciamento de áreas de cultivo",
      to: "/lavouras",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
    },
    {
      icon: FileText,
      title: "Boas Práticas",
      description: "Dicas e conhecimentos agrícolas",
      to: "/boas-praticas",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
    },
  ];

  // Handler para abrir/fechar o chat
  const handleToggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <div className="space-y-6 animate-fade-in bg-white">
      <section className="text-center mb-8">
        <h1 className="text-2xl font-bold text-agro-green-800 mb-2">
          Bem-vindo ao AgroFácil
        </h1>
        <p className="text-gray-600">
          Inteligência para sua lavoura
        </p>
      </section>

      <section className="grid grid-cols-2 gap-5 mb-8">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            to={feature.to}
            className={feature.priority ? "col-span-2 md:col-span-1" : ""}
            bgColor={feature.bgColor}
            textColor={feature.textColor}
          />
        ))}
      </section>

      <section className="space-y-4">
        <WeatherPreview />
        <ActivityPreview />
      </section>
      
      {/* Botão de chat flutuante melhorado */}
      <ChatButton onClick={handleToggleChat} isOpen={showChat} className="bg-white shadow-lg border-2 border-agro-green-300" />
      
      {/* Dialog do chat */}
      <ChatDialog open={showChat} onOpenChange={setShowChat} />
    </div>
  );
};

export default Dashboard;
