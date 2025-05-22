
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads an image to Supabase storage
 * @param imageFile Optional File object to upload
 * @param imagePreview Optional base64 string to upload if File is not provided
 * @param locale UI language for error messages
 * @returns URL of the uploaded image or null on failure
 */
export async function uploadImage(
  imageFile?: File, 
  imagePreview?: string, 
  locale: "pt" | "en" = "pt"
): Promise<string | null> {
  if (!imageFile && !imagePreview) {
    toast.error(locale === "pt" ? "Imagem não encontrada" : "Image not found");
    return null;
  }

  try {
    // If we have a File, use it directly
    if (imageFile) {
      const fileName = `plant_${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      
      const { data, error } = await supabase.storage
        .from('plant-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get the public URL of the image
      const { data: { publicUrl } } = supabase.storage
        .from('plant-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } 
    // If we don't have a File but have a base64 string, convert it to a File
    else if (imagePreview) {
      // Convert base64 to blob
      const base64Response = await fetch(imagePreview);
      const blob = await base64Response.blob();
      
      // Create a unique filename
      const fileName = `plant_${Date.now()}.jpg`;
      
      const { data, error } = await supabase.storage
        .from('plant-images')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get the public URL of the image
      const { data: { publicUrl } } = supabase.storage
        .from('plant-images')
        .getPublicUrl(data.path);

      return publicUrl;
    }
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    toast.error(locale === "pt" 
      ? "Erro ao fazer upload da imagem" 
      : "Error uploading image");
    return null;
  }
  
  return null;
}
