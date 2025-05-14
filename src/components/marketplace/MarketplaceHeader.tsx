
import { ShoppingBag } from "lucide-react";

interface MarketplaceHeaderProps {
  isLoading?: boolean;
}

export const MarketplaceHeader = ({ isLoading = false }: MarketplaceHeaderProps) => {
  return (
    <div className="flex flex-col items-center text-center mb-6">
      <div className="bg-agro-green-500 w-full py-8 rounded-b-3xl mb-4">
        <div className="bg-white/20 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-2">
          <ShoppingBag className="h-8 w-8 text-white" strokeWidth={1.5} />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        MARKETPLACE AGROFÁCIL
      </h1>
      
      <p className="text-gray-600 text-lg mb-6 max-w-sm px-4">
        Compre e venda produtos agrícolas na sua região.
      </p>
    </div>
  );
};
