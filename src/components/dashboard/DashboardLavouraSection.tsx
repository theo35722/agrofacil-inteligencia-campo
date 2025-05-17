
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
  // Use actual talhoes count for the badge
  const talhaoCount = Array.isArray(talhoes) ? talhoes.length : 0;

  return (
    <div className="mx-4 mt-2">
      <h2 className="text-xl font-bold mb-2 flex items-center justify-between">
        <Link to="/lavouras" className="text-inherit hover:text-green-700 flex items-center">
          Suas Lavouras
          {talhaoCount > 0 && (
            <span className="ml-2 text-sm bg-green-100 text-green-800 rounded-full px-2 py-0.5">
              {talhaoCount}
            </span>
          )}
        </Link>
        <Link to="/lavouras" className="text-sm text-green-600 hover:text-green-700">
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
