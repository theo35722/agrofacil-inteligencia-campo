
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Loader2, MessageCircle } from "lucide-react";
import { MarketplaceItem } from "@/components/marketplace/MarketplaceItem";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { toast } from "sonner";

export type MarketplaceProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  image_url: string | null;
  contact_phone: string;
  created_at: string;
};

const Marketplace = () => {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("marketplace_products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching marketplace products:", error);
          toast.error("Erro ao carregar produtos do marketplace");
          return;
        }

        setProducts(data || []);
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("Erro ao carregar produtos do marketplace");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <MarketplaceHeader />
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-agro-green-600 animate-spin" />
          <span className="ml-2 text-agro-green-600">Carregando produtos...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <h3 className="text-xl font-medium text-gray-600">Nenhum produto disponível</h3>
          <p className="text-gray-500 mt-2">Em breve você poderá anunciar seus produtos aqui!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <MarketplaceItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
