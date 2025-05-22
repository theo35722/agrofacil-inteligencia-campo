
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const EmailConfirmado = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-green-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-agro-green-700">
            Conta confirmada com sucesso!
          </CardTitle>
          <CardDescription>
            Agora você pode fazer login normalmente.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild className="bg-agro-green-600 hover:bg-agro-green-700">
            <Link to="/auth">Fazer login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfirmado;
