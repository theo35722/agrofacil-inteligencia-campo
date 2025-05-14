
import { supabase } from "@/integrations/supabase/client";

export async function uploadProductImage(imageDataUrl: string): Promise<string> {
  // Convert the image data URL to a file
  const imageFile = await (async () => {
    const response = await fetch(imageDataUrl);
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
  
  return publicUrlData.publicUrl;
}
