
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavMenu } from "./NavMenu";
import { UserMenu } from "./UserMenu";
import { MenuIcon, Sprout } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-agro-green-700 backdrop-blur supports-[backdrop-filter]:bg-agro-green-700/90">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-agro-green-600"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
          <Link to="/" className="flex items-center space-x-2">
            <Sprout className="h-6 w-6 text-white" />
            <span className="font-bold text-xl text-white hidden md:inline-block">
              AgroFácil
            </span>
            <span className="font-bold text-xl text-white md:hidden">
              AF
            </span>
          </Link>
        </div>

        <div className="hidden md:flex">
          <NavMenu />
        </div>

        <div className="flex items-center gap-2">
          <UserMenu />
        </div>
      </div>
      
      {isNavOpen && (
        <div className="container pb-3 md:hidden border-t border-agro-green-600 pt-2">
          <NavMenu isMobile={true} />
        </div>
      )}
    </header>
  );
};
