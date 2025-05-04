
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavMenu } from "./NavMenu";

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-agro-green-500 shadow-md">
      <div className="container flex h-14 items-center text-white">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="p-0 text-white hover:bg-agro-green-600 md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menu de navegação</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-white">
                <NavMenu className="flex flex-col space-y-4 mt-8" />
              </SheetContent>
            </Sheet>
            
            <a href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">
                AgroFácil
              </span>
            </a>
          </div>
          
          <NavMenu className="hidden md:flex md:space-x-4" />
        </div>
      </div>
    </header>
  );
};
