
import React from "react";
import ChatMessage from "./ChatMessage";
import { Message } from "@/hooks/useChatMessages";
import { Avatar } from "@/components/ui/avatar";

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isTyping,
  messagesEndRef,
}) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {isTyping && (
        <div className="flex justify-start mb-4">
          <div className="flex items-start gap-2 max-w-[85%]">
            <Avatar className="w-8 h-8 mt-1">
              <img 
                src="/lovable-uploads/8ac540a4-ed74-4c29-98a2-22f75a415068.png"
                alt="Seu Calunga"
                className="h-full w-full object-cover"
              />
            </Avatar>
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
  );
};

export default ChatMessages;
