
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export const UserProperties = () => {
  // Mock data - in a real app, this would come from an API call or context
  const properties = [
    { id: 1, name: "Fazenda São João", location: "Rondon do Pará, PA" },
    { id: 2, name: "Sítio Esperança", location: "Marabá, PA" },
  ];

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Sprout className="h-5 w-5 mr-2 text-green-600" />
          Minhas Propriedades
        </CardTitle>
      </CardHeader>
      <CardContent>
        {properties.length > 0 ? (
          <div className="space-y-2">
            {properties.map((property) => (
              <div key={property.id} className="flex justify-between items-center p-2 bg-green-50 rounded-md">
                <div>
                  <h3 className="font-medium text-sm">{property.name}</h3>
                  <div className="flex items-center text-xs text-gray-500 mt-0.5">
                    <MapPin className="h-3 w-3 mr-1" />
                    {property.location}
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-4">
              <Link to="/lavouras">
                <Button className="w-full bg-green-500 hover:bg-green-600">
                  Ver / Editar Lavouras
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-3">Nenhuma propriedade cadastrada</p>
            <Link to="/lavouras">
              <Button className="bg-green-500 hover:bg-green-600">
                Adicionar Propriedade
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
