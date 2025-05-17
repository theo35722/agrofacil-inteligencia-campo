
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudOff, CloudSun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface WeatherFallbackProps {
  error?: string;
}

export const WeatherFallback = ({ error }: WeatherFallbackProps) => {
  return (
    <Card className="agro-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-agro-green-800 flex justify-between items-center">
          <span>Previsão do Tempo</span>
          <CloudSun className="h-5 w-5 text-agro-blue-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-4">
          <CloudOff className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-center text-gray-600 mb-2">
            {error || "Não foi possível carregar a previsão do tempo"}
          </p>
          <Link to="/clima">
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Ver detalhes
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
