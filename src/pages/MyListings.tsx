
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
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [phoneInputValue, setPhoneInputValue] = useState("");

  // Fetch user's products when component mounts
  useEffect(() => {
    // Get user phone from localStorage or set input mode
    const storedPhone = localStorage.getItem('userPhone');
    
    if (storedPhone) {
      setUserPhone(storedPhone);
      console.log("User phone from localStorage:", storedPhone);
      fetchUserProducts(storedPhone);
    } else {
      console.log("No phone number stored, showing input");
      setLoading(false);
      setShowPhoneInput(true);
    }
  }, []);

  async function fetchUserProducts(phone: string) {
    try {
      if (!phone) {
        setLoading(false);
        return;
      }

      setLoading(true);
      
      // Normalize the phone number to just digits for comparison
      const normalizedPhone = phone.replace(/\D/g, "");
      console.log("Normalized phone for query:", normalizedPhone);
      
      // Fetch all products first
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

  // Handle setting phone number
  const handleSetPhone = () => {
    if (!phoneInputValue || phoneInputValue.length < 10) {
      toast.error("Por favor, insira um número de telefone válido com DDD");
      return;
    }

    // Save to localStorage
    localStorage.setItem('userPhone', phoneInputValue);
    setUserPhone(phoneInputValue);
    setShowPhoneInput(false);
    
    // Fetch products with the new phone
    fetchUserProducts(phoneInputValue);
    
    toast.success("Telefone configurado com sucesso!");
  };

  // Handle contact seller via WhatsApp
  const handleContactSeller = (product: MarketplaceProduct) => {
    const phoneNumber = product.contact_phone.replace(/\D/g, "");
    const message = `Olá! Vi seu anúncio "${product.title}" no AgroFácil e tenho interesse.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Function to handle product refresh after delete
  const refreshProducts = async () => {
    if (userPhone) {
      fetchUserProducts(userPhone);
    }
  };

  // Phone input view
  if (showPhoneInput) {
    return (
      <div className="animate-fade-in pb-6">
        <MyListingsHeader isLoading={false} />
        
        <div className="max-w-md mx-auto px-3 py-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-center mb-4 text-agro-green-800">
              Configure seu número de telefone
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Para ver seus anúncios, precisamos do número de telefone que você utilizou para criar os anúncios
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Seu número de telefone com DDD:
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Ex: (94) 99277-3566"
                  value={phoneInputValue}
                  onChange={(e) => setPhoneInputValue(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleSetPhone}
                className="w-full bg-agro-green-600 hover:bg-agro-green-700"
              >
                Confirmar Telefone
              </Button>
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
        <div className="mb-4 flex justify-between items-center">
          <Link to="/create-marketplace-product" className="flex-grow">
            <Button className="w-full bg-agro-green-600 hover:bg-agro-green-700 font-medium text-white rounded-full py-6 px-8 flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              Anunciar Produto
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="ml-2 border-agro-green-600 text-agro-green-700"
            onClick={() => {
              localStorage.removeItem('userPhone');
              setShowPhoneInput(true);
              setUserPhone(null);
            }}
          >
            Alterar Tel
          </Button>
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
