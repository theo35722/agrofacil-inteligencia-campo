
import { Atividade } from "@/types/agro";
import { ActivityListItem } from "./ActivityListItem";
import { ActivityFilters } from "./ActivityFilters";
import { TabsContent } from "@/components/ui/tabs";

interface ActivityListProps {
  activities: Array<Atividade & {
    field?: string;
    plot?: string;
  }>;
  loading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile: boolean;
}

export function ActivityList({
  activities,
  loading,
  activeTab,
  setActiveTab,
  isMobile
}: ActivityListProps) {
  const filteredActivities = activities.filter(activity => {
    if (activeTab === "all") return true;
    return activity.status === activeTab;
  });

  return (
    <>
      <ActivityFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobile={isMobile}
      />

      <TabsContent value={activeTab} className="focus-visible:outline-none">
        {loading ? (
          <div className="text-center py-6">
            <p className="text-gray-500">Carregando atividades...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">
              Nenhuma atividade {activeTab !== "all" ? `${activeTab}` : ""} registrada.
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Adicione uma atividade para iniciar o controle da sua lavoura.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map((activity) => (
              <ActivityListItem key={activity.id} activity={activity} isMobile={isMobile} />
            ))}
          </div>
        )}
      </TabsContent>
    </>
  );
}
