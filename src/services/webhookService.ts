
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

export const enviarDadosParaWebhook = async (data: WebhookData): Promise<boolean> => {
  try {
    const webhookUrl = "https://hook.us2.make.com/trgfvdersyeosj0gu61p98hle6ffuzd6";
    
    console.log("Enviando dados para webhook:", webhookUrl);
    console.log("Primeiros 50 caracteres da imagem:", data.imagem.substring(0, 50) + "...");
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    return response.ok;
  } catch (error) {
    console.error("Erro ao enviar dados para o webhook:", error);
    return false;
  }
};
