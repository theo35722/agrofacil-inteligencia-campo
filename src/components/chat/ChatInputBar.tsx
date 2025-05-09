
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { DrawerFooter } from "@/components/ui/drawer";

interface ChatInputBarProps {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
}

const ChatInputBar: React.FC<ChatInputBarProps> = ({
  inputValue,
  onInputChange,
  onKeyPress,
  onSendMessage,
}) => {
  return (
    <DrawerFooter className="border-t p-3">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Digite sua mensagem..."
          value={inputValue}
          onChange={onInputChange}
          onKeyPress={onKeyPress}
          className="flex-1"
        />
        <Button 
          onClick={onSendMessage} 
          disabled={!inputValue.trim()} 
          size="icon"
          className="bg-agro-green-600 hover:bg-agro-green-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-center text-gray-500 mt-1">
        Seu Zé está sempre aprendendo para te ajudar melhor na sua lavoura!
      </p>
    </DrawerFooter>
  );
};

export default ChatInputBar;
