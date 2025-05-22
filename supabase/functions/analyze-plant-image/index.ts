import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PlantAnalysisRequest {
  imageUrl: string;
  culture: string;
  symptoms: string;
  affectedArea?: string;
  timeFrame?: string;
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

    // Construct the prompt for GPT-4 Vision with improved structure
    const prompt = `
      Você é um agrônomo digital especialista em diagnósticos de doenças em plantas.
      
      Análise as informações fornecidas e responda de forma estruturada:
      
      Dados recebidos:
      
      Imagem da planta: URL fornecida
      Cultura: ${culture}
      Sintomas observados: ${symptoms}
      Parte afetada: ${affectedArea || "Não informado"}
      Tempo de surgimento dos sintomas: ${timeFrame || "Não informado"}
      Produtos aplicados recentemente: ${recentProducts || "Não informado"}
      Condições climáticas recentes: ${weatherChanges || "Não informado"}
      Localização: ${location || "Não informado"}
      
      Baseado nesta imagem e informações, forneça um JSON com o seguinte formato:
      {
        "disease": {
          "name": "Nome provável da doença ou condição",
          "scientificName": "Nome científico da doença ou da planta afetada (ex: Phytophthora infestans para requeima do tomate)",
          "description": "Descrição breve da doença, incluindo o agente causador e como ela afeta a planta"
        },
        "severity": {
          "level": "low, moderate ou high",
          "justification": "Justificativa para essa classificação de severidade"
        },
        "treatment": {
          "products": [
            {
              "name": "Nome do produto recomendado",
              "activeIngredient": "Ingrediente ativo principal",
              "dosage": "Dosagem recomendada",
              "application": "Como aplicar",
              "interval": "Intervalo entre aplicações",
              "timing": "Melhor horário para aplicação",
              "weather": "Condições climáticas ideais",
              "preharvest": "Período de carência"
            }
          ],
          "additionalRecommendations": "Recomendações adicionais de tratamento"
        },
        "preventiveMeasures": [
          "Medida preventiva 1",
          "Medida preventiva 2",
          "Medida preventiva 3"
        ],
        "extraTips": "Dicas extras importantes para o agricultor",
        "affectedArea": "Parte da planta mais afetada",
        "spreadRisk": "Risco de disseminação (baixo, médio, alto)",
        "confidence": 85, // Um número de 0 a 100 representando a confiança no diagnóstico
        "symptoms": [
          "Sintoma identificado 1",
          "Sintoma identificado 2"
        ]
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
        max_tokens: 1200,
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
        
        // Transform the enhanced response to match the current interface expectations
        // This ensures backward compatibility while providing more detailed information
        const compatibleResult = {
          disease: parsedResult.disease.name,
          scientificName: parsedResult.disease.scientificName || "",
          description: parsedResult.disease.description || "",
          severity: parsedResult.severity.level,
          severityJustification: parsedResult.severity.justification || "",
          affectedArea: parsedResult.affectedArea,
          spreadRisk: parsedResult.spreadRisk,
          treatment: parsedResult.treatment.additionalRecommendations || "",
          extraTip: parsedResult.extraTips,
          preventiveMeasures: parsedResult.preventiveMeasures,
          confidence: parsedResult.confidence,
          recommendations: parsedResult.treatment.products || [],
          symptoms: parsedResult.symptoms || []
        };
        
        return new Response(
          JSON.stringify(compatibleResult),
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
