
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useState } from "react";

interface PhoneSettingsProps {
  userPhone: string | null;
  setUserPhone: (phone: string | null) => void;
}

export const PhoneSettings = ({ userPhone, setUserPhone }: PhoneSettingsProps) => {
  const [showingPhoneInput, setShowingPhoneInput] = useState(false);

  const handleSetUserPhone = () => {
    const phone = prompt("Entre com número de telefone para edição (formato: +5500000000000):");
    if (phone) {
      localStorage.setItem('userPhone', phone);
      setUserPhone(phone);
      toast.success("Telefone configurado para edição de anúncios");
    }
  };

  return (
    <div className="flex justify-end mb-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleSetUserPhone}
        className="text-xs"
      >
        {userPhone ? "Alterar Telefone" : "Definir Telefone"}
      </Button>
    </div>
  );
};
