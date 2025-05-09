
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
      text: "E aí, parceiro! Eu sou o Seu Calunga, cabra vivido no campo. Fala comigo que eu te ajudo com o que for: praga, plantio, tempo ou aperreio!",
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
      return "Salve, parceiro! Como vai a vida na roça? Tô aqui pra te ajudar com o que precisar na sua lavoura!";
    } else if (lowerCaseMessage.includes("clima") || lowerCaseMessage.includes("tempo") || lowerCaseMessage.includes("chuva")) {
      return "Pra saber do tempo e da chuva, é só dar uma olhada na seção de Clima. Quer que eu te mostre como chegar lá?";
    } else if (lowerCaseMessage.includes("praga") || lowerCaseMessage.includes("doença") || lowerCaseMessage.includes("fungo")) {
      return "Tá com praga na lavoura? Me manda uma foto da planta sofrendo que eu vou te ajudar a descobrir o problema e resolver o aperreio!";
    } else if (lowerCaseMessage.includes("fertilizante") || lowerCaseMessage.includes("adubo")) {
      return "Adubo bom é coisa séria! Melhor ver como tá o solo antes de sair jogando produto. Quer que eu te indique alguém pra analisar sua terra?";
    } else {
      return "Entendido, parceiro! Tô aqui aprendendo pra te ajudar cada vez melhor. Se precisar de ajuda com plantio, pragas, clima ou qualquer outro aperreio da roça, é só chamar!";
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
