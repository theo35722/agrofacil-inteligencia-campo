
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Edit2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const UserProfile = () => {
  const { profile } = useAuth();
  const [userType, setUserType] = useState(profile?.tipo_usuario || "Produtor");
  
  const getInitials = (name: string | null) => {
    if (!name) return "AU";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-4">
          <div className="relative mb-2">
            <Avatar className="h-24 w-24 border-2 border-agro-green-200">
              <AvatarImage src={profile?.foto_url || ""} alt={profile?.nome || "Usuário"} />
              <AvatarFallback className="bg-agro-green-100 text-agro-green-800 text-xl">
                {getInitials(profile?.nome)}
              </AvatarFallback>
            </Avatar>
            <Button 
              size="icon" 
              variant="outline" 
              className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-white border border-gray-200"
            >
              <Edit2 className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
          
          <h2 className="text-xl font-semibold">{profile?.nome || "Usuário"}</h2>
          
          <div className="mt-2 w-full max-w-xs">
            <Select value={userType} onValueChange={setUserType}>
              <SelectTrigger className="bg-green-50 border-green-100">
                <SelectValue placeholder="Tipo de Usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Produtor">Produtor</SelectItem>
                <SelectItem value="Agrônomo">Agrônomo</SelectItem>
                <SelectItem value="Técnico Agrícola">Técnico Agrícola</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center mt-3 text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">Rondon do Pará, PA</span>
          </div>
          
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Registro: <span className="font-medium text-gray-700">CREA-123456</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
