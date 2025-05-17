
import React from "react";
import { Link } from "react-router-dom";
import { LavouraSection } from "@/components/dashboard/LavouraSection";
import { Lavoura, Talhao } from "@/types/agro";

interface DashboardLavouraSectionProps {
  loading: boolean;
  error: string | null;
  talhoes: Talhao[];
  lavouras: Lavoura[];
  dataKey: number;
}

export const DashboardLavouraSection: React.FC<DashboardLavouraSectionProps> = ({
  loading,
  error,
  talhoes,
  lavouras,
  dataKey
}) => {
  return (
    <div className="mx-4 mt-2">
      <h2 className="text-xl font-bold mb-2 flex items-center justify-between">
        <Link to="/lavouras" className="text-inherit hover:text-green-700">
          Suas Lavouras
        </Link>
        <Link to="/lavouras/nova" className="text-sm text-green-600 hover:text-green-700">
          + Nova Lavoura
        </Link>
      </h2>
      <LavouraSection 
        loading={loading}
        error={error}
        talhoes={talhoes}
        lavouras={lavouras}
        key={`lavouras-${dataKey}`} // Force re-render on data change
      />
    </div>
  );
};
