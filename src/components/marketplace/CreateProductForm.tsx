
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductFormFields } from "./form/ProductFormFields";
import { ProductImageUpload } from "./form/ProductImageUpload";
import { ProductFormActions } from "./form/ProductFormActions";
import { uploadProductImage } from "./form/ProductImageService";

export const CreateProductForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      
      // Upload image and get public URL
      const publicUrl = await uploadProductImage(imagePreview);
      
      // Insert the product data into the database
      const { error: insertError } = await supabase
        .from('marketplace_products')
        .insert({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          location: formData.location,
          contact_phone: formData.contact_phone,
          image_url: publicUrl,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-agro-green-800 mb-6">Cadastrar Novo Produto</h1>
      
      <ProductFormFields 
        formData={formData}
        handleChange={handleChange}
      />
      
      <ProductImageUpload
        imagePreview={imagePreview}
        onImageCapture={handleImageCapture}
        onImageRemove={removeImage}
      />
      
      <ProductFormActions
        isSubmitting={isSubmitting}
      />
    </form>
  );
};
