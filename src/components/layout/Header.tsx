
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavMenu } from "./NavMenu";
import { UserMenu } from "./UserMenu";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-agro-green-700 hidden md:inline-block">
              AgroFácil
            </span>
            <span className="font-bold text-xl text-agro-green-700 md:hidden">
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
        <div className="container pb-3 md:hidden">
          <NavMenu isMobile />
        </div>
      )}
    </header>
  );
};
