import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { uploadProductImage } from "./form/ProductImageService";
import { ProductFormFields } from "./form/ProductFormFields";
import { ProductFormActions } from "./form/ProductFormActions";
import { MarketplaceProduct } from "@/types/marketplace";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

// Form schema for validation
const productFormSchema = z.object({
  title: z.string().min(3, "Título precisa ter pelo menos 3 caracteres"),
  description: z.string().min(10, "Descrição precisa ter pelo menos 10 caracteres"),
  price: z.coerce.number().nonnegative("O preço não pode ser negativo"),
  location: z.string().min(3, "Localização é obrigatória"),
  contact_phone: z.string().min(10, "Telefone com DDD é obrigatório"),
  image: z.string().nullable(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export interface EditProductFormProps {
  productId: string;
}

export const EditProductForm = ({ productId }: EditProductFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get authenticated user
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      location: "",
      contact_phone: "",
      image: null,
    },
  });

  // Load product data
  useEffect(() => {
    async function fetchProduct() {
      try {
        if (!user) {
          setError("Você precisa estar logado para editar produtos");
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from("marketplace_products")
          .select("*")
          .eq("id", productId)
          .single();

        if (error) {
          setError("Erro ao carregar dados do produto");
          console.error("Error fetching product:", error);
          return;
        }

        if (data) {
          // Check if the current user is the owner of this product
          if (data.user_id === user.id) {
            setIsOwner(true);
            
            form.reset({
              title: data.title,
              description: data.description,
              price: data.price,
              location: data.location,
              contact_phone: data.contact_phone,
              image: null,
            });
            
            if (data.image_url) {
              setImagePreview(data.image_url);
            }
          } else {
            setError("Você não tem permissão para editar este produto");
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Erro ao carregar dados do produto");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [productId, navigate, form, user]);

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
    if (!imagePreview && !imageChanged) {
      toast.error("Por favor, adicione uma imagem para o produto");
      return;
    }

    if (!user) {
      toast.error("Você precisa estar logado para editar produtos");
      navigate('/auth');
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
        price: data.price,
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
      navigate('/my-listings');
      
    } catch (error: any) {
      console.error("Erro ao atualizar produto:", error);
      toast.error(error.message || "Erro ao atualizar produto");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Necessário fazer login</AlertTitle>
        <AlertDescription>
          Você precisa estar logado para editar produtos.
          <div className="mt-4">
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => navigate('/auth')}
            >
              Fazer Login
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-agro-green-600 animate-spin" />
        <span className="ml-2 text-agro-green-600">Carregando dados do produto...</span>
      </div>
    );
  }

  if (error || !isOwner) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Não foi possível editar</AlertTitle>
        <AlertDescription>
          {error || "Você não tem permissão para editar este produto"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
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
