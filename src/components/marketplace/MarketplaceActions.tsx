
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

export const MarketplaceActions = () => {
  return (
    <div className="flex justify-center mb-4">
      <Link to="/create-marketplace-product" className="w-full max-w-sm">
        <Button className="w-full bg-agro-green-600 hover:bg-agro-green-700 h-12 rounded-full text-base">
          <PlusCircle className="mr-2 h-5 w-5" />
          Anunciar Produto
        </Button>
      </Link>
    </div>
  );
};
