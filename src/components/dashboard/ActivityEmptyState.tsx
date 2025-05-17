
import React from "react";
import { Link } from "react-router-dom";

export const ActivityEmptyState: React.FC = () => {
  return (
    <div className="py-2 px-3 text-sm text-center text-gray-500">
      <p>Nenhuma atividade programada.</p>
      <Link 
        to="/atividades" 
        className="mt-2 text-green-600 hover:text-green-700 inline-block"
      >
        Adicionar atividade
      </Link>
    </div>
  );
};
