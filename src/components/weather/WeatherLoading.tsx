
interface WeatherLoadingProps {
  isAutoRefreshing?: boolean;
}

export const WeatherLoading = ({ isAutoRefreshing }: WeatherLoadingProps) => {
  return (
    <div className="space-y-4">
      {isAutoRefreshing && (
        <div className="p-2 bg-blue-50 text-blue-700 text-sm rounded-md mb-2">
          Atualizando dados automáticamente...
        </div>
      )}
      <div className="w-full h-48 bg-gray-100 animate-pulse rounded-lg"></div>
      <div className="w-full h-24 bg-gray-100 animate-pulse rounded-lg"></div>
      <div className="w-full h-24 bg-gray-100 animate-pulse rounded-lg"></div>
    </div>
  );
};
