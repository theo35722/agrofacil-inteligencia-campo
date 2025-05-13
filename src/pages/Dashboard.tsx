
import { Sprout, CloudSun, MapPin, CalendarCheck, FileText, Bell, ShoppingBag } from "lucide-react";
import { FeatureCard } from "@/components/dashboard/FeatureCard";
import { WeatherPreview } from "@/components/dashboard/WeatherPreview";
import { ActivityPreview } from "@/components/dashboard/ActivityPreview";
import { ChatButton } from "@/components/chat/ChatButton";
import { ChatDialog } from "@/components/chat/ChatDialog";
import { useState } from "react";

const Dashboard = () => {
  // State para controlar a exibição do chat
  const [showChat, setShowChat] = useState(false);

  // Features for the dashboard
  const features = [
    {
      icon: Sprout,
      title: "Diagnóstico de Planta",
      description: "Identificação de doenças e pragas com IA",
      to: "/diagnostico",
      bgColor: "bg-agro-green-100",
    },
    {
      icon: CloudSun,
      title: "Previsão do Tempo",
      description: "Previsão climática detalhada",
      to: "/clima",
      bgColor: "bg-agro-blue-100",
    },
    {
      icon: MapPin,
      title: "Lavouras e Talhões",
      description: "Gerenciamento de áreas de cultivo",
      to: "/lavouras",
      bgColor: "bg-agro-earth-100",
    },
    {
      icon: CalendarCheck,
      title: "Registro de Atividades",
      description: "Controle de operações agrícolas",
      to: "/atividades",
      bgColor: "bg-amber-100",
    },
    {
      icon: FileText,
      title: "Boas Práticas",
      description: "Dicas e conhecimentos agrícolas",
      to: "/boas-praticas",
      bgColor: "bg-indigo-100",
    },
    {
      icon: ShoppingBag,
      title: "Marketplace",
      description: "Compra e venda de produtos agrícolas",
      to: "/marketplace",
      bgColor: "bg-green-100",
    },
    {
      icon: Bell,
      title: "Notificações",
      description: "Alertas e lembretes importantes",
      to: "/notificacoes",
      bgColor: "bg-rose-100",
    },
  ];

  // Handler para abrir/fechar o chat
  const handleToggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="text-center mb-8">
        <h1 className="text-2xl font-bold text-agro-green-800 mb-2">
          Bem-vindo ao AgroFácil
        </h1>
        <p className="text-gray-600">
          Inteligência para sua lavoura
        </p>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            to={feature.to}
          />
        ))}
      </section>

      <section className="space-y-4">
        <WeatherPreview />
        <ActivityPreview />
      </section>
      
      {/* Botão de chat flutuante */}
      <ChatButton onClick={handleToggleChat} isOpen={showChat} />
      
      {/* Dialog do chat */}
      <ChatDialog open={showChat} onOpenChange={setShowChat} />
    </div>
  );
};

export default Dashboard;
