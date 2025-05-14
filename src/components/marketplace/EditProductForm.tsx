
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { uploadProductImage } from "./form/ProductImageService";
import { ProductFormFields } from "./form/ProductFormFields";
import { ProductFormActions } from "./form/ProductFormActions";
import { MarketplaceProduct } from "@/types/marketplace";

// Form schema for validation
const productFormSchema = z.object({
  title: z.string().min(3, "Título precisa ter pelo menos 3 caracteres"),
  description: z.string().min(10, "Descrição precisa ter pelo menos 10 caracteres"),
  price: z.string().or(z.number()).transform(val => parseFloat(String(val))),
  location: z.string().min(3, "Localização é obrigatória"),
  contact_phone: z.string().min(10, "Telefone com DDD é obrigatório"),
  image: z.string().nullable(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface EditProductFormProps {
  productId: string;
}

export const EditProductForm = ({ productId }: EditProductFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      location: "",
      contact_phone: "",
      image: null,
    },
  });

  // Load product data
  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("marketplace_products")
          .select("*")
          .eq("id", productId)
          .single();

        if (error) {
          toast.error("Erro ao carregar dados do produto");
          console.error("Error fetching product:", error);
          navigate("/marketplace");
          return;
        }

        if (data) {
          form.reset({
            title: data.title,
            description: data.description,
            price: data.price.toString(),
            location: data.location,
            contact_phone: data.contact_phone,
            image: null,
          });
          
          if (data.image_url) {
            setImagePreview(data.image_url);
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("Erro ao carregar dados do produto");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [productId, navigate, form]);

  // Watch for image changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "image" && value.image) {
        setImagePreview(value.image);
        setImageChanged(true);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: ProductFormValues) => {
    if (!data.image && !imagePreview) {
      toast.error("Por favor, adicione uma imagem para o produto");
      return;
    }

    try {
      setIsSubmitting(true);
      
      let imageUrl = null;
      
      // Only upload a new image if it was changed
      if (imageChanged && data.image) {
        try {
          imageUrl = await uploadProductImage(data.image);
        } catch (error: any) {
          throw new Error(`Erro ao fazer upload da imagem: ${error.message}`);
        }
      }
      
      // Prepare update object
      const updateObject: Partial<MarketplaceProduct> = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price.toString()),
        location: data.location,
        contact_phone: data.contact_phone,
      };
      
      // Only update image_url if a new image was uploaded
      if (imageChanged && imageUrl) {
        updateObject.image_url = imageUrl;
      }
      
      // Update the product in the database
      const { error: updateError } = await supabase
        .from('marketplace_products')
        .update(updateObject)
        .eq('id', productId);
        
      if (updateError) {
        throw new Error(`Erro ao atualizar produto: ${updateError.message}`);
      }
      
      toast.success("Produto atualizado com sucesso!");
      navigate('/marketplace');
      
    } catch (error: any) {
      console.error("Erro ao atualizar produto:", error);
      toast.error(error.message || "Erro ao atualizar produto");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-agro-green-600 animate-spin" />
        <span className="ml-2 text-agro-green-600">Carregando dados do produto...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-agro-green-800 mb-6">Editar Produto</h1>
        
        <ProductFormFields form={form} existingImageUrl={imagePreview} />
        
        <ProductFormActions 
          isSubmitting={isSubmitting} 
          submitLabel="Atualizar Produto" 
          submittingLabel="Atualizando..." 
        />
      </form>
    </Form>
  );
};
