
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

const MyListings = () => {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPhone, setUserPhone] = useState<string | null>(null);

  // Fetch user's products when component mounts
  useEffect(() => {
    // Get user phone from localStorage
    const storedPhone = localStorage.getItem('userPhone');
    setUserPhone(storedPhone);
    console.log("User phone from localStorage:", storedPhone);

    async function fetchUserProducts() {
      try {
        if (!storedPhone) {
          console.log("No phone number stored, can't fetch products");
          setLoading(false);
          return;
        }

        setLoading(true);
        
        // Normalize the phone number to just digits for comparison
        const normalizedPhone = storedPhone.replace(/\D/g, "");
        console.log("Normalized phone for query:", normalizedPhone);
        
        const { data, error } = await supabase
          .from("marketplace_products")
          .select("*");
          
        if (error) {
          console.error("Error fetching user products:", error);
          toast.error("Erro ao carregar seus anúncios");
          return;
        }
        
        console.log("All products fetched:", data?.length);
        
        // Filter products by user's phone after fetching
        if (data) {
          const userProducts = data.filter(product => {
            const productPhone = product.contact_phone.replace(/\D/g, "");
            console.log(`Comparing product phone: ${productPhone} with user phone: ${normalizedPhone}`);
            return productPhone === normalizedPhone;
          });
          
          console.log("Filtered user products:", userProducts.length);
          setProducts(userProducts);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("Erro ao carregar seus anúncios");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProducts();
  }, []);

  // Handle contact seller via WhatsApp (reusing existing function)
  const handleContactSeller = (product: MarketplaceProduct) => {
    const phoneNumber = product.contact_phone.replace(/\D/g, "");
    const message = `Olá! Vi seu anúncio "${product.title}" no AgroFácil e tenho interesse.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Function to handle product refresh after delete
  const refreshProducts = async () => {
    if (!userPhone) return;
    
    try {
      setLoading(true);
      const normalizedPhone = userPhone.replace(/\D/g, "");
      console.log("Refreshing products for phone:", normalizedPhone);
      
      const { data, error } = await supabase
        .from("marketplace_products")
        .select("*");
        
      if (error) {
        throw error;
      }
      
      console.log("Refreshing - all products fetched:", data?.length);
      
      if (data) {
        const userProducts = data.filter(product => {
          const productPhone = product.contact_phone.replace(/\D/g, "");
          return productPhone === normalizedPhone;
        });
        
        console.log("Refreshing - filtered user products:", userProducts.length);
        setProducts(userProducts);
      }
    } catch (err) {
      console.error("Error refreshing products:", err);
      toast.error("Erro ao atualizar lista de anúncios");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in pb-6">
      <MyListingsHeader isLoading={loading} />
      
      <div className="max-w-md mx-auto px-3">
        <div className="mb-4 flex justify-center">
          <Link to="/create-marketplace-product">
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
              <h2 className="text-xl font-semibold text-agro-green-800 my-4">Meus Anúncios</h2>
              <div className="grid grid-cols-1 gap-4">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onContact={() => handleContactSeller(product)}
                    userPhone={userPhone}
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
