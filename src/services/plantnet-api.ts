import { ContextData } from "@/components/plant-diagnosis/ContextDataForm";
import { toast } from "sonner";

// This is the interface for the PlantNet API response
export interface PlantNetResponse {
  results: Array<{
    score: number;
    species: {
      scientificNameWithoutAuthor: string;
      scientificNameAuthorship: string;
      genus: {
        scientificNameWithoutAuthor: string;
      };
      family: {
        scientificNameWithoutAuthor: string;
      };
      commonNames?: string[];
    };
    images: Array<{
      url: {
        o: string;
        m: string;
        s: string;
      };
    }>;
  }>;
  query: {
    project: string;
    images: string[];
    organs: string[];
  };
  remainingIdentificationRequests: number;
  language: string;
  version: string;
}

// Disease diagnosis interface
export interface DiseaseDiagnosis {
  disease: string;
  scientificName: string;
  severity: string;
  affectedArea: string;
  spreadRisk: string;
  confidence: number;
  recommendations: {
    product: string;
    activeIngredient: string;
    dosage: string;
    application: string;
    timing: string;
    interval: string;
    weather: string;
    preharvest: string;
  }[];
  preventiveMeasures: string[];
  symptoms: string[];
}

// Predefined recommendations for common diseases
const diseaseRecommendations: Record<string, DiseaseDiagnosis> = {
  "ferrugem": {
    disease: "Ferrugem asiática",
    scientificName: "Phakopsora pachyrhizi",
    severity: "Moderada",
    affectedArea: "Folhas",
    spreadRisk: "Alto",
    confidence: 94,
    recommendations: [
      {
        product: "Fungicida XYZ",
        activeIngredient: "Azoxistrobina + Ciproconazol",
        dosage: "500ml/ha",
        application: "Pulverização foliar",
        timing: "Aplicar nas primeiras horas da manhã ou final da tarde",
        interval: "Reaplicar após 14-21 dias",
        weather: "Evitar aplicação com previsão de chuva nas próximas 4 horas",
        preharvest: "30 dias de carência"
      }
    ],
    preventiveMeasures: [
      "Rotação de culturas com espécies não hospedeiras",
      "Eliminação de plantas voluntárias",
      "Monitoramento constante da lavoura",
      "Plantio de variedades resistentes quando disponíveis"
    ],
    symptoms: [
      "Pequenos pontos amarelados nas folhas",
      "Lesões que evoluem para pústulas de coloração marrom",
      "Amarelecimento e queda prematura das folhas",
      "Redução do tamanho e peso dos grãos"
    ]
  },
  "clorose": {
    disease: "Clorose",
    scientificName: "Deficiência de magnésio ou ferro",
    severity: "Moderada",
    affectedArea: "Folhas",
    spreadRisk: "Baixo",
    confidence: 92,
    recommendations: [
      {
        product: "Sulfato de Magnésio",
        activeIngredient: "Magnésio (Mg)",
        dosage: "1-2% em aplicação foliar",
        application: "Pulverização foliar",
        timing: "Aplicar preferencialmente no início da manhã ou final da tarde",
        interval: "Reaplicar conforme análise de solo",
        weather: "Evitar aplicação com previsão de chuva nas próximas 2 horas",
        preharvest: "Sem carência"
      },
      {
        product: "Ureia",
        activeIngredient: "Nitrogênio (N)",
        dosage: "20-30 kg/ha",
        application: "Aplicação no solo",
        timing: "Aplicar conforme análise de solo",
        interval: "Conforme recomendação técnica",
        weather: "Aplicar em condições de umidade adequada do solo",
        preharvest: "Sem carência"
      }
    ],
    preventiveMeasures: [
      "Realizar análise de solo regularmente",
      "Corrigir pH do solo quando necessário",
      "Adubação equilibrada com macro e micronutrientes",
      "Rotação de culturas"
    ],
    symptoms: [
      "Folhas amareladas entre as nervuras",
      "Amarelecimento progressivo das folhas mais velhas",
      "Redução do crescimento",
      "Necrose em casos avançados"
    ]
  },
  "mosaico": {
    disease: "Mosaico",
    scientificName: "Potyviridae (família de vírus)",
    severity: "Alta",
    affectedArea: "Folhas e frutos",
    spreadRisk: "Alto",
    confidence: 88,
    recommendations: [
      {
        product: "Inseticida Imidacloprido",
        activeIngredient: "Imidacloprido",
        dosage: "0,3 L/ha, diluído em 200 L de água",
        application: "Pulverização foliar",
        timing: "No aparecimento dos primeiros sintomas ou vetores",
        interval: "Reaplicar a cada 10-14 dias se necessário",
        weather: "Aplicar em condições climáticas favoráveis",
        preharvest: "21 dias de carência"
      }
    ],
    preventiveMeasures: [
      "Remoção e destruição de plantas infectadas",
      "Controle de insetos vetores",
      "Uso de variedades resistentes quando disponíveis",
      "Desinfecção de ferramentas de trabalho"
    ],
    symptoms: [
      "Padrão de mosaico nas folhas (áreas verde-claras e verde-escuras)",
      "Deformação das folhas",
      "Redução do vigor da planta",
      "Frutos com manchas e deformações"
    ]
  },
  "mancha_foliar": {
    disease: "Mancha foliar",
    scientificName: "Bipolaris maydis / Exserohilum turcicum",
    severity: "Moderada",
    affectedArea: "Folhas",
    spreadRisk: "Médio",
    confidence: 90,
    recommendations: [
      {
        product: "Fungicida Triazol + Estrobilurina",
        activeIngredient: "Epoxiconazol + Piraclostrobina",
        dosage: "0,75 L/ha",
        application: "Pulverização foliar",
        timing: "No aparecimento dos primeiros sintomas",
        interval: "Reaplicar após 14-21 dias conforme necessidade",
        weather: "Evitar aplicação com previsão de chuva nas próximas 4 horas",
        preharvest: "30 dias de carência"
      }
    ],
    preventiveMeasures: [
      "Rotação de culturas",
      "Uso de variedades resistentes",
      "Manejo adequado da densidade de plantio",
      "Adubação equilibrada"
    ],
    symptoms: [
      "Lesões elípticas de coloração marrom a preta nas folhas",
      "Manchas de formato regular com bordas definidas",
      "Coalescem em condições favoráveis",
      "Secamento das folhas em casos severos"
    ]
  },
  "cigarrinha": {
    disease: "Cigarrinha-das-pastagens",
    scientificName: "Deois flavopicta / Mahanarva fimbriolata",
    severity: "Alta",
    affectedArea: "Folhas e caules",
    spreadRisk: "Alto",
    confidence: 89,
    recommendations: [
      {
        product: "Inseticida Biológico",
        activeIngredient: "Metarhizium anisopliae",
        dosage: "200-400g/ha",
        application: "Pulverização foliar",
        timing: "Aplicar no início do período chuvoso",
        interval: "Repetir após 15-20 dias se necessário",
        weather: "Evitar aplicação com previsão de chuva nas próximas 4 horas",
        preharvest: "Sem carência"
      },
      {
        product: "Inseticida Químico",
        activeIngredient: "Tiametoxam",
        dosage: "100-200g/ha",
        application: "Pulverização foliar",
        timing: "Ao identificar as primeiras ninfas",
        interval: "Conforme monitoramento da população",
        weather: "Evitar aplicação com previsão de chuva nas próximas 2 horas",
        preharvest: "14 dias de carência"
      }
    ],
    preventiveMeasures: [
      "Manter altura adequada do pasto",
      "Rotação de pastagens",
      "Diversificação de espécies forrageiras",
      "Controle biológico preventivo"
    ],
    symptoms: [
      "Manchas amarelas ou secas em formato de faixas nas folhas",
      "Espuma branca na base das plantas (ninfas)",
      "Redução do crescimento do capim",
      "Morte de touceiras em casos severos"
    ]
  },
  "formigas_cortadeiras": {
    disease: "Formigas cortadeiras",
    scientificName: "Atta spp. / Acromyrmex spp.",
    severity: "Alta",
    affectedArea: "Folhas",
    spreadRisk: "Alto",
    confidence: 91,
    recommendations: [
      {
        product: "Isca granulada",
        activeIngredient: "Fipronil / Sulfluramida",
        dosage: "8-10g por m² de formigueiro",
        application: "Distribuição próximo aos carreiros ativos",
        timing: "Aplicar em período seco, preferencialmente no final da tarde",
        interval: "Reaplicar após 15-20 dias se necessário",
        weather: "Evitar aplicação com previsão de chuva nas próximas 24 horas",
        preharvest: "Sem carência para pastagem"
      }
    ],
    preventiveMeasures: [
      "Monitoramento constante da área",
      "Identificação e mapeamento de formigueiros",
      "Controle de formigueiros jovens",
      "Manutenção de áreas de refúgio para inimigos naturais"
    ],
    symptoms: [
      "Folhas cortadas em semicírculo",
      "Ausência de folhas em touceiras",
      "Carreiros visíveis no solo",
      "Montículos de terra solta"
    ]
  },
  "braquiaria_murcha": {
    disease: "Murcha da braquiária",
    scientificName: "Rhizoctonia solani",
    severity: "Moderada",
    affectedArea: "Folhas e colmo",
    spreadRisk: "Médio",
    confidence: 85,
    recommendations: [
      {
        product: "Fungicida sistêmico",
        activeIngredient: "Azoxistrobina + Ciproconazol",
        dosage: "0,3-0,5 L/ha",
        application: "Pulverização foliar",
        timing: "Aos primeiros sintomas",
        interval: "Repetir após 14-21 dias se necessário",
        weather: "Aplicar em condições de baixa umidade",
        preharvest: "21 dias de carência"
      }
    ],
    preventiveMeasures: [
      "Rotação de pastagens",
      "Manejo adequado da altura do pasto",
      "Correção da acidez do solo",
      "Adubação equilibrada com foco em potássio"
    ],
    symptoms: [
      "Folhas com manchas irregulares marrom-avermelhadas",
      "Murcha progressiva das folhas",
      "Lesões no colmo",
      "Morte de touceiras em manchas na pastagem"
    ]
  },
  "fotossensibilizacao": {
    disease: "Fotossensibilização",
    scientificName: "Associada a Brachiaria decumbens / Pithomyces chartarum",
    severity: "Alta",
    affectedArea: "Pastagem",
    spreadRisk: "Alto para o rebanho",
    confidence: 87,
    recommendations: [
      {
        product: "Manejo preventivo",
        activeIngredient: "Não aplicável",
        dosage: "Não aplicável",
        application: "Remoção dos animais da área afetada",
        timing: "Imediato",
        interval: "Manter animais fora da área por 30-60 dias",
        weather: "Não aplicável",
        preharvest: "Não aplicável"
      }
    ],
    preventiveMeasures: [
      "Diversificação das espécies forrageiras",
      "Evitar pastejo de Brachiaria decumbens por animais jovens",
      "Suplementação com zinco e selênio para os animais",
      "Manejo rotacionado de pastagens"
    ],
    symptoms: [
      "Amarelecimento da pastagem",
      "Presença de fungo escuro nas folhas secas",
      "Lesões de pele nos animais (áreas despigmentadas)",
      "Animais procurando sombra excessivamente"
    ]
  },
  "default": {
    disease: "Problema não identificado",
    scientificName: "Não disponível",
    severity: "Desconhecida",
    affectedArea: "Planta",
    spreadRisk: "Desconhecido",
    confidence: 50,
    recommendations: [
      {
        product: "Consulta técnica",
        activeIngredient: "Não aplicável",
        dosage: "Não aplicável",
        application: "Recomenda-se o monitoramento da evolução dos sintomas",
        timing: "Não aplicável",
        interval: "Não aplicável",
        weather: "Não aplicável",
        preharvest: "Não aplicável"
      }
    ],
    preventiveMeasures: [
      "Monitoramento constante da lavoura",
      "Análise de solo",
      "Controle preventivo de pragas e doenças comuns na região",
      "Consulta a um engenheiro agrônomo local"
    ],
    symptoms: [
      "Sintomas não conclusivos ou não específicos",
      "Possível combinação de fatores bióticos e abióticos",
      "Observe a evolução dos sintomas"
    ]
  }
};

