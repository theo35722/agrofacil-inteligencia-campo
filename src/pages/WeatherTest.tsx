
import React from "react";
import { NewWeatherCard } from "@/components/weather/NewWeatherCard";

const WeatherTest: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Previsão do Tempo</h1>
      <div className="max-w-md mx-auto">
        <NewWeatherCard />
      </div>
    </div>
  );
};

export default WeatherTest;
