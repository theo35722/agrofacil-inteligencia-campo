
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { LocationData } from "@/types/marketplace";

interface NoResultsMessageProps {
  searchQuery: string;
  locationData: LocationData;
}

export const NoResultsMessage = ({ searchQuery, locationData }: NoResultsMessageProps) => {
  return (
    <Alert className="bg-amber-50 border-amber-200 mb-6">
      <AlertCircle className="h-5 w-5 text-amber-600" />
      <AlertTitle className="text-amber-800">Nenhum produto encontrado</AlertTitle>
      <AlertDescription className="text-amber-700">
        Não encontramos produtos correspondentes à sua busca
        {locationData.city || locationData.state ? " na localização selecionada" : ""}.
        {" "}Tente outros termos ou {locationData.city || locationData.state ? "outra localização" : ""}.
      </AlertDescription>
    </Alert>
  );
};
