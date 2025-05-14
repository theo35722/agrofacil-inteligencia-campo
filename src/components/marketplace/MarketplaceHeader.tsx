import { ShoppingBag } from "lucide-react";
interface MarketplaceHeaderProps {
  isLoading?: boolean;
}
export const MarketplaceHeader = ({
  isLoading = false
}: MarketplaceHeaderProps) => {
  return <div className="flex flex-col items-center text-center mb-6">
      
      
      
      
      <p className="text-gray-600 text-lg mb-6 max-w-sm px-4">
        Compre e venda produtos agrícolas na sua região.
      </p>
    </div>;
};