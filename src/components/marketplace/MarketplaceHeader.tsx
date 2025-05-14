
import { ShoppingBag } from "lucide-react";

interface MarketplaceHeaderProps {
  isLoading: boolean;
}

export const MarketplaceHeader = ({ isLoading }: MarketplaceHeaderProps) => {
  return (
    <section className="text-center mb-6">
      <div className="flex justify-center">
        <div className="bg-agro-green-100 p-3 rounded-full mb-3">
          <ShoppingBag className="h-6 w-6 text-agro-green-600" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-agro-green-800 mb-2">
        Marketplace
        {isLoading && (
          <span className="block text-xl mt-1">Detectando sua localização...</span>
        )}
      </h1>
      <p className="text-gray-600 max-w-lg mx-auto">
        Compre e venda produtos agrícolas diretamente de outros produtores rurais da sua região
      </p>
    </section>
  );
};
