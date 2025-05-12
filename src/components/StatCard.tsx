
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | ReactNode;
  loading?: boolean;
}

const StatCard = ({ title, value, loading = false }: StatCardProps) => {
  return (
    <div className="stat-card">
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
      {loading ? (
        <div className="mt-2">
          <p className="text-xl font-semibold">Loading...</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Fetching data...</p>
        </div>
      ) : (
        <div className="mt-2">
          <p className="text-xl font-semibold">{value}</p>
        </div>
      )}
    </div>
  );
};

export default StatCard;
