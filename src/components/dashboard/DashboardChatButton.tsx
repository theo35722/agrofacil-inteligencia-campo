
import React, { useState } from "react";
import { ChatButton } from "@/components/chat/ChatButton";
import { ChatDialog } from "@/components/chat/ChatDialog";

export const DashboardChatButton: React.FC = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      <div className="fixed bottom-20 right-4 z-40">
        <ChatButton 
          onClick={() => setShowChat(true)} 
          isOpen={showChat} 
          className="w-12 h-12 bg-white shadow-lg border-2 border-green-300" 
        />
      </div>
      <ChatDialog open={showChat} onOpenChange={setShowChat} />
    </>
  );
};
