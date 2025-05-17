
import React from "react";
import { UserProfile } from "@/types/agro";

interface GreetingHeaderProps {
  profile: UserProfile | null;
}

export const GreetingHeader: React.FC<GreetingHeaderProps> = ({ profile }) => {
  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };
  
  const greeting = `${getGreeting()}, ${profile?.nome?.split(' ')[0] || 'Produtor'}!`;

  return (
    <div className="py-4 px-4">
      <h1 className="text-2xl font-bold text-center text-gray-800">{greeting}</h1>
    </div>
  );
};
