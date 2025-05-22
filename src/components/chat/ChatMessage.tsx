
import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { type Message } from "@/hooks/useChatMessages";
import { useAuth } from "@/contexts/AuthContext";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { profile } = useAuth();
  
  const getInitials = (name: string | null) => {
    if (!name) return "AU";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`flex items-start gap-2 max-w-[85%] ${
          message.sender === "user" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {message.sender === "assistant" ? (
          <Avatar className="w-8 h-8 mt-1">
            <img 
              src="/lovable-uploads/8ac540a4-ed74-4c29-98a2-22f75a415068.png"
              alt="Seu Calunga"
              className="h-full w-full object-cover"
            />
          </Avatar>
        ) : (
          <Avatar className="w-8 h-8 mt-1">
            {profile?.foto_url ? (
              <img 
                src={profile.foto_url}
                alt={profile.nome || "Usuário"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-agro-green-600 text-white text-xs font-semibold">
                {getInitials(profile?.nome)}
              </div>
            )}
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
  );
};

export default ChatMessage;
