
import React, { useState, useRef, useEffect } from "react";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X, MessageSquare } from "lucide-react";
import SeuZeIcon from "../icons/SeuZeIcon";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Message = {
  id: string;
  sender: "user" | "seuze";
  text: string;
  timestamp: Date;
};

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChatDialog: React.FC<ChatDialogProps> = ({ open, onOpenChange }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "seuze",
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
    
    // Simulate Seu Zé typing response
    setTimeout(() => {
      const seuZeResponse = generateResponse(inputValue.trim());
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "seuze",
          text: seuZeResponse,
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

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] max-h-[85vh]">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SeuZeIcon size={36} />
              <div>
                <DrawerTitle>Chat com Seu Zé</DrawerTitle>
                <DrawerDescription className="flex items-center">
                  <span className="mr-2">Assistente Agrícola</span>
                  <Badge variant="outline" className="bg-green-100 text-agro-green-700">Online</Badge>
                </DrawerDescription>
              </div>
            </div>
            <DrawerClose className="p-1 rounded-full hover:bg-gray-100">
              <X className="h-5 w-5" />
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`flex items-start gap-2 max-w-[85%] ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {message.sender === "seuze" ? (
                  <div className="mt-1">
                    <SeuZeIcon size={32} />
                  </div>
                ) : (
                  <Avatar className="bg-agro-green-600 w-8 h-8 mt-1">
                    <div className="flex items-center justify-center h-full text-white text-xs font-semibold">
                      EU
                    </div>
                  </Avatar>
                )}
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-agro-green-600 text-white"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <p>{message.text}</p>
                  <small
                    className={`block text-right text-xs mt-1 ${
                      message.sender === "user" ? "text-agro-green-100" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="mt-1">
                  <SeuZeIcon size={32} />
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-0"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <DrawerFooter className="border-t p-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim()} 
              size="icon"
              className="bg-agro-green-600 hover:bg-agro-green-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-center text-gray-500 mt-1">
            Seu Zé está em versão beta. Ele está sempre aprendendo para te ajudar melhor!
          </p>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
