
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CameraCapture } from "../plant-diagnosis/CameraCapture";
import { Loader2, Camera, X } from "lucide-react";

export const CreateProductForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    contact_phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageCapture = (imageDataUrl: string) => {
    setImagePreview(imageDataUrl);
    setShowCamera(false);
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!imagePreview) {
      toast.error("Por favor, adicione uma imagem para o produto");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Upload the image to Supabase Storage
      const imageFile = await (async () => {
        const response = await fetch(imagePreview);
        const blob = await response.blob();
        return new File([blob], `product-${Date.now()}.jpg`, { type: 'image/jpeg' });
      })();
      
      // Generate a unique file name
      const fileName = `product-${Date.now()}`;
      const filePath = `${fileName}.jpg`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('marketplace-images')
        .upload(filePath, imageFile);
        
      if (uploadError) {
        throw new Error(`Erro ao fazer upload da imagem: ${uploadError.message}`);
      }
      
      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('marketplace-images')
        .getPublicUrl(filePath);
        
      if (!publicUrlData.publicUrl) {
        throw new Error("Erro ao obter URL pública da imagem");
      }
      
      // Insert the product data into the database
      const { error: insertError } = await supabase
        .from('marketplace_products')
        .insert({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          location: formData.location,
          contact_phone: formData.contact_phone,
          image_url: publicUrlData.publicUrl,
        });
        
      if (insertError) {
        throw new Error(`Erro ao cadastrar produto: ${insertError.message}`);
      }
      
      toast.success("Produto cadastrado com sucesso!");
      navigate('/marketplace');
      
    } catch (error: any) {
      console.error("Erro ao cadastrar produto:", error);
      toast.error(error.message || "Erro ao cadastrar produto");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (showCamera) {
    return <CameraCapture onCapture={handleImageCapture} onClose={() => setShowCamera(false)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-agro-green-800 mb-6">Cadastrar Novo Produto</h1>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Nome do Produto*</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Ex: Milho orgânico"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Descrição do Produto*</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Descreva detalhes como qualidade, quantidade, etc."
            className="min-h-[120px]"
          />
        </div>
        
        <div>
          <Label htmlFor="price">Preço (R$)*</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="Ex: 29.90"
          />
        </div>
        
        <div>
          <Label htmlFor="location">Localização*</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Ex: São Paulo, SP"
          />
        </div>
        
        <div>
          <Label htmlFor="contact_phone">WhatsApp para Contato*</Label>
          <Input
            id="contact_phone"
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleChange}
            required
            placeholder="Ex: (11) 98765-4321"
          />
        </div>
        
        <div>
          <Label className="block mb-2">Foto do Produto*</Label>
          
          {imagePreview ? (
            <div className="relative rounded-lg overflow-hidden border border-gray-200">
              <img 
                src={imagePreview} 
                alt="Prévia do produto" 
                className="w-full h-auto max-h-64 object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full h-32 bg-gray-50 flex flex-col items-center justify-center"
              onClick={() => setShowCamera(true)}
            >
              <Camera className="w-6 h-6 mb-2 text-agro-green-600" />
              <span>Tirar Foto do Produto</span>
            </Button>
          )}
        </div>
      </div>
      
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full bg-agro-green-600 hover:bg-agro-green-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Cadastrar Produto"
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="w-full mt-3"
          onClick={() => navigate('/marketplace')}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};
