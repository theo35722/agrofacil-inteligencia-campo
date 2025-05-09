
import { Bell, MessageCircle, Info, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const Footer = () => {
  // Simula ter 3 notificações
  const notificationCount = 3;
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <footer className="fixed bottom-0 w-full bg-white border-t border-agro-green-200 py-2 z-20 shadow-md">
      <div className="container">
        <div className="flex justify-between items-center">
          {isMobile ? (
            <nav className="flex justify-around items-center w-full">
              <Link 
                to="/" 
                className={cn(
                  "flex flex-col items-center",
                  isActive("/") ? "text-agro-green-700" : "text-agro-green-600"
                )}
              >
                <Home className="h-6 w-6" />
                <span className="text-xs mt-1 font-medium">Início</span>
              </Link>
              
              <Link 
                to="/notificacoes" 
                className={cn(
                  "relative flex flex-col items-center",
                  isActive("/notificacoes") ? "text-agro-green-700" : "text-agro-green-600"
                )}
              >
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
                <span className="text-xs mt-1 font-medium">Notificações</span>
              </Link>
              
              <Link 
                to="/diagnostico" 
                className={cn(
                  "flex flex-col items-center",
                  isActive("/diagnostico") ? "text-agro-green-700" : "text-agro-green-600"
                )}
              >
                <MessageCircle className="h-6 w-6" />
                <span className="text-xs mt-1 font-medium">Diagnóstico</span>
              </Link>
              
              <Link 
                to="/sobre" 
                className={cn(
                  "flex flex-col items-center",
                  isActive("/sobre") ? "text-agro-green-700" : "text-agro-green-600"
                )}
              >
                <Info className="h-6 w-6" />
                <span className="text-xs mt-1 font-medium">Sobre</span>
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
