
import { Bell, MessageCircle, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

export const Footer = () => {
  // Simula ter 3 notificações
  const notificationCount = 3;
  const isMobile = useIsMobile();

  return (
    <footer className="fixed bottom-0 w-full bg-white border-t border-agro-green-200 py-2 z-20 shadow-sm">
      <div className="container">
        <div className="flex justify-between items-center">
          {isMobile ? (
            <nav className="flex justify-around items-center w-full">
              <Link to="/" className="flex flex-col items-center text-agro-green-600">
                <Bell className="h-6 w-6" />
                <span className="text-xs mt-1">Início</span>
              </Link>
              
              <Link to="/notificacoes" className="relative flex flex-col items-center text-agro-green-600">
                <div className="relative">
                  <Bell className="h-6 w-6" />
                  {notificationCount > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 p-0 min-w-5 h-5 flex items-center justify-center"
                    >
                      {notificationCount}
                    </Badge>
                  )}
                </div>
                <span className="text-xs mt-1">Notificações</span>
              </Link>
              
              <Link to="/chat" className="flex flex-col items-center text-agro-green-600">
                <MessageCircle className="h-6 w-6" />
                <span className="text-xs mt-1">Chat</span>
              </Link>
              
              <Link to="/sobre" className="flex flex-col items-center text-agro-green-600">
                <Info className="h-6 w-6" />
                <span className="text-xs mt-1">Sobre</span>
              </Link>
            </nav>
          ) : (
            <>
              <div className="text-xs text-agro-green-800">
                © 2025 AgroFácil - Inteligência para o Campo
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/notificacoes" className="relative">
                      <Bell className="h-6 w-6 text-agro-green-600" />
                      {notificationCount > 0 && (
                        <Badge 
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 p-0 min-w-5 h-5 flex items-center justify-center"
                        >
                          {notificationCount}
                        </Badge>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ver notificações</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </div>
    </footer>
  );
};
