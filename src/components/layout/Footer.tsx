
import { Home, Leaf, ShoppingBag, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export const Footer = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || 
           (path === "/dashboard" && location.pathname === "/");
  };

  const navItems = [
    {
      icon: Home,
      label: "Início",
      path: "/dashboard",
    },
    {
      icon: Leaf,
      label: "Diagnóstico",
      path: "/diagnostico",
    },
    {
      icon: ShoppingBag,
      label: "Marketplace",
      path: "/marketplace",
    },
    {
      icon: User,
      label: "Perfil",
      path: "/profile", // This would be updated if you have a profile page
    },
  ];

  return (
    <footer className="fixed bottom-0 w-full bg-white border-t border-agro-green-200 py-2 z-20 shadow-md">
      <div className="container">
        <div className="flex justify-between items-center">
          {isMobile ? (
            <nav className="flex justify-around items-center w-full">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center",
                    isActive(item.path) ? "text-agro-green-700" : "text-agro-green-600"
                  )}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          ) : (
            <>
              <div className="text-xs text-agro-green-800">
                © 2025 AgroFácil - Inteligência para o Campo
              </div>
              <div className="flex gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-1",
                      isActive(item.path) ? "text-agro-green-700" : "text-agro-green-600"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </footer>
  );
};
