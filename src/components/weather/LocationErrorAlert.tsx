
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface LocationErrorAlertProps {
  error: string;
  permissionDenied?: boolean;
  onRetry: () => void;
}

export const LocationErrorAlert: React.FC<LocationErrorAlertProps> = ({ 
  error, 
  permissionDenied, 
  onRetry 
}) => {
  return (
    <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
      <AlertDescription>
        {error}
        {permissionDenied && (
          <div className="mt-2">
            <p>Para obter previsões mais precisas, precisamos da sua localização.</p>
            <p className="mt-1 text-sm">Para habilitar:</p>
            <ul className="list-disc pl-5 text-sm mt-1">
              <li>Clique no ícone de cadeado na barra de endereço</li>
              <li>Selecione "Permissões do site"</li>
              <li>Ative a permissão de "Localização"</li>
            </ul>
            <Button 
              onClick={onRetry}
              size="sm"
              className="mt-2 bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Tentar novamente
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};
