
import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ApiKeyValidatorProps {
  onValidationComplete?: (isValid: boolean) => void;
}

export const ApiKeyValidator: React.FC<ApiKeyValidatorProps> = ({ 
  onValidationComplete 
}) => {
  const [status, setStatus] = useState<"loading" | "valid" | "invalid" | "missing">("loading");

  useEffect(() => {
    const validateApiKey = async () => {
      try {
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        
        if (!apiKey) {
          console.log("Sistema usando modo offline (sem API key da OpenAI)");
          setStatus("missing");
          if (onValidationComplete) onValidationComplete(false);
          return;
        }

        // Atualizar validação de formato: aceitar tanto sk- quanto sk-proj- e outras variações
        if (!apiKey.startsWith("sk-")) {
          console.warn("Formato de API key inválido");
          setStatus("invalid");
          if (onValidationComplete) onValidationComplete(false);
          return;
        }

        console.log("Chave API validada com sucesso!");
        setStatus("valid");
        if (onValidationComplete) onValidationComplete(true);
      } catch (error) {
        console.error("Erro ao validar API key:", error);
        setStatus("invalid");
        if (onValidationComplete) onValidationComplete(false);
      }
    };

    validateApiKey();
  }, [onValidationComplete]);

  // Apenas exibimos o alerta se a API key for válida
  // Para os estados "missing", "invalid" e "loading", não mostramos nenhum alerta
  if (status === "valid") {
    return (
      <Alert className="mb-4 border-green-300 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-700" />
        <AlertTitle className="text-green-800">Chave API Válida</AlertTitle>
        <AlertDescription className="text-green-700">
          Sua chave API da OpenAI está configurada corretamente e pronta para uso.
        </AlertDescription>
      </Alert>
    );
  }

  // Para os estados "missing", "invalid" e "loading", não mostramos nenhum alerta
  return null;
}
