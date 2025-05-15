
import { Link } from "react-router-dom";
import { Home, Leaf, ShoppingBag, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export const Footer = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (!isMobile) {
    return null; // Don't show footer navigation on desktop
  }
  
  const navItems = [
    {
      icon: Home,
      label: "Início",
      href: "/dashboard",
    },
    {
      icon: Leaf,
      label: "Diagnóstico",
      href: "/diagnostico",
    },
    {
      icon: ShoppingBag,
      label: "Marketplace",
      href: "/marketplace",
    },
    {
      icon: User,
      label: "Perfil",
      href: "/perfil",
    },
  ];
  
  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/") {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex flex-col items-center px-3 py-1",
                active ? "text-agro-green-600" : "text-gray-500"
              )}
            >
              <Icon className={cn("w-6 h-6", active ? "text-agro-green-600" : "text-gray-500")} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
};
