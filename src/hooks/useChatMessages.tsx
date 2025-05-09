
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
      text: "Olá! Sou o Seu Zé, seu assistente agrícola. Como posso te ajudar hoje?",
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
    
    // Simulate assistant typing response
    setTimeout(() => {
      const assistantResponse = generateResponse(inputValue.trim());
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          text: assistantResponse,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  // Simple response generator (to be expanded later)
  const generateResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes("olá") || lowerCaseMessage.includes("oi") || lowerCaseMessage.includes("boa")) {
      return "Olá! Tudo bem? Em que posso ajudar você hoje na sua lavoura?";
    } else if (lowerCaseMessage.includes("clima") || lowerCaseMessage.includes("tempo") || lowerCaseMessage.includes("chuva")) {
      return "Para obter informações sobre o clima atual e previsão para os próximos dias, recomendo verificar nossa seção de Clima. Deseja que eu te mostre como chegar lá?";
    } else if (lowerCaseMessage.includes("praga") || lowerCaseMessage.includes("doença") || lowerCaseMessage.includes("fungo")) {
      return "Estou vendo que você está com problemas de pragas ou doenças. Para identificar o problema, você pode usar nosso Diagnóstico de Plantas com IA. Envie uma foto da sua planta afetada e eu posso ajudar a identificar o problema!";
    } else if (lowerCaseMessage.includes("fertilizante") || lowerCaseMessage.includes("adubo")) {
      return "A aplicação correta de fertilizantes é essencial! Recomendo verificar o solo primeiro antes de aplicar qualquer produto. Posso te ajudar a encontrar um especialista em análise de solo?";
    } else {
      return "Entendi! Estou sempre aprendendo para ajudar melhor. Se precisar de orientações sobre cultivo, tratamento de pragas, clima ou qualquer outra questão agrícola, é só me perguntar!";
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
