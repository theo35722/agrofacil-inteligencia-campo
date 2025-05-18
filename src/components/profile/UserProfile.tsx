
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Edit2, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

export const UserProfile = () => {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [userType, setUserType] = useState(profile?.tipo_usuario || "Produtor");
  const [userName, setUserName] = useState(profile?.nome || "");
  const [location, setLocation] = useState("Rondon do Pará, PA");
  const [registro, setRegistro] = useState("CREA-123456");
  const [isSaving, setIsSaving] = useState(false);
  
  const getInitials = (name: string | null) => {
    if (!name) return "AU";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSaveProfile = async () => {
    if (!profile?.id) {
      toast({
        title: "Erro",
        description: "Usuário não identificado",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nome: userName,
          tipo_usuario: userType,
        })
        .eq('id', profile.id);
      
      if (error) throw error;
      
      // Refresh profile data in context
      await refreshProfile();
      
      setIsEditing(false);
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset form when profile changes
  React.useEffect(() => {
    if (profile) {
      setUserName(profile.nome || "");
      setUserType(profile.tipo_usuario || "Produtor");
    }
  }, [profile]);

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
              onClick={() => !isEditing && setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
          
          {isEditing ? (
            <>
              <div className="w-full max-w-xs mb-2">
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="text-center font-semibold"
                  placeholder="Seu nome"
                />
              </div>
              
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
              
              <div className="mt-4 w-full flex justify-center">
                <Button 
                  onClick={handleSaveProfile}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isSaving}
                >
                  {isSaving ? "Salvando..." : "Salvar Alterações"}
                  {!isSaving && <CheckCircle className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold">{profile?.nome || "Usuário"}</h2>
              
              <div className="mt-2 w-full max-w-xs">
                <div className="bg-green-50 border border-green-100 px-4 py-2 rounded-md text-center">
                  {profile?.tipo_usuario || "Produtor"}
                </div>
              </div>
              
              <div className="flex items-center mt-3 text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{location}</span>
              </div>
              
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Registro: <span className="font-medium text-gray-700">{registro}</span>
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
