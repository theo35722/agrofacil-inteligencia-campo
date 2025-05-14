
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export const NoProductsMessage = () => {
  return (
    <div className="text-center py-12 border rounded-lg bg-gray-50">
      <h3 className="text-xl font-medium text-gray-600">Nenhum produto disponível</h3>
      <p className="text-gray-500 mt-2">Seja o primeiro a anunciar um produto!</p>
      <Link to="/create-marketplace-product" className="mt-4 inline-block">
        <Button className="bg-agro-green-600 hover:bg-agro-green-700 mt-4">
          <PlusCircle className="mr-2 h-4 w-4" />
          Anunciar Produto
        </Button>
      </Link>
    </div>
  );
};