// The API key for PlantNet
const API_KEY = "2b10xZmIzbSFUbETFOXBO9Kka"; // Replace with actual API key

// Function to analyze a plant image
export const analyzePlantImage = async (
  imageBase64: string,
  contextData: ContextData
): Promise<DiseaseDiagnosis> => {
  try {
    // For a real implementation, we would call the PlantNet API here
    // This is a mock implementation that simulates the API call
    
    // In a real implementation, you would upload the image to PlantNet API
    // const response = await fetch('https://my-api.plantnet.org/v2/identify/all', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     api_key: API_KEY,
    //     images: [imageBase64],
    //     organs: ['leaf'], // Or other plant organs based on contextData
    //   }),
    // });
    
    // const data: PlantNetResponse = await response.json();
    
    // For now, let's simulate a response based on contextData
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    
    // Mock detection based on context data
    const plantType = contextData.plantType.toLowerCase();
    const symptoms = contextData.symptoms.toLowerCase();
    let detectedDisease = diseaseRecommendations.default;
    
    // Simple detection logic based on keywords in symptoms and plant types
    // Check for pasture/grass specific issues first
    if (plantType.includes('capim') || plantType.includes('pasto') || 
        plantType.includes('grama') || plantType.includes('forragem') ||
        plantType.includes('braquiaria') || plantType.includes('pastagem')) {
      
      if (symptoms.includes('espuma') || symptoms.includes('faixa') || 
          symptoms.includes('faixas amarela') || symptoms.includes('seca')) {
        detectedDisease = diseaseRecommendations.cigarrinha;
      }
      
      if (symptoms.includes('cortada') || symptoms.includes('formiga') || 
          symptoms.includes('carreiro') || symptoms.includes('desfolha')) {
        detectedDisease = diseaseRecommendations.formigas_cortadeiras;
      }
      
      if (symptoms.includes('murcha') || symptoms.includes('mancha') || 
          symptoms.includes('marrom-avermelhada') || symptoms.includes('lesão')) {
        detectedDisease = diseaseRecommendations.braquiaria_murcha;
      }
      
      if (symptoms.includes('amarelecimento') || symptoms.includes('fungo') || 
          symptoms.includes('animais') || symptoms.includes('fotossensibilização')) {
        detectedDisease = diseaseRecommendations.fotossensibilizacao;
      }
    }
    
    // Only check for generic plant diseases if not a pasture-specific issue
    if (detectedDisease === diseaseRecommendations.default) {
      if (symptoms.includes('amarela') || symptoms.includes('amarelo')) {
        if (symptoms.includes('entre nervuras') || symptoms.includes('nervura')) {
          detectedDisease = diseaseRecommendations.clorose;
        }
      }
      
      if (symptoms.includes('mancha') || symptoms.includes('manchas')) {
        detectedDisease = diseaseRecommendations.mancha_foliar;
      }
      
      if (symptoms.includes('ferrugem') || symptoms.includes('pústula') || symptoms.includes('pustula')) {
        detectedDisease = diseaseRecommendations.ferrugem;
      }
      
      if (symptoms.includes('mosaico') || symptoms.includes('padrão') || symptoms.includes('deformação')) {
        detectedDisease = diseaseRecommendations.mosaico;
      }
    }
    
    // Save the diagnosis locally
    saveDiagnosisToLocalStorage(imageBase64, detectedDisease);
    
    return detectedDisease;
  } catch (error) {
    console.error('Error analyzing plant image:', error);
    toast.error('Erro na análise', { 
      description: 'Não foi possível analisar a imagem. Tente novamente.' 
    });
    return diseaseRecommendations.default;
  }
};

