
import React, { useCallback } from "react";
import { CalendarCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useActivityPreviewData } from "@/hooks/use-activity-preview-data";
import { ActivityItem } from "./ActivityItem";
import { ActivityLoadingState } from "./ActivityLoadingState";
import { ActivityErrorState } from "./ActivityErrorState";
import { ActivityEmptyState } from "./ActivityEmptyState";

export const ActivityPreview = () => {
  const { activities, loading, error, handleRetry, fetchActivities } = useActivityPreviewData();
  
  // Callback function to refresh activities when status changes
  const handleActivityStatusChange = useCallback(() => {
    fetchActivities();
  }, [fetchActivities]);

  return (
    <Card className="border border-gray-100 shadow-sm bg-white">
      <CardHeader className="pb-0 pt-3 px-3">
        <CardTitle className="text-xl flex justify-between items-center">
          <Link to="/atividades" className="hover:text-green-700 transition-colors flex items-center">
            <CalendarCheck className="h-5 w-5 mr-2 text-green-600" />
            <span>Próximas Atividades</span>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-3">
        {loading ? (
          <ActivityLoadingState />
        ) : error ? (
          <ActivityErrorState error={error} onRetry={handleRetry} />
        ) : activities.length > 0 ? (
          <>
            {activities.map((activity) => (
              <ActivityItem 
                key={activity.id} 
                activity={activity} 
                onStatusChange={handleActivityStatusChange}
              />
            ))}
            <div className="pt-2">
              <Link 
                to="/atividades" 
                className="text-sm text-green-600 hover:text-green-700 font-medium flex justify-end"
              >
                Ver todas &rarr;
              </Link>
            </div>
          </>
        ) : (
          <ActivityEmptyState />
        )}
      </CardContent>
    </Card>
  );
};
