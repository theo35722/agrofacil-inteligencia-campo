
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Thermometer, 
  CloudSun,
  Leaf, 
  CalendarDays, 
  BookOpen
} from "lucide-react";

type NavMenuProps = {
  className?: string;
  isMobile?: boolean;
};

export const NavMenu = ({ className, isMobile }: NavMenuProps) => {
  const navItems = [
    { name: "Início", path: "/", icon: Home },
    { name: "Diagnóstico", path: "/diagnostico", icon: Leaf },
    { name: "Clima", path: "/clima", icon: CloudSun },
    { name: "Lavouras", path: "/lavouras", icon: Thermometer },
    { name: "Atividades", path: "/atividades", icon: CalendarDays },
    { name: "Boas Práticas", path: "/boas-praticas", icon: BookOpen },
  ];

  return (
    <nav className={cn("flex flex-col md:flex-row gap-4", isMobile ? "py-2" : "", className)}>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "text-agro-green-700 font-medium hover:text-agro-green-200 transition-colors flex items-center gap-2",
              isMobile ? "" : "md:text-white md:hover:text-agro-green-200"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
