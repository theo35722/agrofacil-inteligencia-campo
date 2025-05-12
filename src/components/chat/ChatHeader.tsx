
import React from "react";
import { 
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose
} from "@/components/ui/drawer";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const ChatHeader: React.FC = () => {
  return (
    <DrawerHeader className="border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <img 
              src="/lovable-uploads/8ac540a4-ed74-4c29-98a2-22f75a415068.png"
              alt="Seu Calunga"
              className="h-full w-full object-cover"
            />
          </Avatar>
          <div>
            <DrawerTitle className="text-base">Seu Calunga</DrawerTitle>
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-500">Especialista Agrícola</span>
              <Badge variant="outline" className="bg-green-100 text-agro-green-700">Online</Badge>
            </div>
          </div>
        </div>
        <DrawerClose className="p-1 rounded-full hover:bg-gray-100">
          <X className="h-5 w-5" />
        </DrawerClose>
      </div>
    </DrawerHeader>
  );
};

export default ChatHeader;
