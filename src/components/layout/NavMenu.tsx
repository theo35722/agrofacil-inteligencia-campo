
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Thermometer, 
  CloudSun,
  Leaf, 
  CalendarDays, 
  BookOpen,
  ShoppingBag
} from "lucide-react";

type NavMenuProps = {
  className?: string;
  isMobile?: boolean;
  onItemClick?: () => void;
};

export const NavMenu = ({ className, isMobile, onItemClick }: NavMenuProps) => {
  const location = useLocation();
  
  const navItems = [
    { name: "Início", path: "/dashboard", icon: Home },
    { name: "Diagnóstico", path: "/diagnostico", icon: Leaf },
    { name: "Clima", path: "/clima", icon: CloudSun },
    { name: "Lavouras", path: "/lavouras", icon: Thermometer },
    { name: "Atividades", path: "/atividades", icon: CalendarDays },
    { name: "Boas Práticas", path: "/boas-praticas", icon: BookOpen },
    { name: "Marketplace", path: "/marketplace", icon: ShoppingBag },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={cn(
      "flex flex-col md:flex-row gap-3", 
      isMobile ? "py-2" : "", 
      className
    )}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        
        return (
          <Link
            key={item.name}
            to={item.path}
            onClick={onItemClick}
            className={cn(
              "text-agro-green-700 font-medium transition-colors flex items-center gap-2 py-3 px-3 rounded-md",
              active ? "bg-agro-green-100" : "",
              isMobile ? "justify-between" : "md:text-white md:hover:text-agro-green-200",
              isMobile && active ? "bg-agro-green-100" : "",
              !isMobile && active ? "md:bg-agro-green-600" : ""
            )}
          >
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </div>
            {isMobile && active && (
              <div className="h-2 w-2 rounded-full bg-agro-green-600"></div>
            )}
          </Link>
        );
      })}
    </nav>
  );
};
