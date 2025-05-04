
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type NavMenuProps = {
  className?: string;
  isMobile?: boolean;
};

export const NavMenu = ({ className, isMobile }: NavMenuProps) => {
  const navItems = [
    { name: "Início", path: "/" },
    { name: "Diagnóstico", path: "/diagnostico" },
    { name: "Clima", path: "/clima" },
    { name: "Lavouras", path: "/lavouras" },
    { name: "Atividades", path: "/atividades" },
    { name: "Boas Práticas", path: "/boas-praticas" },
  ];

  return (
    <nav className={cn("flex flex-col md:flex-row gap-4", isMobile ? "py-2" : "", className)}>
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={cn(
            "text-agro-green-700 font-medium hover:text-agro-green-200 transition-colors",
            isMobile ? "" : "md:text-white md:hover:text-agro-green-200"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};
