
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EditProductForm } from "@/components/marketplace/EditProductForm";
import { Button } from "@/components/ui/button";
import { PhoneSettings } from "@/components/marketplace/PhoneSettings";
import { toast } from "sonner";

const EditMarketplaceProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [userPhone, setUserPhone] = useState<string | null>(null);

  // Get user phone from localStorage on component mount
  useEffect(() => {
    const storedPhone = localStorage.getItem('userPhone');
    setUserPhone(storedPhone);
  }, []);

  if (!productId) {
    return <div className="max-w-2xl mx-auto p-4">ID do produto é necessário</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-agro-green-800 mb-4">Editar Produto</h1>
      
      <PhoneSettings userPhone={userPhone} setUserPhone={setUserPhone} />
      
      {userPhone ? (
        <EditProductForm productId={productId} userPhone={userPhone} />
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <h2 className="font-medium text-yellow-800 mb-2">Configuração necessária</h2>
          <p className="text-yellow-700 mb-4">
            Para editar um produto, você precisa configurar seu número de telefone.
            Configure seu telefone utilizando o botão acima.
          </p>
        </div>
      )}
    </div>
  );
};

export default EditMarketplaceProduct;
