
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { RequestBody } from './types.ts';
import { processWeatherData } from './utils.ts';

// Main handler function
const handler = async (req: Request): Promise<Response> => {
  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get OpenWeather API key from environment variables
    const apiKey = Deno.env.get('OPENWEATHER_API_KEY');
    if (!apiKey) {
      console.error('API key not found in environment variables');
      throw new Error('API key not found in environment variables');
    }

    // Get lat/lon from request body
    let requestBody: RequestBody;
    try {
      requestBody = await req.json() as RequestBody;
      console.log('Received request for coordinates:', requestBody);
    } catch (error) {
      console.error('Error processing request body:', error);
      throw new Error('Error processing request body: invalid JSON format');
    }
    
    const { latitude, longitude } = requestBody;
    
    if (!latitude || !longitude) {
      console.error('Required parameters not provided:', requestBody);
      throw new Error('Latitude and longitude are required');
    }

    // Instead of using the One Call API (3.0), use free endpoints
    // 1. Fetch current weather data
    console.log(`Fetching current weather data for ${latitude}, ${longitude}`);
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=pt_br&appid=${apiKey}`;
    const currentResponse = await fetch(currentWeatherUrl);
    
    if (!currentResponse.ok) {
      const errorText = await currentResponse.text();
      console.error(`Error in OpenWeather API (current): ${currentResponse.status}`, errorText);
      throw new Error(`Error in OpenWeather API (current): ${currentResponse.status} - ${errorText}`);
    }
    
    const currentData = await currentResponse.json();
    console.log('Current data received successfully');
    
    // 2. Fetch 5-day forecast
    console.log('Fetching 5-day forecast');
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=pt_br&appid=${apiKey}`;
    const forecastResponse = await fetch(forecastUrl);
    
    if (!forecastResponse.ok) {
      const errorText = await forecastResponse.text();
      console.error(`Error in OpenWeather API (forecast): ${forecastResponse.status}`, errorText);
      throw new Error(`Error in OpenWeather API (forecast): ${forecastResponse.status} - ${errorText}`);
    }
    
    const forecastData = await forecastResponse.json();
    console.log('Forecast data received successfully');
    
    // Process data to the format expected by the frontend
    const processedData = processWeatherData(currentData, forecastData);
    console.log('Data processed successfully');

    // Return the processed weather data
    return new Response(JSON.stringify(processedData), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    // Handle errors
    console.error('Error processing request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

// Start the server
serve(handler);
