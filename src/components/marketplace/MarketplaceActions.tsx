
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingBag } from "lucide-react";

export const MarketplaceActions = () => {
  return (
    <div className="flex flex-col gap-3 mb-4">
      <Link to="/create-marketplace-product">
        <Button className="w-full bg-agro-green-600 hover:bg-agro-green-700 font-medium text-white rounded-full py-6 px-8 flex items-center justify-center gap-2">
          <Plus className="h-5 w-5" />
          Anunciar Produto
        </Button>
      </Link>
      
      <Link to="/my-listings">
        <Button variant="outline" className="w-full border-agro-green-600 text-agro-green-700 hover:bg-agro-green-50 font-medium rounded-full py-6 px-8 flex items-center justify-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Meus Anúncios
        </Button>
      </Link>
    </div>
  );
};
