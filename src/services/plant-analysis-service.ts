
import { supabase } from "@/integrations/supabase/client";
import { DiagnosisQuestions } from "@/services/openai-api";

/**
 * Calls the Supabase edge function to analyze a plant image
 * @param imageUrl URL of the uploaded image
 * @param formData Form data with plant information
 * @returns Analysis result from the edge function
 */
export async function analyzePlantImage(imageUrl: string, formData: DiagnosisQuestions) {
  try {
    const response = await supabase.functions.invoke('analyze-plant-image', {
      body: {
        imageUrl,
        ...formData
      }
    });

    if (!response.data) {
      throw new Error("Empty analysis response");
    }

    return response.data;
  } catch (error) {
    console.error("Error calling Edge Function:", error);
    throw error;
  }
}
