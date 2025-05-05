
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { getDetailedDiagnosis } from "@/services/plantnet-api";

interface ResultCardProps {
  result: any;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  // Check if result is an object with API response structure
  if (result && typeof result === 'object' && 'health_assessment' in result) {
    const diagnosis = getDetailedDiagnosis(result);
    const isHealthy = diagnosis.disease === "Planta Saudável";
    
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
              <h3 className="text-lg font-semibold">{diagnosis.disease}</h3>
              <p className="text-sm text-gray-600">{diagnosis.scientificName}</p>
              <div className="mt-2">
                <p className="text-sm mb-1">Sintomas detectados:</p>
                <ul className="text-sm pl-2">
                  {diagnosis.symptoms.map((symptom, index) => (
                    <li key={index} className="mb-1">• {symptom}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Fallback for string results or other formats
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
            <p className="text-base text-gray-900 whitespace-pre-line">
              {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
