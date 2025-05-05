
import { toast } from "sonner";

export interface DiagnosisQuestions {
  culture: string;
  symptoms: string;
  affectedArea: string;
  timeFrame: string;
  location?: string;
}

export interface DiagnosisResult {
  disease: string;
  severity: "low" | "moderate" | "high";
  affectedArea: string;
  treatment: string;
  extraTip: string;
  confidence: number;
}

// This function will eventually call the OpenAI API
// For now, we'll use mock data based on the input
export const analyzePlantWithAI = async (
  imageBase64: string,
  questions: DiagnosisQuestions
): Promise<DiagnosisResult> => {
  try {
    console.log("Analyzing plant with OpenAI...");
    console.log("Questions data:", questions);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response based on culture and symptoms for now
    // This will be replaced with actual OpenAI API call
    const mockResponses: Record<string, DiagnosisResult> = {
      "milho": {
        disease: "Ferrugem do Milho",
        severity: "moderate",
        affectedArea: "Folhas",
        treatment: "Fungicida à base de Azoxistrobina + Ciproconazol, aplicação foliar na dose de 0,3L/ha.",
        extraTip: "Rotação de culturas e escolha de variedades resistentes podem reduzir a incidência desta doença.",
        confidence: 85
      },
      "soja": {
        disease: "Ferrugem Asiática",
        severity: "high",
        affectedArea: "Folhas",
        treatment: "Fungicida triazol + estrobilurina, aplicação preventiva e curativa a cada 14 dias.",
        extraTip: "Monitore a lavoura regularmente. A aplicação preventiva tem maior eficácia contra a ferrugem.",
        confidence: 92
      },
      "tomate": {
        disease: "Requeima",
        severity: "high",
        affectedArea: "Folhas e frutos",
        treatment: "Fungicida à base de Mancozeb, aplicação a cada 7 dias em períodos úmidos.",
        extraTip: "Evite irrigação por aspersão e melhore a ventilação entre as plantas para reduzir a umidade.",
        confidence: 88
      },
      "algodao": {
        disease: "Ramulária",
        severity: "moderate",
        affectedArea: "Folhas",
        treatment: "Fungicida à base de Fluxapiroxade + Piraclostrobina, aplicação na dose de 0,35L/ha.",
        extraTip: "Faça o monitoramento constante e inicie o controle nos primeiros sintomas.",
        confidence: 86
      },
      "cafe": {
        disease: "Ferrugem do Cafeeiro",
        severity: "high",
        affectedArea: "Folhas",
        treatment: "Fungicida cúprico ou triazol, aplicação preventiva antes da estação chuvosa.",
        extraTip: "A nutrição equilibrada da planta aumenta sua resistência à ferrugem.",
        confidence: 90
      },
      "default": {
        disease: "Possível deficiência nutricional",
        severity: "moderate",
        affectedArea: "Planta inteira",
        treatment: "Recomenda-se análise foliar para diagnóstico preciso e aplicação de fertilizante adequado.",
        extraTip: "A correção do pH do solo pode melhorar a absorção de nutrientes pela planta.",
        confidence: 65
      }
    };
    
    // Select response based on culture, fallback to default if not found
    const result = mockResponses[questions.culture.toLowerCase()] || mockResponses.default;
    
    // Customize the mock response a bit based on the symptoms
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
    
    return result;
  } catch (error) {
    console.error("Error analyzing plant with AI:", error);
    toast.error("Erro ao analisar imagem com IA");
    
    // Return a fallback diagnosis
    return {
      disease: "Não foi possível completar a análise",
      severity: "moderate",
      affectedArea: "Não determinado",
      treatment: "Recomendamos consultar um agrônomo local para diagnóstico presencial.",
      extraTip: "Tire uma nova foto com melhor iluminação e maior proximidade da área afetada.",
      confidence: 0
    };
  }
};

// Future implementation for OpenAI API integration
/*
const callOpenAI = async (imageBase64: string, questions: DiagnosisQuestions) => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  const prompt = `
    Analise esta imagem de uma planta com potenciais problemas:
    
    Cultura: ${questions.culture}
    Sintomas observados: ${questions.symptoms}
    Área afetada: ${questions.affectedArea}
    Duração dos sintomas: ${questions.timeFrame}
    Localização: ${questions.location || "Não informado"}
    
    Baseado nesta imagem e informações, forneça:
    1. Nome provável da doença ou condição
    2. Nível de severidade (leve, moderado ou grave)
    3. Parte da planta mais afetada
    4. Tratamento recomendado para um produtor rural brasileiro
    5. Uma dica adicional para prevenção ou manejo sustentável
    
    Responda apenas com estas informações organizadas claramente.
  `;
  
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4-vision-preview",
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
      max_tokens: 500
    })
  });
  
  return await response.json();
};
*/
