
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

export const MarketplaceActions = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex-1">
        {/* Simplified header - no description text */}
      </div>
      <div className="flex gap-2">
        <Link to="/create-marketplace-product">
          <Button className="bg-agro-green-600 hover:bg-agro-green-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Anunciar Produto
          </Button>
        </Link>
      </div>
    </div>
  );
};
