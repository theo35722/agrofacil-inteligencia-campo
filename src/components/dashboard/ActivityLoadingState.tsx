
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ActivityLoadingState: React.FC = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
};
