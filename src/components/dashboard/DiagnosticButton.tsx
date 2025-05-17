
import React from "react";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DiagnosticButton: React.FC = () => {
  return (
    <Link to="/diagnostico" className="mx-4">
      <Button className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-sm flex items-center justify-center gap-2">
        <Leaf className="w-5 h-5" />
        <div className="text-base font-medium">Fazer Diagnóstico de Planta</div>
      </Button>
    </Link>
  );
};
