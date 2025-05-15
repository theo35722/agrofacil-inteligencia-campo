
import { Separator } from "@/components/ui/separator";

interface WeatherRecommendationProps {
  recommendation: string;
  rainChance: number;
}

export const WeatherRecommendation: React.FC<WeatherRecommendationProps> = ({ recommendation, rainChance }) => {
  if (!recommendation) return null;
  
  return (
    <>
      <Separator className="my-4" />
      <div className={`p-3 rounded-md ${rainChance >= 50 ? "bg-agro-blue-50 border border-agro-blue-100" : "bg-agro-green-50 border border-agro-green-100"}`}>
        <p className={`text-sm ${rainChance >= 50 ? "text-agro-blue-800" : "text-agro-green-800"}`}>
          <strong>Recomendação:</strong> {recommendation}
        </p>
      </div>
    </>
  );
};
