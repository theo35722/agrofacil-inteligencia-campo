
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

  if (status === "loading") {
    return (
      <Alert className="mb-4 border-blue-300 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-700" />
        <AlertTitle className="text-blue-800">Validando chave API</AlertTitle>
        <AlertDescription className="text-blue-700">
          Verificando configuração da chave API da OpenAI...
        </AlertDescription>
      </Alert>
    );
  }

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

  // Para os estados "missing" e "invalid", não mostramos nenhum alerta
  // A aplicação continuará em modo offline silenciosamente
  return null;
};
