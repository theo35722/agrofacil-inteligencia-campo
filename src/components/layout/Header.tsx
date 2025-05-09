
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavMenu } from "./NavMenu";
import { UserMenu } from "./UserMenu";
import { MenuIcon, Sprout, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import SeuZeIcon from "@/components/icons/SeuZeIcon";

export const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isMobile = useIsMobile();

  // Fechar o menu móvel quando a tela for redimensionada para desktop
  useEffect(() => {
    if (!isMobile) {
      setIsNavOpen(false);
    }
  }, [isMobile]);

  // Fechar o menu quando clicar em um item do menu (apenas no mobile)
  const handleMenuItemClick = () => {
    if (isMobile) {
      setIsNavOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-agro-green-700 shadow-md backdrop-blur supports-[backdrop-filter]:bg-agro-green-700/90">
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
            {isMobile ? (
              <SeuZeIcon size={28} className="text-white" />
            ) : (
              <>
                <Sprout className="h-6 w-6 text-white" />
                <span className="font-bold text-xl text-white">
                  AgroFácil
                </span>
              </>
            )}
          </Link>
        </div>

        <div className="hidden md:flex">
          <NavMenu />
        </div>

        <div className="flex items-center gap-2">
          <UserMenu />
        </div>
      </div>
      
      {isMobile ? (
        <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
          <SheetContent side="left" className="p-0 w-4/5 max-w-[280px] bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <SeuZeIcon size={32} />
                <span className="font-bold text-xl text-agro-green-700">AgroFácil</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsNavOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4">
              <NavMenu isMobile={true} onItemClick={handleMenuItemClick} />
            </div>
          </SheetContent>
        </Sheet>
      ) : null}
    </header>
  );
};
