
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const validateApiKey = async () => {
      try {
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        
        if (!apiKey) {
          console.warn("API key não encontrada no arquivo .env");
          setStatus("missing");
          if (onValidationComplete) onValidationComplete(false);
          return;
        }

        // Atualizar validação de formato: aceitar tanto sk- quanto sk-proj- e outras variações
        if (!apiKey.startsWith("sk-")) {
          console.warn("Formato de API key inválido");
          setStatus("invalid");
          setErrorMessage("A chave não está no formato padrão da OpenAI (deve começar com 'sk-')");
          if (onValidationComplete) onValidationComplete(false);
          return;
        }

        // Fazer uma chamada simples para testar a API key
        console.log("Testando conexão com a API da OpenAI...");
        const response = await fetch("https://api.openai.com/v1/models", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${apiKey}`
          }
        });

        const responseData = await response.json();
        
        if (!response.ok) {
          console.error("Erro ao validar chave API:", responseData);
          setStatus("invalid");
          
          // Mensagens de erro mais específicas com base no código de erro
          if (responseData.error?.code === "invalid_api_key") {
            setErrorMessage("Chave API inválida. Verifique se a chave está correta e ativa.");
          } else {
            setErrorMessage(responseData.error?.message || "Erro na validação da chave API");
          }
          
          if (onValidationComplete) onValidationComplete(false);
          return;
        }

        console.log("Chave API validada com sucesso!");
        setStatus("valid");
        if (onValidationComplete) onValidationComplete(true);
      } catch (error) {
        console.error("Erro ao validar API key:", error);
        setStatus("invalid");
        setErrorMessage(error.message || "Erro desconhecido ao validar a chave API");
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

  if (status === "missing") {
    return (
      <Alert className="mb-4 border-amber-300 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-700" />
        <AlertTitle className="text-amber-800">Chave API não encontrada</AlertTitle>
        <AlertDescription className="text-amber-700">
          A variável VITE_OPENAI_API_KEY não foi encontrada no arquivo .env.
          O sistema usará o banco de dados offline para análises.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-red-300 bg-red-50">
      <AlertCircle className="h-4 w-4 text-red-700" />
      <AlertTitle className="text-red-800">Problema com a chave API</AlertTitle>
      <AlertDescription className="text-red-700">
        {errorMessage || "Ocorreu um erro ao validar sua chave API da OpenAI."}
        <div className="mt-2">
          <strong>Dica:</strong> Verifique se a chave começa com "sk-" e tem permissões para acessar a API. 
          Chaves de API OpenAI geralmente são longas e têm o formato "sk-XXXXXXXXXXXXXXXXXXXXXXX".
        </div>
      </AlertDescription>
    </Alert>
  );
};
