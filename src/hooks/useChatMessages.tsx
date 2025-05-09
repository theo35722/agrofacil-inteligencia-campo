
import { useState, useEffect, useRef } from "react";

export type Message = {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: Date;
};

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "assistant",
      text: "Ô de casa! Eu sou o Seu Calunga, bicho sabido da roça. Tô aqui pra ajudar no que precisar: plantio, criação, pastagem ou qualquer aperreio do campo!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue.trim(),
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsTyping(true);
    
    // Enviar para a API
    generateAIResponse(inputValue.trim())
      .then((aiResponse) => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "assistant",
            text: aiResponse,
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
      })
      .catch((error) => {
        console.error("Erro ao gerar resposta:", error);
        // Fallback para resposta local em caso de falha
        const fallbackResponse = generateLocalResponse(inputValue.trim());
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "assistant",
            text: fallbackResponse,
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
      });
  };

  // Função para enviar mensagem à API
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('generate-calunga-response', {
        body: {
          userMessage,
        }
      });

      if (error) throw new Error(error.message);
      if (!data?.response) throw new Error("Resposta vazia");
      
      return data.response;
    } catch (error) {
      console.error("Erro chamando a edge function:", error);
      throw error;
    }
  };

  // Gerador de respostas local (fallback)
  const generateLocalResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes("olá") || lowerCaseMessage.includes("oi") || lowerCaseMessage.includes("boa")) {
      return "Salve, parceiro! Como vai a vida na roça? Tô aqui pra te ajudar com o que precisar na sua lavoura!";
    } else if (lowerCaseMessage.includes("clima") || lowerCaseMessage.includes("tempo") || lowerCaseMessage.includes("chuva")) {
      return "Rapaz, pra saber do tempo e da chuva, é só dar uma espiada na seção de Clima. Os cabra lá entende das nuvem! Quer que eu te mostre como chegar?";
    } else if (lowerCaseMessage.includes("praga") || lowerCaseMessage.includes("doença") || lowerCaseMessage.includes("fungo")) {
      return "Eita, tá com praga na lavoura, caboco? Me manda uma foto da planta sofrendo que eu vou te ajudar a descobrir o problema e resolver esse aperreio!";
    } else if (lowerCaseMessage.includes("fertilizante") || lowerCaseMessage.includes("adubo")) {
      return "Adubo bom é coisa séria, parceiro! Melhor ver como tá o solo antes de sair jogando produto. Vamos caprichar na análise pra deixar sua terra nos trinque!";
    } else {
      return "Entendido, meu cabra! Tô aqui aprendendo pra te ajudar cada vez melhor. Se tiver com algum aperreio na lavoura, com plantio, pragas, ou o bicho tiver pegando aí no campo, é só chamar o Seu Calunga!";
    }
  };

  return {
    messages,
    inputValue,
    isTyping,
    messagesEndRef,
    handleInputChange,
    handleKeyPress,
    handleSendMessage
  };
};

export default useChatMessages;
