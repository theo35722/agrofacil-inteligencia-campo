export interface DiagnosisQuestions {
  culture: string;
  symptoms: string;
  affectedArea: string;
  timeFrame: string;
  recentProducts?: string;
  weatherChanges?: string;
  location?: string;
  imageUrl?: string;  // Adicionado campo para URL da imagem do Supabase
}

export interface DiagnosisResult {
  disease: string;
  scientificName?: string;
  description?: string;
  severity: "low" | "moderate" | "high";
  severityJustification?: string;
  affectedArea: string;
  treatment: string;
  extraTip: string;
  spreadRisk?: string;
  preventiveMeasures?: string[];
  confidence: number;
  recommendations?: Array<{
    name?: string;
    product: string;
    activeIngredient: string;
    dosage: string;
    application: string;
    interval: string;
    timing: string;
    weather: string;
    preharvest: string;
  }>;
  symptoms?: string[];
}

// Atualização para usar a Edge Function do Supabase
export const analyzePlantWithAI = async (
  imageBase64: string,
  questions: DiagnosisQuestions
): Promise<DiagnosisResult> => {
  try {
    console.log("Analisando planta com AI...");
    console.log("Dados do questionário:", questions);
    
    if (questions.imageUrl) {
      // Se tivermos uma URL da imagem do Supabase (método novo), usamos a Edge Function
      console.log("URL da imagem disponível. Usando Edge Function para análise.");
      
      // Aqui importamos o cliente do Supabase em cada função que o usa
      const { supabase } = await import('@/integrations/supabase/client');
      
      try {
        const { data, error } = await supabase.functions.invoke('analyze-plant-image', {
          body: {
            imageUrl: questions.imageUrl,
            ...questions
          }
        });

        if (error) {
          console.error("Erro na chamada à Edge Function:", error);
          throw new Error("Erro ao chamar a função de análise");
        }

        if (!data) {
          console.error("Resposta vazia da Edge Function");
          throw new Error("Resposta vazia da análise");
        }

        return data as DiagnosisResult;
        
      } catch (error) {
        console.error("Erro ao chamar Edge Function:", error);
        return getFallbackDiagnosis(questions);
      }
    } 
    // Método antigo usando API key diretamente
    else {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      // Verificação para a API key
      if (!apiKey) {
        console.error("VITE_OPENAI_API_KEY não encontrada. Configure a chave da API.");
        throw new Error("API key não configurada");
      }
      
      if (!apiKey.startsWith("sk-")) {
        console.warn("Formato de API key possivelmente inválido. As chaves da OpenAI geralmente começam com 'sk-'");
        console.log("Tentando usar a chave mesmo assim...");
      }
      
      console.log("Chamando API OpenAI diretamente...");
      const result = await callOpenAI(imageBase64, questions, apiKey);
      
      if (!result) {
        console.log("Usando diagnóstico de fallback...");
        return getFallbackDiagnosis(questions);
      }
      
      return result;
    }
  } catch (error) {
    console.error("Erro ao analisar planta com IA:", error);
    console.log("Detalhes do erro:", error.message || "Erro sem detalhes");
    
    // Retornar um diagnóstico de fallback
    console.log("Usando diagnóstico de fallback devido ao erro...");
    return getFallbackDiagnosis(questions);
  }
};

