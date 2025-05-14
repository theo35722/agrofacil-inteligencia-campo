
import { useParams, useNavigate } from "react-router-dom";
import { EditProductForm } from "@/components/marketplace/EditProductForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const EditMarketplaceProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!productId) {
    return <div className="max-w-2xl mx-auto p-4">ID do produto é necessário</div>;
  }

  // If user is not authenticated, show login prompt
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Necessário fazer login</AlertTitle>
          <AlertDescription>
            Você precisa estar logado para editar produtos.
            <div className="mt-4">
              <Button 
                className="bg-agro-green-600 hover:bg-agro-green-700"
                onClick={() => navigate('/auth')}
              >
                Fazer Login
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-agro-green-800 mb-4">Editar Produto</h1>
      <EditProductForm productId={productId} />
    </div>
  );
};

export default EditMarketplaceProduct;
