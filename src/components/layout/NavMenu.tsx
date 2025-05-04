
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type NavMenuProps = {
  className?: string;
};

export const NavMenu = ({ className }: NavMenuProps) => {
  const navItems = [
    { name: "Início", path: "/" },
    { name: "Diagnóstico", path: "/diagnostico" },
    { name: "Clima", path: "/clima" },
    { name: "Lavouras", path: "/lavouras" },
    { name: "Atividades", path: "/atividades" },
    { name: "Boas Práticas", path: "/boas-praticas" },
  ];

  return (
    <nav className={cn("items-center", className)}>
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className="text-agro-green-700 md:text-white font-medium hover:text-agro-green-200 md:hover:text-agro-green-200 transition-colors"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};
