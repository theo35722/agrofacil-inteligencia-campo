
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
  className?: string;
  bgColor?: string;
  textColor?: string;
};

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  to,
  className,
  bgColor = "bg-agro-green-100",
  textColor = "text-agro-green-800"
}: FeatureCardProps) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "group flex flex-col items-center justify-center p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent",
        bgColor === "bg-agro-green-500" ? "hover:bg-agro-green-600" : "hover:border-agro-green-300",
        className
      )}
      style={{ 
        backgroundColor: bgColor === "bg-agro-green-500" ? "#4CAF50" : "#f9f9f9" 
      }}
    >
      <div className={`mb-3 p-4 rounded-full flex items-center justify-center ${bgColor === "bg-agro-green-500" ? "bg-white bg-opacity-20" : "bg-agro-green-100"}`}>
        <Icon className={`h-8 w-8 ${bgColor === "bg-agro-green-500" ? "text-white" : "text-agro-green-600"}`} />
      </div>
      <h3 className={`font-semibold text-center ${bgColor === "bg-agro-green-500" ? "text-white" : textColor}`}>
        {title}
      </h3>
      <p className={`text-sm text-center mt-2 ${bgColor === "bg-agro-green-500" ? "text-white text-opacity-90" : "text-gray-600"}`}>
        {description}
      </p>
    </Link>
  );
};
