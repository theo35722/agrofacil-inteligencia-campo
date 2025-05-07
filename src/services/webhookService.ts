
interface WebhookData {
  imagem: string;
  cultura: string;
  sintomas: string;
  parte_afetada: string;
  tempo: string;
  produtos: string;
  clima: string;
  localizacao?: string;
  timestamp: string;
}

// Helper function to extract base64 from data URL
const extractBase64FromDataUrl = (dataUrl: string): string => {
  // Check if it's a valid data URL
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
    console.error('Invalid data URL format');
    return dataUrl;
  }
  
  // Split by comma and take the second part (the actual base64 data)
  const base64Data = dataUrl.split(',')[1];
  
  if (!base64Data) {
    console.error('Could not extract base64 data from URL');
    return dataUrl;
  }
  
  return base64Data;
};

export const enviarDadosParaWebhook = async (data: WebhookData): Promise<boolean> => {
  try {
    const webhookUrl = "https://hook.us2.make.com/trgfvdersyeosj0gu61p98hle6ffuzd6";
    
    // Create a copy of the data to modify
    const processedData = { ...data };
    
    // Extract just the base64 part of the image without the data URL prefix
    processedData.imagem = extractBase64FromDataUrl(data.imagem);
    
    console.log("Enviando dados para webhook:", webhookUrl);
    console.log("Base64 extraído com sucesso, primeiros 20 caracteres:", processedData.imagem.substring(0, 20) + "...");
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(processedData),
    });
    
    return response.ok;
  } catch (error) {
    console.error("Erro ao enviar dados para o webhook:", error);
    return false;
  }
};