// Function to save diagnosis locally for offline access
const saveDiagnosisToLocalStorage = (imageBase64: string, diagnosis: DiseaseDiagnosis) => {
  try {
    // Generate a simple key based on a hash of the image
    const key = `plant-diagnosis-${imageBase64.substring(0, 50).replace(/[^a-zA-Z0-9]/g, '')}`;
    
    const diagnosisData = {
      timestamp: new Date().toISOString(),
      image: imageBase64,
      diagnosis
    };
    
    localStorage.setItem(key, JSON.stringify(diagnosisData));
  } catch (error) {
    console.error('Error saving diagnosis to local storage:', error);
  }
};

// Function to get offline diagnoses when needed
export const getOfflineDiagnoses = () => {
  try {
    const diagnoses: Record<string, any> = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('plant-diagnosis-')) {
        const diagnosisData = localStorage.getItem(key);
        if (diagnosisData) {
          diagnoses[key] = JSON.parse(diagnosisData);
        }
      }
    }
    
    return diagnoses;
  } catch (error) {
    console.error('Error getting offline diagnoses:', error);
    return {};
  }
};
export const analyzePlantImage = async (imageBase64: string): Promise<any> => {
  try {
    const response = await fetch("https://api.plant.id/v3/health_assessment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": "otOllZci1gJz9KpwhUjsUHD15uZSAXZqNUFz1yf2y85FjNcjMD"
      },
      body: JSON.stringify({
        images: [imageBase64],
        modifiers: ["similar_images"],
        plant_language: "pt",
        disease_details: ["description", "treatment", "common_names"]
      })
    });

    const data = await response.json();
    console.log("Diagnóstico da IA recebido:", data);
    return data;
  } catch (error) {
    console.error("Erro ao chamar a API do Plant.id:", error);
    throw error;
  }
};
