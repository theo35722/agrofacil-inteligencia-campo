
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Plus } from "lucide-react";

export const ActivityEmptyState: React.FC = () => {
  return (
    <div className="py-3 px-3 text-sm text-center text-gray-500">
      <div className="flex justify-center mb-2">
        <CalendarCheck className="h-10 w-10 text-gray-300" />
      </div>
      <p>Nenhuma atividade registrada.</p>
      <div className="mt-2">
        <Link to="/atividades">
          <Button size="sm" variant="outline" className="text-xs border-green-300 text-green-700 hover:bg-green-50">
            <Plus className="h-3 w-3 mr-1" />
            Adicionar Atividade
          </Button>
        </Link>
      </div>
    </div>
  );
};
