
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { PhoneIcon } from "lucide-react";

interface PhoneSettingsProps {
  userPhone: string | null;
  setUserPhone: (phone: string | null) => void;
}

export const PhoneSettings = ({
  userPhone,
  setUserPhone
}: PhoneSettingsProps) => {
  const handleSetUserPhone = () => {
    const phone = prompt("Entre com número de telefone para edição (formato: +5500000000000):");
    if (phone) {
      localStorage.setItem('userPhone', phone);
      setUserPhone(phone);
      toast({
        title: "Telefone configurado",
        description: "Telefone configurado para edição de anúncios",
      });
    }
  };

  const handleClearUserPhone = () => {
    localStorage.removeItem('userPhone');
    setUserPhone(null);
    toast({
      title: "Telefone removido",
      description: "Configuração de telefone removida",
    });
  };

  return (
    <div className="flex justify-end mb-4 gap-2">
      {userPhone ? (
        <>
          <div className="flex items-center mr-2 text-sm text-gray-600">
            <PhoneIcon className="h-4 w-4 mr-1" />
            <span>Telefone configurado: {userPhone}</span>
          </div>
          <Button 
            variant="outline"
            size="sm"
            className="text-red-600 border-red-600 hover:bg-red-50"
            onClick={handleClearUserPhone}
          >
            Remover
          </Button>
        </>
      ) : (
        <Button 
          variant="outline" 
          size="sm"
          className="text-agro-green-600 border-agro-green-600"
          onClick={handleSetUserPhone}
        >
          Configurar Telefone para Edições
        </Button>
      )}
    </div>
  );
};
