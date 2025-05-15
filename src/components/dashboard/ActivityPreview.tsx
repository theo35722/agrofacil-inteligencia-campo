
import { CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export const ActivityPreview = () => {
  // Mock data para demo
  const activities = [
    {
      date: "14 mai",
      type: "Adubação",
      field: "Talhão 3 - Milho",
      status: "pendente",
    },
    {
      date: "16 mai",
      type: "Pulverização",
      field: "Talhão 1 - Soja",
      status: "planejada",
    },
  ];

  return (
    <Card className="border border-gray-100 shadow-sm bg-white">
      <CardHeader className="pb-0 pt-3 px-3">
        <CardTitle className="text-xl flex justify-between items-center">
          Próximas Atividades
          <CalendarCheck className="h-5 w-5 text-gray-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-3">
        {activities.map((activity, index) => (
          <div 
            key={index}
            className="flex justify-between items-center p-2 rounded-md bg-white border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                {activity.date}
              </div>
              <div>
                <p className="font-medium">{activity.type}</p>
                <p className="text-xs text-gray-500">{activity.field}</p>
              </div>
            </div>
            <div>
              <Badge 
                className={activity.status === "pendente" 
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-blue-400 hover:bg-blue-500"
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
            className="text-sm text-green-600 hover:text-green-700 font-medium flex justify-end"
          >
            Ver todas &rarr;
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
