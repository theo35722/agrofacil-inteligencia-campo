
interface WeatherLoadingProps {
  isAutoRefreshing?: boolean;
  simplified?: boolean;
}

export const WeatherLoading = ({ isAutoRefreshing, simplified }: WeatherLoadingProps) => {
  if (simplified) {
    return (
      <div className="animate-pulse">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="h-14 w-14 bg-gray-200 rounded-full"></div>
        </div>
        <div className="mt-3 h-10 w-full bg-gray-200 rounded"></div>
      </div>
    );
  }
  
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
