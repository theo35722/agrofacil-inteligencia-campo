
import { TodayForecast } from "@/components/weather/TodayForecast";
import { ForecastView } from "@/components/weather/ForecastView";
import { ActivityRecommendations } from "@/components/weather/ActivityRecommendations";
import { WeatherLoading } from "@/components/weather/WeatherLoading";
import { WeatherError } from "@/components/weather/WeatherError";
import { LocationErrorAlert } from "@/components/weather/LocationErrorAlert";
import { WeatherFetchAlert } from "@/components/weather/WeatherFetchAlert";
import { ActivityRecommendation, WeatherDay } from "@/types/weather";

interface WeatherContentManagerProps {
  isLoading: boolean;
  isError: boolean;
  locationError: string | null;
  locationFetchError: string | null;
  permissionDenied: boolean;
  view: string;
  selectedLocation: string;
  data: {
    forecast: WeatherDay[];
  } | undefined;
  activityRecommendations: ActivityRecommendation[];
  onRetryLocation: () => void;
  onRefreshWeather: () => void;
}

export const WeatherContentManager = ({
  isLoading,
  isError,
  locationError,
  locationFetchError,
  permissionDenied,
  view,
  selectedLocation,
  data,
  activityRecommendations,
  onRetryLocation,
  onRefreshWeather
}: WeatherContentManagerProps) => {
  // Display location errors if any
  if (locationError) {
    return (
      <>
        <LocationErrorAlert 
          error={locationError}
          permissionDenied={permissionDenied}
          onRetry={onRetryLocation}
        />
        {isLoading && <WeatherLoading />}
      </>
    );
  }

  if (locationFetchError && !locationError) {
    return (
      <>
        <WeatherFetchAlert error={locationFetchError} />
        {isLoading && <WeatherLoading />}
      </>
    );
  }
  
  // Display loading state
  if (isLoading) {
    return <WeatherLoading />;
  }
  
  // Display error state
  if (isError || !data || !data.forecast || data.forecast.length === 0) {
    return <WeatherError onRetry={onRefreshWeather} />;
  }

  // Display weather content
  return (
    <>
      <TodayForecast forecast={data.forecast[0]} location={selectedLocation} />
      
      {view === "forecast" && (
        <ForecastView forecast={data.forecast} />
      )}
      
      {view === "activities" && (
        <ActivityRecommendations recommendations={activityRecommendations} />
      )}
    </>
  );
};
