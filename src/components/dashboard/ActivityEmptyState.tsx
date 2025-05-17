
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const ActivityEmptyState: React.FC = () => {
  return (
    <div className="py-3 px-3 text-sm text-center text-gray-500">
      <p>Nenhuma atividade programada.</p>
      <div className="mt-2">
        <Link to="/atividades">
          <Button size="sm" variant="outline" className="text-xs border-green-300 text-green-700 hover:bg-green-50">
            Adicionar Atividade
          </Button>
        </Link>
      </div>
    </div>
  );
};
