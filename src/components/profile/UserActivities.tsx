
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, Activity, Leaf } from "lucide-react";

export const UserActivities = () => {
  // Mock data - in a real app, this would come from an API call or context
  const lastDiagnosis = {
    name: "Ferrugem Asiática",
    culture: "Soja",
    date: "23 de maio"
  };
  
  const lastActivity = {
    type: "Irrigação",
    date: "21 de maio"
  };
  
  const lastAccess = "Hoje, 10:45";

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Activity className="h-5 w-5 mr-2 text-green-600" />
          Histórico de Atividades
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="rounded-full bg-green-100 p-2 mr-3">
              <Leaf className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Último diagnóstico</h3>
              <p className="text-xs text-gray-500">
                {lastDiagnosis.name} em {lastDiagnosis.culture} • {lastDiagnosis.date}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="rounded-full bg-blue-100 p-2 mr-3">
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Última atividade</h3>
              <p className="text-xs text-gray-500">
                {lastActivity.type} • {lastActivity.date}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="rounded-full bg-gray-100 p-2 mr-3">
              <Clock className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Último acesso</h3>
              <p className="text-xs text-gray-500">{lastAccess}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
