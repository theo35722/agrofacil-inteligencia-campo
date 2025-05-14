
import { ShoppingBag } from "lucide-react";

interface MyListingsHeaderProps {
  isLoading: boolean;
}

export const MyListingsHeader = ({ isLoading }: MyListingsHeaderProps) => {
  return (
    <div className="bg-white p-6 text-center border-b border-gray-200 mb-4">
      <div className="flex justify-center mb-2">
        <ShoppingBag className="h-12 w-12 text-agro-green-700" />
      </div>
      <h1 className="text-3xl font-bold text-agro-green-800">
        Meus Anúncios
      </h1>
      <p className="text-gray-600 mt-2">
        Gerencie seus produtos no AgroFácil Marketplace
      </p>
    </div>
  );
};
