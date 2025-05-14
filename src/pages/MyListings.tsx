
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MarketplaceProduct } from "@/types/marketplace";
import { MyListingsHeader } from "@/components/marketplace/MyListingsHeader";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { NoProductsMessage } from "@/components/marketplace/NoProductsMessage";
import { useAuth } from "@/contexts/AuthContext";
import { DeleteAllListingsDialog } from "@/components/marketplace/DeleteAllListingsDialog";

const MyListings = () => {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth(); // Get authenticated user and session

  // Fetch user's products when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchUserProducts();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function fetchUserProducts() {
    try {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      
      // Fetch products by user_id
      const { data, error } = await supabase
        .from("marketplace_products")
        .select("*")
        .eq("user_id", user.id);
        
      if (error) {
        console.error("Error fetching user products:", error);
        toast.error("Erro ao carregar seus anúncios");
        return;
      }
      
      console.log("User products fetched:", data?.length);
      
      if (data) {
        setProducts(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Erro ao carregar seus anúncios");
    } finally {
      setLoading(false);
    }
  }

  // Handle contact seller via WhatsApp
  const handleContactSeller = (product: MarketplaceProduct) => {
    const phoneNumber = product.contact_phone.replace(/\D/g, "");
    const message = `Olá! Vi seu anúncio "${product.title}" no AgroFácil e tenho interesse.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Function to handle product refresh after delete
  const refreshProducts = async () => {
    fetchUserProducts();
  };

  // Show login message if user is not logged in
  if (!user) {
    return (
      <div className="animate-fade-in pb-6">
        <MyListingsHeader isLoading={false} />
        
        <div className="max-w-md mx-auto px-3 py-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-center mb-4 text-agro-green-800">
              Faça login para ver seus anúncios
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Você precisa estar logado para ver, editar ou excluir seus anúncios
            </p>
            
            <div className="space-y-4">
              <Link to="/auth">
                <Button className="w-full bg-agro-green-600 hover:bg-agro-green-700">
                  Fazer Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-6">
      <MyListingsHeader isLoading={loading} />
      
      <div className="max-w-md mx-auto px-3">
        <div className="mb-4">
          <Link to="/create-marketplace-product" className="w-full">
            <Button className="w-full bg-agro-green-600 hover:bg-agro-green-700 font-medium text-white rounded-full py-6 px-8 flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              Anunciar Produto
            </Button>
          </Link>
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-8 w-8 text-agro-green-600 animate-spin" />
          <p className="text-agro-green-600 mt-4">Carregando seus anúncios...</p>
        </div>
      ) : (
        <>
          {products.length > 0 ? (
            <div className="max-w-md mx-auto px-3 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-agro-green-800">Meus Anúncios</h2>
                <DeleteAllListingsDialog userId={user.id} onSuccess={refreshProducts} />
              </div>
              <div className="grid grid-cols-1 gap-4">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onContact={() => handleContactSeller(product)}
                    isOwner={true}
                    onProductDeleted={refreshProducts}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto px-3 py-8">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Você ainda não tem anúncios
                </h3>
                <p className="text-gray-500 mb-6">
                  Clique em "Anunciar Produto" para criar seu primeiro anúncio
                </p>
                <Link to="/create-marketplace-product">
                  <Button className="bg-agro-green-600 hover:bg-agro-green-700">
                    Criar meu primeiro anúncio
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyListings;
