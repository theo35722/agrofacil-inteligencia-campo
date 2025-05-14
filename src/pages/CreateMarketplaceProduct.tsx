
import { CreateProductForm } from "@/components/marketplace/CreateProductForm";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect } from "react";

const CreateMarketplaceProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login page if user is not authenticated
  useEffect(() => {
    if (!user) {
      // We'll show an alert instead of auto-redirecting
      // to give context to the user
    }
  }, [user]);

  // If user is not authenticated, show login prompt
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Necessário fazer login</AlertTitle>
          <AlertDescription>
            Você precisa estar logado para criar anúncios no marketplace.
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
      <CreateProductForm />
    </div>
  );
};

export default CreateMarketplaceProduct;
