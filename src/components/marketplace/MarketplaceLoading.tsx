
import { Loader2 } from "lucide-react";

export const MarketplaceLoading = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 text-agro-green-600 animate-spin" />
      <span className="ml-2 text-agro-green-600">Carregando produtos...</span>
    </div>
  );
};
