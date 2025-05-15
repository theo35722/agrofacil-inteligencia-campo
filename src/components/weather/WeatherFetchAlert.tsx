
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WeatherFetchAlertProps {
  error: string;
}

export const WeatherFetchAlert: React.FC<WeatherFetchAlertProps> = ({ error }) => {
  return (
    <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-800">
      <AlertDescription>
        {error}
        <p className="mt-1">Estamos usando suas coordenadas para gerar a previsão.</p>
      </AlertDescription>
    </Alert>
  );
};
