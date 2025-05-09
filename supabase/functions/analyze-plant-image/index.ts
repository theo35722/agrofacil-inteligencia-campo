
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PlantAnalysisRequest {
  imageUrl: string;
  culture: string;
  symptoms: string;
  affectedArea: string;
  timeFrame: string;
  recentProducts?: string;
  weatherChanges?: string;
  location?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("API key do OpenAI não configurada. Configure o segredo OPENAI_API_KEY nas funções do Supabase.");
    }

    // Parse request body
    const { imageUrl, culture, symptoms, affectedArea, timeFrame, recentProducts, weatherChanges, location } = await req.json() as PlantAnalysisRequest;

    // Validate input
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: "URL da imagem é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analisando imagem:", imageUrl);
    console.log("Cultura:", culture);

    // Construct the prompt for GPT-4 Vision
    const prompt = `
      Sua função é agir como um agrônomo digital brasileiro. Analise a imagem da planta e as informações fornecidas:
      
      Cultura: ${culture}
      Sintomas observados: ${symptoms}
      Parte afetada: ${affectedArea}
      Duração dos sintomas: ${timeFrame}
      Produtos aplicados recentemente: ${recentProducts || "Não informado"}
      Mudanças climáticas: ${weatherChanges || "Não informado"}
      Localização: ${location || "Não informado"}
      
      Baseado nesta imagem e informações, forneça um JSON com o seguinte formato:
      {
        "disease": "Nome provável da doença ou condição",
        "severity": "low, moderate ou high",
        "affectedArea": "Parte da planta mais afetada",
        "spreadRisk": "Risco de disseminação (baixo, médio, alto)",
        "treatment": "Tratamento recomendado para um produtor rural brasileiro",
        "preventiveMeasures": ["3 medidas preventivas para safras futuras"],
        "extraTip": "Uma dica adicional para manejo sustentável",
        "confidence": 85 // Um número de 0 a 100 representando a confiança no diagnóstico
      }
      
      Responda apenas com o JSON, sem texto adicional.
    `;

    // Call OpenAI API with GPT-4 Vision model
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                }
              }
            ]
          }
        ],
        max_tokens: 800,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error("Erro na API da OpenAI:", errorData);
      return new Response(
        JSON.stringify({ 
          error: "Falha na análise da imagem", 
          details: errorData.error?.message || "Erro desconhecido" 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await openaiResponse.json();
    console.log("Resposta da OpenAI recebida");
    
    // Extract the JSON response from the content
    try {
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const parsedResult = JSON.parse(jsonStr);
        
        return new Response(
          JSON.stringify(parsedResult),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        console.error("Não foi possível extrair JSON válido da resposta");
        return new Response(
          JSON.stringify({ error: "Formato de resposta inválido" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } catch (parseError) {
      console.error("Erro ao processar resposta:", parseError);
      return new Response(
        JSON.stringify({ error: "Erro ao processar resultado da análise", details: parseError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error("Erro interno:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno no servidor", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
