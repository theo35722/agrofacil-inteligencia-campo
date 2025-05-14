
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { PhoneIcon, PhoneOffIcon } from "lucide-react";

interface PhoneSettingsProps {
  userPhone: string | null;
  setUserPhone: (phone: string | null) => void;
}

export const PhoneSettings = ({
  userPhone,
  setUserPhone
}: PhoneSettingsProps) => {
  const handleSetUserPhone = () => {
    const phoneInput = prompt("Entre com número de telefone (somente números):");
    if (phoneInput) {
      // Normalize phone number (keep only digits)
      const normalizedPhone = phoneInput.replace(/\D/g, "");
      
      if (normalizedPhone.length < 8) {
        toast.error("Telefone inválido. Por favor, inclua o DDD.");
        return;
      }
      
      // Store the normalized phone number
      localStorage.setItem('userPhone', normalizedPhone);
      setUserPhone(normalizedPhone);
      toast.success("Telefone configurado com sucesso!");
      
      // Log the stored phone for debugging
      console.log("Telefone armazenado:", normalizedPhone);
    }
  };

  const handleClearUserPhone = () => {
    localStorage.removeItem('userPhone');
    setUserPhone(null);
    toast.success("Configuração de telefone removida");
  };

  return (
    <div className="flex justify-end mb-4 gap-2">
      {userPhone ? (
        <>
          <div className="flex items-center mr-2 text-sm text-gray-600">
            <PhoneIcon className="h-4 w-4 mr-1" />
            <span>Telefone: {userPhone}</span>
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
          onClick={handleSetUserPhone}
        >
          Configurar Telefone
        </Button>
      )}
    </div>
  );
};
