
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  CheckCircle2,
  Leaf,
  FlaskConical,
  LightbulbIcon,
  Share2,
  RefreshCw,
  Shield,
  TrendingUp,
  Info,
  Microscope
} from "lucide-react";
import { DiagnosisResult } from "@/services/openai-api";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ResultCardProps {
  result: DiagnosisResult;
  onNewAnalysis: () => void;
}

const ResultCardEn: React.FC<ResultCardProps> = ({ result, onNewAnalysis }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "low":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "moderate":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-gray-600" />;
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "low":
        return "Low";
      case "moderate":
        return "Moderate";
      case "high":
        return "Severe";
      default:
        return "Undetermined";
    }
  };

  const getSpreadRiskColor = (risk?: string) => {
    if (!risk) return "bg-gray-100 text-gray-600";
    
    switch (risk.toLowerCase()) {
      case "baixo":
      case "low":
        return "bg-green-50 text-green-700";
      case "médio":
      case "medium":
        return "bg-yellow-50 text-yellow-700";
      case "alto":
      case "high":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Diagnosis: ${result.disease}`,
          text: `Plant diagnosis: ${result.disease}\nSeverity: ${getSeverityText(result.severity)}\nTreatment: ${result.treatment}`,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      alert("Sharing feature not available in your browser");
    }
  };

  return (
    <Card className="w-full mt-4 shadow-md overflow-hidden">
      <div className={`w-full p-3 ${getSeverityColor(result.severity)}`}>
        <div className="flex items-center">
          {getSeverityIcon(result.severity)}
          <span className="ml-2 font-medium">
            {getSeverityText(result.severity)}
          </span>
          {result.severityJustification && (
            <span className="ml-2 text-xs">
              {" - "}{result.severityJustification}
            </span>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Disease Name */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{result.disease}</h3>
            {result.scientificName && (
              <p className="text-xs text-gray-600 italic">{result.scientificName}</p>
            )}
            <div className="flex justify-between items-center mt-1">
              <Badge variant="outline" className="text-xs px-2 py-0">
                {result.affectedArea}
              </Badge>
              {result.confidence > 0 && (
                <Badge variant="secondary" className="text-xs px-2 py-0">
                  {result.confidence}% confidence
                </Badge>
              )}
            </div>
          </div>
          
          {/* Disease Description */}
          {result.description && (
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <p className="text-gray-700">{result.description}</p>
            </div>
          )}
          
          <Separator />
          
          {/* Risk & Severity Info */}
          <div className="grid grid-cols-2 gap-3">
            {/* Severity Info */}
            <div className={`${getSeverityColor(result.severity)} p-2 rounded-md`}>
              <div className="flex items-center mb-1">
                {getSeverityIcon(result.severity)}
                <h4 className="text-sm font-medium ml-2">Severity</h4>
              </div>
              <p className="text-sm ml-7">{getSeverityText(result.severity)}</p>
            </div>
            
            {/* Spread Risk */}
            {result.spreadRisk && (
              <div className={`${getSpreadRiskColor(result.spreadRisk)} p-2 rounded-md`}>
                <div className="flex items-center mb-1">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <h4 className="text-sm font-medium">Spread risk</h4>
                </div>
                <p className="text-sm ml-7">{result.spreadRisk}</p>
              </div>
            )}
          </div>
          
          {/* Symptoms */}
          {result.symptoms && result.symptoms.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="symptoms">
                <AccordionTrigger className="py-2">
                  <div className="flex items-center">
                    <Microscope className="h-4 w-4 text-agro-green-700 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Identified symptoms</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 ml-6 mt-1">
                    {result.symptoms.map((symptom, index) => (
                      <li key={index} className="text-sm text-gray-600">• {symptom}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          
          {/* Treatment */}
          <div>
            <div className="flex items-center mb-2">
              <FlaskConical className="h-4 w-4 text-green-700 mr-2" />
              <h4 className="text-sm font-medium text-gray-700">Recommended treatment</h4>
            </div>
            <p className="text-sm text-gray-600 ml-6">{result.treatment}</p>
          </div>
          
          {/* Specific Product Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="recommendations">
                <AccordionTrigger className="py-2">
                  <div className="flex items-center">
                    <Info className="h-4 w-4 text-blue-700 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Recommended products</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, index) => (
                      <div 
                        key={index}
                        className="p-3 bg-blue-50 border border-blue-100 rounded-md"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-blue-800">{rec.product || rec.name}</p>
                            <p className="text-xs text-gray-600">{rec.activeIngredient}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-3 text-xs">
                          <div>
                            <p className="font-medium text-gray-600">Dosage:</p>
                            <p>{rec.dosage}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">Application:</p>
                            <p>{rec.application}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">Interval:</p>
                            <p>{rec.interval}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">Pre-harvest:</p>
                            <p>{rec.preharvest}</p>
                          </div>
                        </div>
                        
                        <Separator className="my-2" />
                        
                        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                          <div>
                            <p className="font-medium text-gray-600">Best timing:</p>
                            <p>{rec.timing}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">Weather conditions:</p>
                            <p>{rec.weather}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          
          {/* Preventive Measures */}
          {result.preventiveMeasures && result.preventiveMeasures.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="preventive-measures">
                <AccordionTrigger className="py-2">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-green-700 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Preventive measures</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 ml-6 mt-1">
                    {result.preventiveMeasures.map((measure, index) => (
                      <li key={index} className="text-sm text-gray-600">• {measure}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          
          {/* Extra Tip */}
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-start">
              <LightbulbIcon className="h-4 w-4 text-green-700 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-green-800">Extra tip</h4>
                <p className="text-sm text-green-700">{result.extraTip}</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleShare}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            
            <Button 
              variant="default" 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={onNewAnalysis}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              New analysis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCardEn;