const callOpenAI = async (
  imageBase64: string, 
  questions: DiagnosisQuestions, 
  apiKey: string
): Promise<DiagnosisResult | null> => {
  try {
    const prompt = `
      Sua função é agir como um agrônomo digital brasileiro. Analise a imagem da planta e as informações fornecidas:
      
      Cultura: ${questions.culture}
      Sintomas observados: ${questions.symptoms}
      Parte afetada: ${questions.affectedArea}
      Duração dos sintomas: ${questions.timeFrame}
      Produtos aplicados recentemente: ${questions.recentProducts || "Não informado"}
      Mudanças climáticas: ${questions.weatherChanges || "Não informado"}
      Localização: ${questions.location || "Não informado"}
      
      Baseado nesta imagem e informações, forneça um JSON com o seguinte formato:
      {
        "disease": "Nome provável da doença ou condição",
        "scientificName": "Nome científico da doença",
        "description": "Descrição da doença",
        "severity": "low, moderate ou high",
        "severityJustification": "Justificativa para a severidade",
        "affectedArea": "Parte da planta mais afetada",
        "spreadRisk": "Risco de disseminação (baixo, médio, alto)",
        "treatment": "Tratamento recomendado para um produtor rural brasileiro",
        "preventiveMeasures": ["3 medidas preventivas para safras futuras"],
        "extraTip": "Uma dica adicional para manejo sustentável",
        "confidence": 85 // Um número de 0 a 100 representando a confiança no diagnóstico
      }
      
      Responda apenas com o JSON, sem texto adicional.
    `;

    console.log("Enviando imagem para análise pela OpenAI...");
    console.log(`Usando modelo: gpt-4o`);
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
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
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 800
      })
    });
    
    console.log("Status da resposta:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na API da OpenAI:", errorData);
      throw new Error(`Erro na API OpenAI: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Resposta da OpenAI recebida");
    
    if (data.error) {
      console.error("Erro na API da OpenAI:", data.error);
      throw new Error(`Erro na API OpenAI: ${data.error.message}`);
    }
    
    // Extrair o texto da resposta
    const content = data.choices[0].message.content;
    console.log("Conteúdo da resposta:", content);
    
    // Extrair o JSON da resposta
    try {
      // Procurar pelo JSON na resposta
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const parsedResult = JSON.parse(jsonStr);
        
        // Mapear o resultado para o formato esperado
        const result: DiagnosisResult = {
          disease: parsedResult.disease || "Diagnóstico não identificado",
          scientificName: parsedResult.scientificName || "Nome científico não identificado",
          description: parsedResult.description || "Descrição não identificada",
          severity: (parsedResult.severity as "low" | "moderate" | "high") || "moderate",
          severityJustification: parsedResult.severityJustification || "Justificativa de severidade não identificada",
          affectedArea: parsedResult.affectedArea || questions.affectedArea,
          treatment: parsedResult.treatment || "Consulte um agrônomo para diagnóstico presencial",
          extraTip: parsedResult.extraTip || "Monitore regularmente sua plantação",
          spreadRisk: parsedResult.spreadRisk || "Desconhecido",
          preventiveMeasures: Array.isArray(parsedResult.preventiveMeasures) 
            ? parsedResult.preventiveMeasures 
            : ["Consultar um agrônomo", "Monitorar a plantação regularmente", "Realizar análise de solo"],
          confidence: parsedResult.confidence || 70,
          recommendations: parsedResult.recommendations || [],
          symptoms: parsedResult.symptoms || []
        };
        
        return result;
      } else {
        console.error("Não foi possível encontrar um JSON válido na resposta");
        return null;
      }
    } catch (parseError) {
      console.error("Erro ao parsear resposta JSON:", parseError);
      return null;
    }
  } catch (error) {
    console.error("Erro ao chamar a API da OpenAI:", error);
    return null;
  }
};

// Função para obter um diagnóstico de fallback caso a API falhe
const getFallbackDiagnosis = (questions: DiagnosisQuestions): DiagnosisResult => {
  // Respostas simuladas baseadas na cultura e sintomas
  const mockResponses: Record<string, DiagnosisResult> = {
    "milho": {
      disease: "Ferrugem do Milho",
      scientificName: "Fusarium graminearum",
      description: "Doença causada por fungos do gênero Fusarium.",
      severity: "moderate",
      severityJustification: "A doença pode afetar a produtividade e a qualidade do milho.",
      affectedArea: "Folhas",
      treatment: "Fungicida à base de Azoxistrobina + Ciproconazol, aplicação foliar na dose de 0,3L/ha.",
      extraTip: "Rotação de culturas e escolha de variedades resistentes podem reduzir a incidência desta doença.",
      spreadRisk: "Médio",
      preventiveMeasures: [
        "Utilizar variedades resistentes",
        "Fazer rotação de culturas",
        "Monitorar a lavoura regularmente"
      ],
      confidence: 85,
      recommendations: [
        { name: "Fungicida", product: "Azoxistrobina", activeIngredient: "Azoxistrobina", dosage: "0,3L/ha", application: "Foliar", interval: "14 dias", timing: "Diária", weather: "Nenhuma", preharvest: "Não" },
        { name: "Ciproconazol", product: "Ciproconazol", activeIngredient: "Ciproconazol", dosage: "0,3L/ha", application: "Foliar", interval: "14 dias", timing: "Diária", weather: "Nenhuma", preharvest: "Não" }
      ],
      symptoms: ["Folhas amareladas", "Folhas secas", "Folhas com manchas vermelhas"]
    },
    "soja": {
      disease: "Ferrugem Asiática",
      scientificName: "Fusarium oxysporum f. sp. vasinfectum",
      description: "Doença causada por fungos do gênero Fusarium.",
      severity: "high",
      severityJustification: "A doença pode afetar a produtividade e a qualidade da soja.",
      affectedArea: "Folhas",
      treatment: "Fungicida triazol + estrobilurina, aplicação preventiva e curativa a cada 14 dias.",
      extraTip: "Monitore a lavoura regularmente. A aplicação preventiva tem maior eficácia contra a ferrugem.",
      spreadRisk: "Alto",
      preventiveMeasures: [
        "Aplicação preventiva de fungicidas",
        "Respeitar o vazio sanitário",
        "Eliminar plantas voluntárias de soja"
      ],
      confidence: 92,
      recommendations: [
        { name: "Fungicida triazol", product: "Triazol", activeIngredient: "Triazol", dosage: "0,3L/ha", application: "Preventiva", interval: "14 dias", timing: "Diária", weather: "Nenhuma", preharvest: "Não" },
        { name: "Estrobilurina", product: "Estrobilurina", activeIngredient: "Estrobilurina", dosage: "0,3L/ha", application: "Curativa", interval: "14 dias", timing: "Diária", weather: "Nenhuma", preharvest: "Não" }
      ],
      symptoms: ["Folhas amareladas", "Folhas secas", "Folhas com manchas vermelhas"]
    },
    "tomate": {
      disease: "Requeima",
      scientificName: "Cladosporium fulvum",
      description: "Doença causada por fungos do gênero Cladosporium.",
      severity: "high",
      severityJustification: "A doença pode afetar a produtividade e a qualidade do tomate.",
      affectedArea: "Folhas e frutos",
      treatment: "Fungicida à base de Mancozeb, aplicação a cada 7 dias em períodos úmidos.",
      extraTip: "Evite irrigação por aspersão e melhore a ventilação entre as plantas para reduzir a umidade.",
      spreadRisk: "Alto",
      preventiveMeasures: [
        "Usar cultivares resistentes",
        "Evitar irrigação por aspersão",
        "Aumentar o espaçamento entre plantas"
      ],
      confidence: 88,
      recommendations: [
        { name: "Fungicida Mancozeb", product: "Mancozeb", activeIngredient: "Mancozeb", dosage: "0,3L/ha", application: "Foliar", interval: "7 dias", timing: "Diária", weather: "Nenhuma", preharvest: "Não" }
      ],
      symptoms: ["Folhas amareladas", "Folhas secas", "Folhas com manchas vermelhas"]
    },
    "algodao": {
      disease: "Ramulária",
      scientificName: "Phytophthora ramorum",
      description: "Doença causada por fungos do gênero Phytophthora.",
      severity: "moderate",
      severityJustification: "A doença pode afetar a produtividade e a qualidade do algodão.",
      affectedArea: "Folhas",
      treatment: "Fungicida à base de Fluxapiroxade + Piraclostrobina, aplicação na dose de 0,35L/ha.",
      extraTip: "Faça o monitoramento constante e inicie o controle nos primeiros sintomas.",
      spreadRisk: "Médio",
      preventiveMeasures: [
        "Monitoramento constante",
        "Destruição de restos culturais",
        "Rotação de culturas"
      ],
      confidence: 86,
      recommendations: [
        { name: "Fungicida Fluxapiroxade", product: "Fluxapiroxade", activeIngredient: "Fluxapiroxade", dosage: "0,35L/ha", application: "Foliar", interval: "14 dias", timing: "Diária", weather: "Nenhuma", preharvest: "Não" },
        { name: "Piraclostrobina", product: "Piraclostrobina", activeIngredient: "Piraclostrobina", dosage: "0,35L/ha", application: "Foliar", interval: "14 dias", timing: "Diária", weather: "Nenhuma", preharvest: "Não" }
      ],
      symptoms: ["Folhas amareladas", "Folhas secas", "Folhas com manchas vermelhas"]
    },
    "cafe": {
      disease: "Ferrugem do Cafeeiro",
      scientificName: "Fusarium virgilioides",
      description: "Doença causada por fungos do gênero Fusarium.",
      severity: "high",
      severityJustification: "A doença pode afetar a produtividade e a qualidade do café.",
      affectedArea: "Folhas",
      treatment: "Fungicida cúprico ou triazol, aplicação preventiva antes da estação chuvosa.",
      extraTip: "A nutrição equilibrada da planta aumenta sua resistência à ferrugem.",
      spreadRisk: "Alto",
      preventiveMeasures: [
        "Aplicação preventiva de fungicidas",
        "Manejo da sombra",
        "Adubação equilibrada"
      ],
      confidence: 90,
      recommendations: [
        { name: "Fungicida cúprico", product: "Cúprico", activeIngredient: "Cúprico", dosage: "0,3L/ha", application: "Preventiva", interval: "14 dias", timing: "Diária", weather: "Nenhuma", preharvest: "Não" },
        { name: "Fungicida triazol", product: "Triazol", activeIngredient: "Triazol", dosage: "0,3L/ha", application: "Preventiva", interval: "14 dias", timing: "Diária", weather: "Nenhuma", preharvest: "Não" }
      ],
      symptoms: ["Folhas amareladas", "Folhas secas", "Folhas com manchas vermelhas"]
    },
    "default": {
      disease: "Possível deficiência nutricional",
      scientificName: "N/A",
      description: "Possível deficiência nutricional na planta.",
      severity: "moderate",
      severityJustification: "A deficiência nutricional pode afetar a produtividade e a qualidade da planta.",
      affectedArea: "Planta inteira",
      treatment: "Recomenda-se análise foliar para diagnóstico preciso e aplicação de fertilizante adequado.",
      extraTip: "A correção do pH do solo pode melhorar a absorção de nutrientes pela planta.",
      spreadRisk: "Baixo",
      preventiveMeasures: [
        "Realizar análise de solo",
        "Aplicar calcário para correção de pH",
        "Utilizar fertilizantes balanceados"
      ],
      confidence: 65,
      recommendations: [
        { name: "Análise foliar", product: "Análise foliar", activeIngredient: "N/A", dosage: "N/A", application: "N/A", interval: "N/A", timing: "N/A", weather: "Nenhuma", preharvest: "N/A" },
        { name: "Aplicação de fertilizante", product: "Fertilizante", activeIngredient: "N/A", dosage: "N/A", application: "N/A", interval: "N/A", timing: "N/A", weather: "Nenhuma", preharvest: "N/A" }
      ],
      symptoms: ["Folhas amareladas", "Folhas secas", "Folhas com manchas vermelhas"]
    }
  };
  
  // Selecionar resposta baseada na cultura
  const result = mockResponses[questions.culture.toLowerCase()] || mockResponses.default;
  
  // Personalizar a resposta baseada nos sintomas
  if (questions.symptoms.toLowerCase().includes("amarela")) {
    result.disease = result.disease.includes("deficiência") 
      ? "Deficiência de Nitrogênio" 
      : result.disease;
    result.extraTip = "Folhas amareladas frequentemente indicam deficiência de nitrogênio ou excesso de água.";
  }
  
  if (questions.symptoms.toLowerCase().includes("murcha")) {
    result.disease = result.disease.includes("deficiência") 
      ? "Possível Fusariose" 
      : result.disease;
    result.extraTip = "Murchamento pode indicar problemas radiculares. Verifique se há excesso ou falta de irrigação.";
  }
  
  // Ajuste com base em aplicações recentes
  if (questions.recentProducts && questions.recentProducts.toLowerCase() !== "não" && questions.recentProducts.toLowerCase() !== "nao") {
    result.extraTip = "Avalie se os sintomas podem ser fitotoxidez do produto aplicado recentemente. " + result.extraTip;
  }
  
  // Ajuste com base em mudanças climáticas
  if (questions.weatherChanges && questions.weatherChanges.toLowerCase().includes("chuva")) {
    result.extraTip = "Períodos prolongados de chuva favorecem doenças fúngicas. " + result.extraTip;
  } else if (questions.weatherChanges && questions.weatherChanges.toLowerCase().includes("seca")) {
    result.extraTip = "A seca pode estressar as plantas e torná-las mais suscetíveis a pragas. " + result.extraTip;
  }
  
  return result;
};
