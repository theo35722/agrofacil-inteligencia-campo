
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductFormFields } from "./form/ProductFormFields";
import { ProductImageUpload } from "./form/ProductImageUpload";
import { ProductFormActions } from "./form/ProductFormActions";
import { uploadProductImage } from "./form/ProductImageService";
import { useLocationName } from "@/hooks/use-location-name";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

const productSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  price: z.string().min(1, "Informe o preço"),
  location: z.string().min(1, "Localização é obrigatória"),
  contact_phone: z.string().min(8, "Informe um número de telefone válido"),
  image: z.any().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export const CreateProductForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { locationName, isLoading: locationLoading, error: locationError } = useLocationName();
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      location: "",
      contact_phone: "",
    },
  });

  // Atualizar o campo de localização quando a localização do usuário for detectada
  useEffect(() => {
    if (locationName) {
      form.setValue("location", locationName);
    }
  }, [locationName, form]);

  const handleImageCapture = (imageDataUrl: string) => {
    setImagePreview(imageDataUrl);
    form.setValue("image", imageDataUrl);
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setValue("image", undefined);
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (!imagePreview) {
      toast.error("Imagem necessária", {
        description: "Por favor, adicione uma imagem para o produto"
      });
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
          title: data.title,
          description: data.description,
          price: parseFloat(data.price),
          location: data.location,
          contact_phone: data.contact_phone,
          image_url: publicUrl,
        });
        
      if (insertError) {
        throw new Error(`Erro ao cadastrar produto: ${insertError.message}`);
      }
      
      toast.success("Sucesso!", {
        description: "Produto cadastrado com sucesso!"
      });
      navigate('/marketplace');
      
    } catch (error: any) {
      console.error("Erro ao cadastrar produto:", error);
      toast.error("Erro", {
        description: error.message || "Erro ao cadastrar produto"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-agro-green-800 mb-6">Cadastrar Novo Produto</h1>
        
        <ProductFormFields 
          form={form}
          existingImageUrl={imagePreview}
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
    </Form>
  );
};
