
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Lidar com solicitações CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Obter a chave da API OpenAI do ambiente
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      console.error("OPENAI_API_KEY não configurada");
      throw new Error("OPENAI_API_KEY não configurada");
    }

    // Analisar o corpo da solicitação
    const requestData = await req.json();
    const { messageHistory } = requestData;

    if (!messageHistory || !Array.isArray(messageHistory) || messageHistory.length === 0) {
      console.error("Histórico de mensagens não fornecido ou inválido");
      throw new Error("Histórico de mensagens não fornecido ou inválido");
    }

    // Extrair a mensagem mais recente para logging
    const latestMessage = messageHistory.find(msg => msg.role === "user");
    const userMessagePreview = latestMessage ? latestMessage.content.substring(0, 20) + "..." : "Nenhuma mensagem do usuário";

    // Log para depuração
    console.log("Chave API encontrada e histórico recebido com", messageHistory.length, "mensagens. Última mensagem:", userMessagePreview);

    // Definir o prompt do Seu Calunga
    const calungaPrompt = `
      Você é o Seu Calunga, um agricultor nordestino vivido e respeitado, que entende de tudo na vida do campo. 
      Seu jeito é simples, acolhedor e direto, falando como um cabra da roça, com expressões como "caboco", 
      "parceiro", "caprichar", "nos trinque", "bicho pegando" e "aperreio".

      Ajude o usuário com sabedoria prática em temas como lavoura, pragas, clima, plantio, adubação, 
      pastagem, criação de gado, suinocultura, avicultura, infraestrutura rural, sanidade animal, 
      manejo de água, trator e ferramentas, e qualquer outro assunto da roça.

      Sempre responda com clareza, bom humor e aquele jeitão de quem sabe o que tá dizendo. 
      Você é um verdadeiro parceiro do produtor rural.
      
      Mantenha suas respostas concisas, entre 2-4 frases.

      IMPORTANTE: Você DEVE se referir a conversas anteriores quando o contexto for relevante. Mantenha continuidade na conversa.
    `;

    // Limite o número de mensagens para não exceder o limite de tokens
    // Mantenha o sistema + até 10 mensagens anteriores
    const systemMessage = { role: "system", content: calungaPrompt };
    let limitedHistory = messageHistory.slice(-10);
    
    // Montar o array de mensagens com o sistema primeiro
    const messages = [systemMessage, ...limitedHistory];

    console.log("Chamando API OpenAI com", messages.length, "mensagens no histórico");

    // Chamar a API da OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.7,
        max_tokens: 150
      }),
    });

    console.log("Status da resposta OpenAI:", response.status);

    // Verificar se a resposta foi bem-sucedida
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro da API OpenAI (${response.status}): ${errorText}`);
      throw new Error(`Erro ao chamar API OpenAI: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Verificar se há um erro na resposta da API
    if (data.error) {
      console.error("Erro da API OpenAI:", data.error);
      throw new Error(`OpenAI API Error: ${data.error.message}`);
    }

    // Extrair a resposta gerada
    const aiResponse = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : "Eita, tive um aperreio aqui. Vamos tentar de novo, parceiro?";

    console.log("Resposta gerada com sucesso:", aiResponse.substring(0, 20) + "...");

    // Retornar a resposta
    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Erro:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro desconhecido", fallback: true }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
