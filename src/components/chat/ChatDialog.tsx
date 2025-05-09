
import React from "react";
import { 
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInputBar from "./ChatInputBar";
import useChatMessages from "@/hooks/useChatMessages";

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChatDialog: React.FC<ChatDialogProps> = ({ open, onOpenChange }) => {
  const {
    messages,
    inputValue,
    isTyping,
    messagesEndRef,
    handleInputChange,
    handleKeyPress,
    handleSendMessage
  } = useChatMessages();

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] max-h-[85vh]">
        <ChatHeader />
        
        <ChatMessages 
          messages={messages}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
        />

        <ChatInputBar
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onSendMessage={handleSendMessage}
        />
      </DrawerContent>
    </Drawer>
  );
};

export default ChatDialog;
