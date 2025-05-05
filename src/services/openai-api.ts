
export interface DiagnosisQuestions {
  culture: string;
  symptoms: string;
  affectedArea: string;
  timeFrame: string;
  recentProducts?: string;
  weatherChanges?: string;
  location?: string;
}

export interface DiagnosisResult {
  disease: string;
  severity: "low" | "moderate" | "high";
  affectedArea: string;
  treatment: string;
  extraTip: string;
  spreadRisk?: string;
  preventiveMeasures?: string[];
  confidence: number;
}

// This function will eventually call the OpenAI API
// For now, we'll use mock data based on the input
export const analyzePlantWithAI = async (
  imageBase64: string,
  questions: DiagnosisQuestions
): Promise<DiagnosisResult> => {
  try {
    console.log("Analisando planta com OpenAI...");
    console.log("Dados do questionário:", questions);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Respostas simuladas baseadas na cultura e sintomas
    // Isso será substituído pela chamada real à API da OpenAI
    const mockResponses: Record<string, DiagnosisResult> = {
      "milho": {
        disease: "Ferrugem do Milho",
        severity: "moderate",
        affectedArea: "Folhas",
        treatment: "Fungicida à base de Azoxistrobina + Ciproconazol, aplicação foliar na dose de 0,3L/ha.",
        extraTip: "Rotação de culturas e escolha de variedades resistentes podem reduzir a incidência desta doença.",
        spreadRisk: "Médio",
        preventiveMeasures: [
          "Utilizar variedades resistentes",
          "Fazer rotação de culturas",
          "Monitorar a lavoura regularmente"
        ],
        confidence: 85
      },
      "soja": {
        disease: "Ferrugem Asiática",
        severity: "high",
        affectedArea: "Folhas",
        treatment: "Fungicida triazol + estrobilurina, aplicação preventiva e curativa a cada 14 dias.",
        extraTip: "Monitore a lavoura regularmente. A aplicação preventiva tem maior eficácia contra a ferrugem.",
        spreadRisk: "Alto",
        preventiveMeasures: [
          "Aplicação preventiva de fungicidas",
          "Respeitar o vazio sanitário",
          "Eliminar plantas voluntárias de soja"
        ],
        confidence: 92
      },
      "tomate": {
        disease: "Requeima",
        severity: "high",
        affectedArea: "Folhas e frutos",
        treatment: "Fungicida à base de Mancozeb, aplicação a cada 7 dias em períodos úmidos.",
        extraTip: "Evite irrigação por aspersão e melhore a ventilação entre as plantas para reduzir a umidade.",
        spreadRisk: "Alto",
        preventiveMeasures: [
          "Usar cultivares resistentes",
          "Evitar irrigação por aspersão",
          "Aumentar o espaçamento entre plantas"
        ],
        confidence: 88
      },
      "algodao": {
        disease: "Ramulária",
        severity: "moderate",
        affectedArea: "Folhas",
        treatment: "Fungicida à base de Fluxapiroxade + Piraclostrobina, aplicação na dose de 0,35L/ha.",
        extraTip: "Faça o monitoramento constante e inicie o controle nos primeiros sintomas.",
        spreadRisk: "Médio",
        preventiveMeasures: [
          "Monitoramento constante",
          "Destruição de restos culturais",
          "Rotação de culturas"
        ],
        confidence: 86
      },
      "cafe": {
        disease: "Ferrugem do Cafeeiro",
        severity: "high",
        affectedArea: "Folhas",
        treatment: "Fungicida cúprico ou triazol, aplicação preventiva antes da estação chuvosa.",
        extraTip: "A nutrição equilibrada da planta aumenta sua resistência à ferrugem.",
        spreadRisk: "Alto",
        preventiveMeasures: [
          "Aplicação preventiva de fungicidas",
          "Manejo da sombra",
          "Adubação equilibrada"
        ],
        confidence: 90
      },
      "default": {
        disease: "Possível deficiência nutricional",
        severity: "moderate",
        affectedArea: "Planta inteira",
        treatment: "Recomenda-se análise foliar para diagnóstico preciso e aplicação de fertilizante adequado.",
        extraTip: "A correção do pH do solo pode melhorar a absorção de nutrientes pela planta.",
        spreadRisk: "Baixo",
        preventiveMeasures: [
          "Realizar análise de solo",
          "Aplicar calcário para correção de pH",
          "Utilizar fertilizantes balanceados"
        ],
        confidence: 65
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
  } catch (error) {
    console.error("Erro ao analisar planta com IA:", error);
    
    // Retornar um diagnóstico de fallback
    return {
      disease: "Não foi possível completar a análise",
      severity: "moderate",
      affectedArea: "Não determinado",
      treatment: "Recomendamos consultar um agrônomo local para diagnóstico presencial.",
      extraTip: "Tire uma nova foto com melhor iluminação e maior proximidade da área afetada.",
      spreadRisk: "Desconhecido",
      preventiveMeasures: [
        "Consulte um agrônomo local",
        "Tire fotos mais claras da área afetada"
      ],
      confidence: 0
    };
  }
};

// Future implementation for OpenAI API integration
/*
const callOpenAI = async (imageBase64: string, questions: DiagnosisQuestions) => {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  
  const prompt = `
    Sua função é agir como um agrônomo digital brasileiro. Analise a imagem da planta e as informações fornecidas:
    
    Cultura: ${questions.culture}
    Sintomas observados: ${questions.symptoms}
    Parte afetada: ${questions.affectedArea}
    Duração dos sintomas: ${questions.timeFrame}
    Produtos aplicados recentemente: ${questions.recentProducts || "Não informado"}
    Mudanças climáticas: ${questions.weatherChanges || "Não informado"}
    Localização: ${questions.location || "Não informado"}
    
    Baseado nesta imagem e informações, forneça:
    1. Nome provável da doença ou condição
    2. Nível de severidade (leve, moderado ou grave)
    3. Parte da planta mais afetada
    4. Risco de disseminação (baixo, médio, alto)
    5. Tratamento recomendado para um produtor rural brasileiro
    6. 3 medidas preventivas para safras futuras
    7. Uma dica adicional para manejo sustentável
    
    Responda apenas com estas informações organizadas claramente.
  `;
  
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
  
  return await response.json();
};
*/
