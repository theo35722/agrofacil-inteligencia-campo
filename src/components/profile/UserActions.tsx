
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, List, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export const UserActions = () => {
  const { signOut } = useAuth();

  return (
    <Card className="border-gray-200 shadow-sm mb-8">
      <CardContent className="p-4 space-y-3">
        <Button 
          variant="outline" 
          className="w-full flex justify-center items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
        >
          <Edit className="h-4 w-4" />
          Editar Perfil
        </Button>
        
        <Link to="/atividades" className="w-full block">
          <Button 
            variant="outline" 
            className="w-full flex justify-center items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
          >
            <List className="h-4 w-4" />
            Ver minhas atividades
          </Button>
        </Link>
        
        <Button 
          variant="outline" 
          className="w-full flex justify-center items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          Sair do AgroFácil
        </Button>
      </CardContent>
    </Card>
  );
};

// Import the needed Card components
import { Card, CardContent } from "@/components/ui/card";
