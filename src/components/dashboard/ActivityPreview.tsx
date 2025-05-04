
import { CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export const ActivityPreview = () => {
  // Mock data for demo
  const activities = [
    {
      date: "14/05/2025",
      type: "Adubação",
      field: "Talhão 3 - Milho",
      status: "pendente",
    },
    {
      date: "16/05/2025",
      type: "Pulverização",
      field: "Talhão 1 - Soja",
      status: "planejada",
    },
  ];

  return (
    <Card className="agro-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-agro-green-800 flex justify-between items-center">
          Próximas Atividades
          <CalendarCheck className="h-5 w-5 text-agro-green-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity, index) => (
          <div 
            key={index}
            className="flex justify-between items-center p-2 rounded-md border border-gray-100 bg-gray-50"
          >
            <div>
              <p className="font-medium text-agro-green-700">{activity.type}</p>
              <p className="text-sm text-gray-500">{activity.field}</p>
              <p className="text-xs text-gray-400">{activity.date}</p>
            </div>
            <div>
              <Badge 
                className={activity.status === "pendente" 
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-agro-blue-400 hover:bg-agro-blue-500"
                }
              >
                {activity.status === "pendente" ? "Pendente" : "Planejada"}
              </Badge>
            </div>
          </div>
        ))}

        <div className="pt-2">
          <Link 
            to="/atividades" 
            className="text-sm text-agro-green-600 hover:text-agro-green-700 font-medium flex justify-end"
          >
            Ver todas &rarr;
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
