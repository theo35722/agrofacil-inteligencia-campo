
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export const UserMenu = () => {
  const { signOut, profile } = useAuth();

  const getInitials = (name: string | null) => {
    if (!name) return "AU";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border border-agro-green-200">
            <AvatarImage src={profile?.foto_url || ""} alt={profile?.nome || "Usuário"} />
            <AvatarFallback className="bg-agro-green-100 text-agro-green-800">
              {getInitials(profile?.nome)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">{profile?.nome || "Usuário"}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {profile?.tipo_usuario || "Produtor"}
          </p>
        </div>
        <Link to="/perfil">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Meu perfil</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
