
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Edit2, CheckCircle, Upload } from "lucide-react";
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
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const getInitials = (name: string | null) => {
    if (!name) return "AU";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  useEffect(() => {
    if (profile) {
      setUserName(profile.nome || "");
      setUserType(profile.tipo_usuario || "Produtor");
    }
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfilePhoto = async () => {
    if (!photoFile || !profile?.id) return false;
    
    setUploadingPhoto(true);
    
    try {
      // Create a unique file path
      const fileExt = photoFile.name.split('.').pop();
      const filePath = `${profile.id}/${Date.now()}.${fileExt}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile_photos')
        .upload(filePath, photoFile);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('profile_photos')
        .getPublicUrl(filePath);
        
      if (!publicUrlData.publicUrl) throw new Error("Failed to get public URL");
      
      // Update user profile with the new photo URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ foto_url: publicUrlData.publicUrl })
        .eq('id', profile.id);
        
      if (updateError) throw updateError;
      
      // Refresh profile data to show the new photo
      await refreshProfile();
      
      toast({
        title: "Sucesso",
        description: "Foto de perfil atualizada com sucesso",
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a foto de perfil",
        variant: "destructive",
      });
      return false;
    } finally {
      setUploadingPhoto(false);
    }
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
      // If there's a new photo, upload it first
      if (photoFile) {
        const photoUploaded = await uploadProfilePhoto();
        if (!photoUploaded) throw new Error("Falha ao salvar foto de perfil");
      }
      
      // Update profile data
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
      setPhotoFile(null);
      setPhotoPreview(null);
      
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

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-4">
          <div className="relative mb-2">
            {isEditing ? (
              <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-agro-green-200 relative">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                ) : profile?.foto_url ? (
                  <img src={profile.foto_url} alt={profile.nome || ""} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-agro-green-100 text-agro-green-800 text-xl">
                    {getInitials(profile?.nome)}
                  </div>
                )}
                <label htmlFor="profile-photo" className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center cursor-pointer">
                  <Upload className="h-8 w-8 text-white" />
                  <input
                    type="file"
                    id="profile-photo"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            ) : (
              <Avatar className="h-24 w-24 border-2 border-agro-green-200">
                <AvatarImage src={profile?.foto_url || ""} alt={profile?.nome || "Usuário"} />
                <AvatarFallback className="bg-agro-green-100 text-agro-green-800 text-xl">
                  {getInitials(profile?.nome)}
                </AvatarFallback>
              </Avatar>
            )}
            {!isEditing && (
              <Button 
                size="icon" 
                variant="outline" 
                className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-white border border-gray-200"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4 text-gray-600" />
              </Button>
            )}
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
