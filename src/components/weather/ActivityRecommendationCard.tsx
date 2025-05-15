
interface ActivityRecommendation {
  activity: string;
  status: "ideal" | "caution" | "avoid";
  reason: string;
}

interface ActivityRecommendationCardProps {
  activity: ActivityRecommendation;
}

export const ActivityRecommendationCard: React.FC<ActivityRecommendationCardProps> = ({ activity }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ideal": return "bg-green-100 text-green-800 border-green-200";
      case "caution": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "avoid": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "ideal": return "Ideal";
      case "caution": return "Cautela";
      case "avoid": return "Evitar";
      default: return "Desconhecido";
    }
  };

  return (
    <div className={`p-4 rounded-md border ${getStatusColor(activity.status)}`}>
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-lg">{activity.activity}</h3>
        <span className={`px-2 py-1 text-sm rounded-full ${getStatusColor(activity.status)}`}>
          {getStatusText(activity.status)}
        </span>
      </div>
      <p className="text-sm mt-2">{activity.reason}</p>
    </div>
  );
};
