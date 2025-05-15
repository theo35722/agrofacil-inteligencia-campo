
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityRecommendationCard } from "./ActivityRecommendationCard";
import { ActivityRecommendation } from "../../types/weather";

interface ActivityRecommendationsProps {
  recommendations: ActivityRecommendation[];
}

export const ActivityRecommendations: React.FC<ActivityRecommendationsProps> = ({ recommendations }) => {
  return (
    <Card className="agro-card">
      <CardHeader>
        <CardTitle>Recomendações para Atividades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((activity, index) => (
            <ActivityRecommendationCard key={index} activity={activity} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
