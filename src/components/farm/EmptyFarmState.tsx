
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const EmptyFarmState = () => (
  <Card className="agro-card">
    <CardContent className="pt-6 text-center">
      <p className="text-gray-500">Nenhuma lavoura cadastrada ainda.</p>
      <p className="text-gray-500 text-sm mt-1">
        Clique no botão "Nova Lavoura" para começar
      </p>
    </CardContent>
  </Card>
);

export default EmptyFarmState;
