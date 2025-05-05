
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface ResultCardProps {
  result: any;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const isHealthy = !String(result).includes("⚠️");
  
  return (
    <Card className="w-full mt-4 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {isHealthy ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <p className="text-base text-gray-900 whitespace-pre-line">{result}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
