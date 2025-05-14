import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
  className?: string;
};
export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  to,
  className
}: FeatureCardProps) => {
  return <Link to={to} className={cn("agro-icon-button group", className)}>
      <div className="mb-2 p-3 rounded-full bg-agro-green-100 group-hover:bg-agro-green-200 transition-colors">
        <Icon className="h-10 w-10 text-agro-green-600" />
      </div>
      <h3 className="text-agro-green-800 font-semibold">{title}</h3>
      <p className="text-sm text-gray-500 text-center mt-1">{description}</p>
    </Link>;
};